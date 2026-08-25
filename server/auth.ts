import bcrypt from "bcryptjs";
import type { Context, Next } from "hono";
import { audit, getDb, initDb, isDbReady } from "./db.js";
import { loginDemoUser } from "./demo-users.js";
import { createSessionToken, verifySessionToken } from "./session-token.js";

export type UserRole = "admin" | "editor" | "viewer";

export interface SessionUser {
  id: string;
  username: string;
  role: UserRole;
}

export const SESSION_COOKIE = "hub_session";
const SESSION_DAYS = 7;

export function loginUser(
  username: string,
  password: string,
): SessionUser | null {
  initDb();
  const db = getDb();

  if (db && isDbReady()) {
    const row = db
      .prepare(
        "SELECT id, username, password_hash, role FROM users WHERE username = ? COLLATE NOCASE",
      )
      .get(username) as
      | { id: string; username: string; password_hash: string; role: UserRole }
      | undefined;

    if (row && bcrypt.compareSync(password, row.password_hash)) {
      return { id: row.id, username: row.username, role: row.role };
    }
  }

  return loginDemoUser(username, password);
}

export function getUserFromSession(
  token: string | undefined,
): SessionUser | null {
  if (!token) return null;
  return verifySessionToken(token);
}

export function authMiddleware() {
  return async (c: Context, next: Next) => {
    const token = getCookie(c, SESSION_COOKIE);
    const user = getUserFromSession(token);
    if (user) c.set("user", user);
    await next();
  };
}

export function requireAuth() {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as SessionUser | undefined;
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    await next();
  };
}

export function requireRole(...roles: UserRole[]) {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as SessionUser;
    if (!roles.includes(user.role)) return c.json({ error: "Forbidden" }, 403);
    await next();
  };
}

export function requireWriteAccess() {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as SessionUser;
    if (user.role === "viewer")
      return c.json({ error: "Read-only access" }, 403);
    const license = getLicenseStatus();
    if (!license.maintenanceActive || license.expired) {
      return c.json({ error: "License expired — write access disabled" }, 403);
    }
    await next();
  };
}

export function getLicenseStatus() {
  initDb();
  const db = getDb();
  if (db && isDbReady()) {
    const row = db
      .prepare("SELECT value FROM app_settings WHERE key = 'license'")
      .get() as { value: string } | undefined;
    if (row) {
      const parsed = JSON.parse(row.value) as {
        valid: boolean;
        expiresAt: string;
        maintenanceActive: boolean;
      };
      const expired = new Date(parsed.expiresAt) < new Date();
      return {
        ...parsed,
        expired,
        canWrite: parsed.maintenanceActive && !expired,
      };
    }
  }

  const expiresAt =
    process.env.LICENSE_EXPIRES ??
    new Date(Date.now() + 365 * 86400000).toISOString();
  const expired = new Date(expiresAt) < new Date();
  return {
    valid: true,
    expiresAt,
    maintenanceActive: true,
    expired,
    canWrite: !expired,
  };
}

function getCookie(c: Context, name: string): string | undefined {
  const cookie = c.req.header("cookie");
  if (!cookie) return undefined;
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function setSessionCookie(c: Context, user: SessionUser) {
  const token = createSessionToken(user);
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const secure =
    process.env.VERCEL || process.env.NODE_ENV === "production"
      ? "; Secure"
      : "";
  c.header(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`,
  );
}

export function clearSessionCookie(c: Context) {
  const secure =
    process.env.VERCEL || process.env.NODE_ENV === "production"
      ? "; Secure"
      : "";
  c.header(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax${secure}`,
  );
}

export { audit };

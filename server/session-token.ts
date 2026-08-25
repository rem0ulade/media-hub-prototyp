import { createHmac, timingSafeEqual } from "node:crypto";
import type { SessionUser } from "./auth.js";

const SECRET =
  process.env.SESSION_SECRET ?? "dev-only-change-in-production-min-32-chars!!";
const MAX_AGE_SEC = 7 * 24 * 60 * 60;

function b64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function fromB64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

export function createSessionToken(user: SessionUser): string {
  const payload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SEC,
  };
  const data = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = createHmac("sha256", SECRET)
    .update(data)
    .digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(fromB64url(data)) as SessionUser & {
      exp: number;
    };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.id, username: payload.username, role: payload.role };
  } catch {
    return null;
  }
}

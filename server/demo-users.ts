import bcrypt from "bcryptjs";
import { DEMO_ACCOUNTS } from "../shared/demo-credentials.js";
import type { SessionUser } from "./auth.js";

/** Fallback wenn SQLite auf Vercel nicht lädt — gleiche Zugänge wie im Browser-Demo */
export function loginDemoUser(
  username: string,
  password: string,
): SessionUser | null {
  const row = DEMO_ACCOUNTS.find(
    u => u.username.toLowerCase() === username.trim().toLowerCase(),
  );
  if (!row || row.password !== password) return null;
  return { id: row.id, username: row.username, role: row.role };
}

export function getDemoPasswordHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

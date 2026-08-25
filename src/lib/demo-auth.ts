import { basePreset } from "@/config/presets/base";
import type { BrandId } from "@/config/presets/types";
import type { AuthUser } from "@/contexts/AuthContext";

function storageKey(brandId: BrandId) {
  return `hub_demo_session_${brandId}`;
}

function toAuthUser(row: {
  id: string;
  username: string;
  role: AuthUser["role"];
}): AuthUser {
  return { id: row.id, username: row.username, role: row.role };
}

export function demoLogin(
  _brandId: BrandId,
  username: string,
  password: string,
): AuthUser | null {
  const row = basePreset.demoAccounts.find(
    u => u.username.toLowerCase() === username.trim().toLowerCase(),
  );
  if (!row || row.password !== password) return null;
  return toAuthUser(row);
}

/** One-click public demo: primary admin, no password prompt. */
export function demoLoginPrimary(): AuthUser | null {
  const row = basePreset.demoAccounts[0];
  if (!row) return null;
  return toAuthUser(row);
}

export function saveDemoSession(brandId: BrandId, user: AuthUser) {
  sessionStorage.setItem(storageKey(brandId), JSON.stringify(user));
}

export function loadDemoSession(brandId: BrandId): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(storageKey(brandId));
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearDemoSession(brandId: BrandId) {
  sessionStorage.removeItem(storageKey(brandId));
}

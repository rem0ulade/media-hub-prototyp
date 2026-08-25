import { basePreset } from "@/config/presets/base";
import type { BrandId } from "@/config/presets/types";
import type { AuthUser } from "@/contexts/AuthContext";

function storageKey(brandId: BrandId) {
  return `hub_demo_session_${brandId}`;
}

export function demoLogin(
  brandId: BrandId,
  username: string,
  password: string,
): AuthUser | null {
  const row = basePreset.demoAccounts.find(
    u => u.username.toLowerCase() === username.trim().toLowerCase(),
  );
  if (!row || row.password !== password) return null;
  return { id: row.id, username: row.username, role: row.role };
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

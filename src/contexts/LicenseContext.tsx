import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export interface LicenseStatus {
  valid: boolean;
  expiresAt: string;
  maintenanceActive: boolean;
  expired: boolean;
  canWrite: boolean;
}

interface LicenseState {
  license: LicenseStatus | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const LicenseContext = createContext<LicenseState | null>(null);

export function useLicense() {
  const ctx = useContext(LicenseContext);
  if (!ctx) throw new Error("useLicense must be used within LicenseProvider");
  return ctx;
}

export function LicenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [license, setLicense] = useState<LicenseStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setLicense(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<LicenseStatus>("/api/license");
      setLicense(data);
    } catch {
      setLicense(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <LicenseContext.Provider value={{ license, loading, refresh }}>
      {children}
    </LicenseContext.Provider>
  );
}

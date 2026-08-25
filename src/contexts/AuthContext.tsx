import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useBrandPreset } from "@/contexts/BrandPresetContext";
import { ApiError, api } from "@/lib/api";
import {
  clearDemoSession,
  demoLogin,
  loadDemoSession,
  saveDemoSession,
} from "@/lib/demo-auth";
import { isStaticDemo } from "@/lib/static-demo";

export type UserRole = "admin" | "editor" | "viewer";

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  apiOnline: boolean;
  usingDemoAuth: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  canWrite: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function shouldUseDemoFallback(err: unknown): boolean {
  if (isStaticDemo) return true;
  if (!(err instanceof ApiError)) return true;
  return (
    err.status === 0 ||
    err.status === 404 ||
    err.status === 405 ||
    err.status === 500 ||
    err.status === 502 ||
    err.status === 503
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { brandId } = useBrandPreset();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(false);
  const [usingDemoAuth, setUsingDemoAuth] = useState(false);

  const refresh = useCallback(async () => {
    const demoUser = loadDemoSession(brandId);
    if (demoUser) {
      setUser(demoUser);
      setUsingDemoAuth(true);
      setApiOnline(false);
      setLoading(false);
      return;
    }

    if (isStaticDemo) {
      setApiOnline(false);
      setUser(null);
      setUsingDemoAuth(false);
      setLoading(false);
      return;
    }

    try {
      const { user: u } = await api.get<{ user: AuthUser | null }>(
        "/api/auth/me",
      );
      setUser(u);
      setUsingDemoAuth(false);
      setApiOnline(true);
    } catch {
      setApiOnline(false);
      setUser(null);
      setUsingDemoAuth(false);
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (username: string, password: string) => {
      if (isStaticDemo) {
        const demo = demoLogin(brandId, username, password);
        if (!demo) throw new ApiError("Ungültige Zugangsdaten", 401);
        saveDemoSession(brandId, demo);
        setUser(demo);
        setUsingDemoAuth(true);
        setApiOnline(false);
        return;
      }

      try {
        const { user: u } = await api.post<{ user: AuthUser }>(
          "/api/auth/login",
          { username, password },
        );
        clearDemoSession(brandId);
        setUser(u);
        setUsingDemoAuth(false);
        setApiOnline(true);
      } catch (err) {
        if (!shouldUseDemoFallback(err)) throw err;

        const demo = demoLogin(brandId, username, password);
        if (!demo) {
          throw err instanceof ApiError
            ? err
            : new ApiError("Ungültige Zugangsdaten", 401);
        }
        saveDemoSession(brandId, demo);
        setUser(demo);
        setUsingDemoAuth(true);
        setApiOnline(false);
      }
    },
    [brandId],
  );

  const logout = useCallback(async () => {
    if (!usingDemoAuth) {
      try {
        await api.post("/api/auth/logout");
      } catch {
        /* ignore */
      }
    }
    clearDemoSession(brandId);
    setUser(null);
    setUsingDemoAuth(false);
  }, [brandId, usingDemoAuth]);

  const canWrite = user?.role !== "viewer";
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        apiOnline,
        usingDemoAuth,
        login,
        logout,
        canWrite,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";
import { t } from "@/config/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useBrandPreset } from "@/contexts/BrandPresetContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const { to } = useBrandPreset();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-white/60">
          <Loader2 className="size-8 animate-spin text-burgundy-400" />
          <span className="text-sm">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to={to("/login")} replace />;

  return <Outlet />;
}

export function AdminRoute() {
  const { user, loading } = useAuth();
  const { to } = useBrandPreset();

  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to={to("/")} replace />;

  return <Outlet />;
}

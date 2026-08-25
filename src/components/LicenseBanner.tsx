import { AlertTriangle } from "lucide-react";
import { t } from "@/config/locale";
import { useLicense } from "@/contexts/LicenseContext";

export function LicenseBanner() {
  const { license } = useLicense();

  if (!license || license.canWrite) return null;

  return (
    <div className="bg-amber-950/80 border-b border-amber-700/40 px-4 py-2 flex items-center gap-2 text-amber-200 text-xs sm:text-sm">
      <AlertTriangle className="size-4 shrink-0" />
      <span>{t("licenseExpired")}</span>
    </div>
  );
}

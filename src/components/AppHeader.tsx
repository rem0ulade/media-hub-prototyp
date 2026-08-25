import { FileSpreadsheet, Loader2, X } from "lucide-react";
import { useRef } from "react";
import { DemoInfoBadge } from "@/components/DemoInfoBadge";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { t } from "@/config/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useBrand } from "@/contexts/BrandContext";
import { useBrandPreset } from "@/contexts/BrandPresetContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useLicense } from "@/contexts/LicenseContext";

export function AppHeader() {
  const { brand } = useBrand();
  const { preset } = useBrandPreset();
  const { canWrite, usingDemoAuth } = useAuth();
  const { license } = useLicense();
  const {
    dataSource,
    fileName,
    lastUpload,
    isLoading,
    error,
    uploadExcel,
    resetToStatic,
  } = useDashboardData();
  const writeAllowed = canWrite && (license?.canWrite ?? true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadExcel(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <header className="border-b border-burgundy-800/25 bg-gradient-to-r from-burgundy-950/30 via-burgundy-950/10 to-transparent px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: brand on mobile, status badges */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <div className="flex md:hidden items-center gap-2 mr-1 min-w-0">
            <BrandLogo className="size-7 shrink-0" />
            <span className="text-sm font-bold text-white truncate">
              {brand.companyName}
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-burgundy-600/35 text-burgundy-300 text-xs uppercase tracking-wider"
          >
            {brand.fiscalYear}
          </Badge>

          <Badge
            variant="outline"
            className="border-burgundy-700/25 text-burgundy-200/55 text-xs inline-flex"
          >
            {dataSource === "excel" && lastUpload
              ? `Excel: ${lastUpload.toLocaleDateString("de-DE")} ${lastUpload.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`
              : `${t("asOf")}: ${brand.dataAsOf}`}
          </Badge>

          {(usingDemoAuth || dataSource === "static") &&
            preset.showDemoChrome && <DemoInfoBadge />}
        </div>

        {/* Right: upload controls */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          {dataSource === "excel" && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400/80 bg-emerald-900/15 border border-emerald-800/25 rounded-full px-2.5 py-1">
              <FileSpreadsheet className="size-3" />
              <span className="max-w-[120px] truncate">{fileName}</span>
              <button
                onClick={resetToStatic}
                className="ml-1 hover:text-white transition-colors"
                title={t("resetDemoData")}
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400/80 bg-rose-900/15 border border-rose-800/25 rounded-full px-2.5 py-1 max-w-[200px] sm:max-w-[280px]">
              <span className="truncate">{error}</span>
              <button
                onClick={resetToStatic}
                className="ml-1 hover:text-white transition-colors shrink-0"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          {/* Desktop: full label button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || !writeAllowed}
            title={writeAllowed ? t("uploadExcel") : t("readOnly")}
            className="hidden sm:flex border-burgundy-700/40 bg-burgundy-950/30 hover:bg-burgundy-900/35 text-burgundy-200 text-xs h-8 gap-1.5"
          >
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="size-3.5" />
            )}
            {t("uploadExcel")}
          </Button>

          {/* Mobile: icon-only button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || !writeAllowed}
            title={writeAllowed ? t("uploadExcel") : t("readOnly")}
            className="sm:hidden border-burgundy-700/40 bg-burgundy-950/30 hover:bg-burgundy-900/35 text-burgundy-200 size-8"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

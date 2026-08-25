import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { DemoInfoBadge } from "@/components/DemoInfoBadge";
import { t } from "@/config/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useBrand } from "@/contexts/BrandContext";
import { useBrandPreset } from "@/contexts/BrandPresetContext";

export function DemoVersionBanner() {
  const { usingDemoAuth } = useAuth();
  const { brand } = useBrand();
  const { preset } = useBrandPreset();

  useEffect(() => {
    if (!usingDemoAuth || !preset.showDemoChrome) return;
    const base = `${brand.companyName} — ${t("demoVersionTitle")}`;
    document.title = base;
    return () => {
      document.title = brand.pageTitle;
    };
  }, [
    usingDemoAuth,
    preset.showDemoChrome,
    brand.companyName,
    brand.pageTitle,
  ]);

  if (!usingDemoAuth || !preset.showDemoChrome) return null;

  return (
    <div className="demo-banner bg-gradient-to-r from-[var(--demo-banner-from)] via-[var(--demo-banner-via)] to-[var(--demo-banner-from)] border-b border-[var(--demo-banner-border)] px-4 py-2.5">
      <div className="max-w-[1440px] mx-auto flex items-center gap-3 text-sm">
        <span className="flex items-center justify-center size-8 rounded-full bg-[var(--demo-banner-accent)] shrink-0">
          <Sparkles className="size-4 text-[var(--demo-banner-text)]" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--demo-banner-text)]">
            {t("demoVersionTitle")}
          </p>
          <p className="text-xs text-[var(--demo-banner-muted)] truncate">
            {t("demoVersionHint")}
          </p>
        </div>
        <DemoInfoBadge className="hidden sm:inline-flex ml-auto shrink-0" />
      </div>
    </div>
  );
}

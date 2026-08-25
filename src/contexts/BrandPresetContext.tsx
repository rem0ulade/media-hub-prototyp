import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { setLocale } from "@/config/locale";
import { basePreset } from "@/config/presets/base";
import type { BrandId, BrandPreset } from "@/config/presets/types";

interface BrandPresetState {
  brandId: BrandId;
  preset: BrandPreset;
  basePath: string;
  to: (path: string) => string;
}

const BrandPresetContext = createContext<BrandPresetState | null>(null);

export function useBrandPreset() {
  const ctx = useContext(BrandPresetContext);
  if (!ctx)
    throw new Error("useBrandPreset must be used within BrandPresetProvider");
  return ctx;
}

export function BrandPresetProvider({ children }: { children: ReactNode }) {
  const value = useMemo<BrandPresetState>(
    () => ({
      brandId: "base",
      preset: basePreset,
      basePath: "",
      to: (path: string) => (path.startsWith("/") ? path : `/${path}`),
    }),
    [],
  );

  useEffect(() => {
    document.documentElement.dataset.brand = value.preset.theme;
    document.documentElement.lang = value.preset.locale;
    setLocale(value.preset.locale);
    if (!value.preset.showDemoChrome) {
      document.title = value.preset.pageTitle;
    }

    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
      favicon.href = `${import.meta.env.BASE_URL}favicon.svg`;
    }

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (description) {
      description.content = `${value.preset.companyName} — ${value.preset.tagline}`;
    }
  }, [value.preset]);

  return (
    <BrandPresetContext.Provider value={value}>
      {children}
    </BrandPresetContext.Provider>
  );
}

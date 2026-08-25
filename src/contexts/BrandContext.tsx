import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Locale, setLocale } from "@/config/locale";
import type { BrandPreset } from "@/config/presets/types";
import { useAuth } from "@/contexts/AuthContext";
import { useBrandPreset } from "@/contexts/BrandPresetContext";
import { api } from "@/lib/api";

export type BrandSettings = {
  companyName: string;
  tagline: string;
  fiscalYear: string;
  dataAsOf: string;
  platformLabel: string;
  defaultContact: string;
  exportFileName: string;
  pageTitle: string;
  locale: Locale;
};

interface BrandState {
  brand: BrandSettings;
  loading: boolean;
  updateBrand: (patch: Partial<BrandSettings>) => Promise<void>;
}

const BrandContext = createContext<BrandState | null>(null);

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within BrandProvider");
  return ctx;
}

function presetToBrand(preset: BrandPreset): BrandSettings {
  return {
    companyName: preset.companyName,
    tagline: preset.tagline,
    fiscalYear: preset.fiscalYear,
    dataAsOf: preset.dataAsOf,
    platformLabel: preset.platformLabel,
    defaultContact: preset.defaultContact,
    exportFileName: preset.exportFileName,
    pageTitle: preset.pageTitle,
    locale: preset.locale,
  };
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const { preset } = useBrandPreset();
  const { user } = useAuth();
  const [brand, setBrand] = useState<BrandSettings>(presetToBrand(preset));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBrand(presetToBrand(preset));
    setLocale(preset.locale);
  }, [preset]);

  const load = useCallback(async () => {
    if (!user) {
      setBrand(presetToBrand(preset));
      setLoading(false);
      return;
    }
    try {
      const data = await api.get<BrandSettings>("/api/settings/brand");
      setBrand({ ...presetToBrand(preset), ...data });
      if (data.locale) setLocale(data.locale);
      if (data.pageTitle) document.title = data.pageTitle;
    } catch {
      setBrand(presetToBrand(preset));
    } finally {
      setLoading(false);
    }
  }, [user, preset]);

  useEffect(() => {
    load();
  }, [load]);

  const updateBrand = useCallback(
    async (patch: Partial<BrandSettings>) => {
      const next = { ...brand, ...patch };
      await api.put("/api/settings/brand", next);
      setBrand(next);
      if (next.locale) setLocale(next.locale);
      if (next.pageTitle) document.title = next.pageTitle;
    },
    [brand],
  );

  return (
    <BrandContext.Provider value={{ brand, loading, updateBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

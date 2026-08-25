import type { DemoAccount } from "../../../shared/demo-credentials";
import type { Locale } from "../locale";

export type BrandId = "base" | "weischer";

export type LogoVariant = "hub" | "weischer";

export interface BrandPreset {
  id: BrandId;
  companyName: string;
  tagline: string;
  fiscalYear: string;
  dataAsOf: string;
  platformLabel: string;
  defaultContact: string;
  exportFileName: string;
  pageTitle: string;
  locale: Locale;
  logo: LogoVariant;
  theme: BrandId;
  /** Subtle demo chrome on static hosting (banner + credential box) */
  showDemoChrome: boolean;
  demoAccounts: DemoAccount[];
}

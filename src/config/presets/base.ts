import { BASE_DEMO_ACCOUNTS } from "../../../shared/demo-credentials";
import type { BrandPreset } from "./types";

export const basePreset: BrandPreset = {
  id: "base",
  companyName: "MediaHub",
  tagline: "Partner Intelligence",
  fiscalYear: "CY 2026",
  dataAsOf: "24. August 2026",
  platformLabel: "Classic & Programmatic",
  defaultContact: "Account Management",
  exportFileName: "mediahub-export",
  pageTitle: "MediaHub — Partner Intelligence",
  locale: "de",
  logo: "hub",
  theme: "base",
  showDemoChrome: true,
  demoAccounts: BASE_DEMO_ACCOUNTS,
};

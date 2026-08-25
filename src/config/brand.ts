import { activePreset } from "./presets";

/**
 * Active brand preset (build-time via VITE_BRAND).
 * For white-label forks: edit src/config/presets/<name>.ts
 */
export const brandConfig = {
  companyName: activePreset.companyName,
  tagline: activePreset.tagline,
  fiscalYear: activePreset.fiscalYear,
  dataAsOf: activePreset.dataAsOf,
  platformLabel: activePreset.platformLabel,
  defaultContact: activePreset.defaultContact,
  exportFileName: activePreset.exportFileName,
  pageTitle: activePreset.pageTitle,
  locale: activePreset.locale,
} as const;

export { activePreset } from "./presets";

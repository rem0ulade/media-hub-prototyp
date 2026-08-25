import type { LucideIcon } from "lucide-react";
import {
  Archive,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Network,
  Settings,
  TrendingUp,
} from "lucide-react";

/**
 * ─── Kunden-Konfiguration (ein File pro Deployment) ───────────────────
 *
 * Für jeden Kunden: Diese Datei anpassen (oder per Admin-UI speichern).
 * Kein Fork der gesamten App nötig — nur Config + optional Demo-Daten/Excel-Mapping.
 *
 * Die App bleibt eine **Web-App** (React SPA im Browser), pro Kunde eigene Instanz.
 */

export type ModuleId =
  | "dashboard"
  | "networks"
  | "contracts"
  | "scorecard"
  | "salesInsights"
  | "backup"
  | "settings";

export interface ModuleConfig {
  enabled: boolean;
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export interface CustomerConfig {
  /** Eindeutige ID dieser Installation (z. B. "kunde-xy-2026") */
  deploymentId: string;

  /** Immer Web — keine Desktop-/Native-App */
  platform: "web";

  /** Anzeigename des Dashboard-Produkts für diesen Kunden */
  productName: string;

  modules: Record<ModuleId, ModuleConfig>;

  /** Labels für KPIs / Entitäten — branchenspezifisch umbenennbar */
  labels: {
    entity: string;
    entityPlural: string;
    fiscalYearShort: string;
    revenueMetric: string;
    platformChannel: string;
  };

  /** Welche Dashboard-Blöcke sichtbar sind */
  dashboard: {
    showRevenueChart: boolean;
    showCumulativeChart: boolean;
    showNetworkMix: boolean;
    showTopEntities: boolean;
    showPacing: boolean;
    showScorecardSummary: boolean;
    showContractAlerts: boolean;
  };
}

export const customerConfig: CustomerConfig = {
  deploymentId: "demo-mediahub",

  platform: "web",

  productName: "Management Hub",

  modules: {
    dashboard: {
      enabled: true,
      label: "Dashboard",
      description: "Management Summary",
      path: "/",
      icon: LayoutDashboard,
    },
    networks: {
      enabled: true,
      label: "Partner",
      description: "Detailzahlen",
      path: "/networks",
      icon: Network,
    },
    contracts: {
      enabled: true,
      label: "Contracts",
      description: "Contract Management",
      path: "/contracts",
      icon: FileText,
    },
    scorecard: {
      enabled: true,
      label: "Score Card",
      description: "Partner Evaluation",
      path: "/scorecard",
      icon: ClipboardCheck,
    },
    salesInsights: {
      enabled: true,
      label: "Sales Insights",
      description: "Pipeline & Potential",
      path: "/sales-insights",
      icon: TrendingUp,
    },
    backup: {
      enabled: true,
      label: "Archive",
      description: "Data & Export",
      path: "/backup",
      icon: Archive,
    },
    settings: {
      enabled: true,
      label: "Settings",
      description: "Admin & License",
      path: "/settings",
      icon: Settings,
      adminOnly: true,
    },
  },

  labels: {
    entity: "Network",
    entityPlural: "Networks",
    fiscalYearShort: "CY",
    revenueMetric: "Netto",
    platformChannel: "Classic & Programmatic",
  },

  dashboard: {
    showRevenueChart: true,
    showCumulativeChart: true,
    showNetworkMix: true,
    showTopEntities: true,
    showPacing: true,
    showScorecardSummary: true,
    showContractAlerts: true,
  },
};

/** Aktive Module für Navigation & Routing */
export function getEnabledModules(admin: boolean): ModuleConfig[] {
  return Object.values(customerConfig.modules).filter(
    m => m.enabled && (!m.adminOnly || admin),
  );
}

export function isModuleEnabled(id: ModuleId): boolean {
  return customerConfig.modules[id]?.enabled ?? false;
}

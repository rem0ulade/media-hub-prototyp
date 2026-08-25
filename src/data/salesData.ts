export type CrmDealStage =
  | "qualifizierung"
  | "angebot"
  | "verhandlung"
  | "gewonnen"
  | "verloren";

export interface CrmDeal {
  id: string;
  title: string;
  account: string;
  network: string;
  owner: string;
  stage: CrmDealStage;
  value: number;
  createdAt: string;
  expectedCloseAt: string;
  closedAt: string | null;
  lastActivityAt: string | null;
  nextStep: string | null;
  lostReason: string | null;
}

export type CrmActivityType = "meeting" | "call" | "email";

export interface CrmActivity {
  id: string;
  account: string;
  network: string;
  owner: string;
  occurredAt: string;
  type: CrmActivityType;
}

export interface SalesOwnerSummary {
  owner: string;
  wonValueYtd: number;
  openPipeline: number;
  winRateByCount: number | null;
  winRateByValue: number | null;
  averageSalesCycleDays: number | null;
  opportunitiesCreatedYtd: number;
  activeAccountsYtd: number;
  meetingsYtd: number;
  activitiesLastFourWeeks: number;
  activityChange: number | null;
}

export interface AccountSalesOpportunity {
  account: string;
  network: string;
  owner: string | null;
  revenueCy: number;
  revenuePy: number;
  potentialScore: number | null;
  profitabilityScore: number | null;
  shareOfWalletScore: number | null;
  contractStatus: string | null;
  contractEndDate: string | null;
  openPipeline: number;
  openDeals: number;
  lastActivityAt: string | null;
  inactivityDays: number | null;
  priorityReasons: string[];
}

/** Fictional CRM preview aligned with MediaHub partner names and CY 2026. */
export const staticCrmDeals: CrmDeal[] = [
  {
    id: "D-2601",
    title: "Jahresrahmenvertrag",
    account: "Horizon Portfolio",
    network: "Horizon Group",
    owner: "Lena Hartmann",
    stage: "gewonnen",
    value: 780000,
    createdAt: "2026-01-12",
    expectedCloseAt: "2026-03-31",
    closedAt: "2026-03-18",
    lastActivityAt: "2026-03-18",
    nextStep: null,
    lostReason: null,
  },
  {
    id: "D-2602",
    title: "Programmatic-Ausbau",
    account: "Apex Kunden",
    network: "Apex Media",
    owner: "Tobias Keller",
    stage: "gewonnen",
    value: 420000,
    createdAt: "2026-02-03",
    expectedCloseAt: "2026-04-30",
    closedAt: "2026-04-22",
    lastActivityAt: "2026-04-22",
    nextStep: null,
    lostReason: null,
  },
  {
    id: "D-2603",
    title: "Trade-Reaktivierung",
    account: "Spectrum Portfolio",
    network: "Spectrum Hub",
    owner: "Mira Vogel",
    stage: "verhandlung",
    value: 950000,
    createdAt: "2026-04-28",
    expectedCloseAt: "2026-06-30",
    closedAt: null,
    lastActivityAt: "2026-05-11",
    nextStep: "Konditionen abstimmen",
    lostReason: null,
  },
  {
    id: "D-2604",
    title: "Neukundenpaket",
    account: "Nexus Kunden",
    network: "Nexus Partners",
    owner: "Jonas Brandt",
    stage: "angebot",
    value: 620000,
    createdAt: "2026-05-05",
    expectedCloseAt: "2026-06-15",
    closedAt: null,
    lastActivityAt: "2026-05-09",
    nextStep: "Angebotsfeedback einholen",
    lostReason: null,
  },
  {
    id: "D-2605",
    title: "Sommerkampagne",
    account: "Compass Portfolio",
    network: "Compass Group",
    owner: "Lena Hartmann",
    stage: "qualifizierung",
    value: 310000,
    createdAt: "2026-05-08",
    expectedCloseAt: "2026-07-15",
    closedAt: null,
    lastActivityAt: "2026-05-12",
    nextStep: "Budget bestätigen",
    lostReason: null,
  },
  {
    id: "D-2606",
    title: "Crossmedia-Upgrade",
    account: "Summit Kunden",
    network: "Summit Network",
    owner: "Tobias Keller",
    stage: "angebot",
    value: 280000,
    createdAt: "2026-03-17",
    expectedCloseAt: "2026-05-01",
    closedAt: null,
    lastActivityAt: "2026-04-03",
    nextStep: null,
    lostReason: null,
  },
  {
    id: "D-2607",
    title: "Always-on Paket",
    account: "Venture Portfolio",
    network: "Venture Media",
    owner: "Mira Vogel",
    stage: "verloren",
    value: 240000,
    createdAt: "2026-01-20",
    expectedCloseAt: "2026-03-15",
    closedAt: "2026-03-12",
    lastActivityAt: "2026-03-12",
    nextStep: null,
    lostReason: "Budget verschoben",
  },
  {
    id: "D-2608",
    title: "Q2 Kampagne",
    account: "Outdoor Kunden",
    network: "Outdoor Connect",
    owner: "Jonas Brandt",
    stage: "verloren",
    value: 180000,
    createdAt: "2026-02-10",
    expectedCloseAt: "2026-04-01",
    closedAt: "2026-03-28",
    lastActivityAt: "2026-03-28",
    nextStep: null,
    lostReason: "Wettbewerber",
  },
  {
    id: "D-2609",
    title: "Rahmenpaket Öffentlicher Sektor",
    account: "Public Sector",
    network: "Public Sector",
    owner: "Lena Hartmann",
    stage: "verhandlung",
    value: 1400000,
    createdAt: "2026-04-14",
    expectedCloseAt: "2026-06-01",
    closedAt: null,
    lastActivityAt: "2026-05-06",
    nextStep: "Ausschreibungsunterlagen finalisieren",
    lostReason: null,
  },
  {
    id: "D-2610",
    title: "Wachstumspaket",
    account: "Regional Portfolio",
    network: "Regional Media",
    owner: "Tobias Keller",
    stage: "qualifizierung",
    value: 520000,
    createdAt: "2026-05-10",
    expectedCloseAt: "2026-08-15",
    closedAt: null,
    lastActivityAt: "2026-05-10",
    nextStep: "Potenzialgespräch terminieren",
    lostReason: null,
  },
  {
    id: "D-2611",
    title: "Kooperationspaket",
    account: "Meridian Kunden",
    network: "Meridian Connect",
    owner: "Mira Vogel",
    stage: "gewonnen",
    value: 160000,
    createdAt: "2026-02-22",
    expectedCloseAt: "2026-04-15",
    closedAt: "2026-04-08",
    lastActivityAt: "2026-04-08",
    nextStep: null,
    lostReason: null,
  },
];

export const staticCrmActivities: CrmActivity[] = [
  {
    id: "A-01",
    account: "Compass Portfolio",
    network: "Compass Group",
    owner: "Lena Hartmann",
    occurredAt: "2026-05-12",
    type: "meeting",
  },
  {
    id: "A-02",
    account: "Compass Portfolio",
    network: "Compass Group",
    owner: "Lena Hartmann",
    occurredAt: "2026-05-08",
    type: "call",
  },
  {
    id: "A-03",
    account: "Horizon Portfolio",
    network: "Horizon Group",
    owner: "Lena Hartmann",
    occurredAt: "2026-05-04",
    type: "meeting",
  },
  {
    id: "A-04",
    account: "Public Sector",
    network: "Public Sector",
    owner: "Lena Hartmann",
    occurredAt: "2026-05-06",
    type: "meeting",
  },
  {
    id: "A-05",
    account: "Apex Kunden",
    network: "Apex Media",
    owner: "Tobias Keller",
    occurredAt: "2026-05-07",
    type: "call",
  },
  {
    id: "A-06",
    account: "Summit Kunden",
    network: "Summit Network",
    owner: "Tobias Keller",
    occurredAt: "2026-04-03",
    type: "email",
  },
  {
    id: "A-07",
    account: "Regional Portfolio",
    network: "Regional Media",
    owner: "Tobias Keller",
    occurredAt: "2026-05-10",
    type: "meeting",
  },
  {
    id: "A-08",
    account: "Spectrum Portfolio",
    network: "Spectrum Hub",
    owner: "Mira Vogel",
    occurredAt: "2026-05-11",
    type: "meeting",
  },
  {
    id: "A-09",
    account: "Spectrum Portfolio",
    network: "Spectrum Hub",
    owner: "Mira Vogel",
    occurredAt: "2026-05-02",
    type: "call",
  },
  {
    id: "A-10",
    account: "Meridian Kunden",
    network: "Meridian Connect",
    owner: "Mira Vogel",
    occurredAt: "2026-04-08",
    type: "meeting",
  },
  {
    id: "A-11",
    account: "Nexus Kunden",
    network: "Nexus Partners",
    owner: "Jonas Brandt",
    occurredAt: "2026-05-09",
    type: "meeting",
  },
  {
    id: "A-12",
    account: "Nexus Kunden",
    network: "Nexus Partners",
    owner: "Jonas Brandt",
    occurredAt: "2026-04-29",
    type: "call",
  },
  {
    id: "A-13",
    account: "Outdoor Kunden",
    network: "Outdoor Connect",
    owner: "Jonas Brandt",
    occurredAt: "2026-03-28",
    type: "email",
  },
  {
    id: "A-14",
    account: "Horizon Portfolio",
    network: "Horizon Group",
    owner: "Lena Hartmann",
    occurredAt: "2026-04-11",
    type: "call",
  },
  {
    id: "A-15",
    account: "Apex Kunden",
    network: "Apex Media",
    owner: "Tobias Keller",
    occurredAt: "2026-04-14",
    type: "meeting",
  },
  {
    id: "A-16",
    account: "Spectrum Portfolio",
    network: "Spectrum Hub",
    owner: "Mira Vogel",
    occurredAt: "2026-04-09",
    type: "email",
  },
  {
    id: "A-17",
    account: "Nexus Kunden",
    network: "Nexus Partners",
    owner: "Jonas Brandt",
    occurredAt: "2026-04-06",
    type: "meeting",
  },
];

export type ContractStatus = "aktiv" | "verhandlung" | "abgelaufen" | "entwurf";
export type ContractType =
  | "Rahmenvertrag"
  | "Tradevertrag"
  | "Buchungsvertrag"
  | "Fee-Vertrag"
  | "Sondervereinbarung";

export interface Contract {
  id: string;
  network: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  volumeMB3: number | null;
  volumeNN: number | null;
  payrate: number | null;
  conditions: string;
  responsible: string;
  lastUpdated: string;
  notes: string;
}

export const contracts: Contract[] = [
  {
    id: "V-2026-001",
    network: "Horizon Group",
    title: "Master Agreement 2026",
    type: "Rahmenvertrag",
    status: "aktiv",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    volumeMB3: 2_000_000,
    volumeNN: 1_200_000,
    payrate: 0.6,
    conditions: "Fixfee 50 TEUR, Trading-Tranche bestätigt",
    responsible: "Account Management",
    lastUpdated: "2026-04-15",
    notes: "Größter Partner. Trading-Pacing 90 % — Follow-up Q3.",
  },
  {
    id: "V-2026-002",
    network: "Apex Media",
    title: "Trade Agreement 2025/2026",
    type: "Tradevertrag",
    status: "aktiv",
    startDate: "2025-11-01",
    endDate: "2026-10-31",
    volumeMB3: 1_200_000,
    volumeNN: 800_000,
    payrate: 0.65,
    conditions: "Umsatzbeteiligung 5 %, Kampagnen bestätigt",
    responsible: "Account Management",
    lastUpdated: "2026-03-20",
    notes: "Pacing 95 %. Review für Q3 geplant.",
  },
  {
    id: "V-2026-003",
    network: "Spectrum Hub",
    title: "Trade + Fee Agreement 2026",
    type: "Tradevertrag",
    status: "aktiv",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    volumeMB3: 800_000,
    volumeNN: 500_000,
    payrate: 0.75,
    conditions: "Fixfee 25 TEUR",
    responsible: "Account Management",
    lastUpdated: "2026-05-01",
    notes: "Pacing 85 % — über Vorjahr, unter Plan.",
  },
  {
    id: "V-2026-004",
    network: "Nexus Partners",
    title: "Programmatic Trade Agreement 2025/2026",
    type: "Tradevertrag",
    status: "aktiv",
    startDate: "2025-10-01",
    endDate: "2026-09-30",
    volumeMB3: 700_000,
    volumeNN: 400_000,
    payrate: 0.6,
    conditions: "Umsatzbeteiligung 3 % — Pacing 70 %, Nachsteuerung H2",
    responsible: "Account Management",
    lastUpdated: "2026-05-10",
    notes: "Tranche aktiv. Pacing unter Plan — Maßnahmenpaket H2 vereinbart.",
  },
  {
    id: "V-2026-005",
    network: "Compass Group",
    title: "Fee Agreement 2026",
    type: "Fee-Vertrag",
    status: "aktiv",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    volumeMB3: 900_000,
    volumeNN: 720_000,
    payrate: 0.8,
    conditions: "Fixfee 12 TEUR, kein aktives Trading",
    responsible: "Account Management",
    lastUpdated: "2026-04-28",
    notes: "Beste Marge im Portfolio. Fokus auf Classic.",
  },
  {
    id: "V-2026-006",
    network: "Summit Network",
    title: "Master Agreement 2026",
    type: "Rahmenvertrag",
    status: "aktiv",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    volumeMB3: 500_000,
    volumeNN: 300_000,
    payrate: 0.55,
    conditions: "Trading-Pacing 90 %, Marge unter Schnitt",
    responsible: "Account Management",
    lastUpdated: "2026-02-15",
    notes: "Konstantes YTD-Wachstum. Marge-Hebel für H2.",
  },
  {
    id: "V-2025-012",
    network: "Venture Media",
    title: "Booking Framework 2026",
    type: "Buchungsvertrag",
    status: "aktiv",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    volumeMB3: 600_000,
    volumeNN: 300_000,
    payrate: 0.5,
    conditions: "Buchungsrahmen erneuert — Wachstumspartner H2",
    responsible: "Account Management",
    lastUpdated: "2026-04-01",
    notes: "Vertrag verlängert. Trading-Option für H2 vereinbart.",
  },
  {
    id: "V-2026-007",
    network: "Outdoor Connect",
    title: "Master Agreement 2026",
    type: "Rahmenvertrag",
    status: "aktiv",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    volumeMB3: 600_000,
    volumeNN: 420_000,
    payrate: 0.7,
    conditions: "YTD +9 % vs. PY",
    responsible: "Account Management",
    lastUpdated: "2026-03-10",
    notes: "Positiver YTD-Trend. Zusatzleistungen H2 geplant.",
  },
  {
    id: "V-2026-008",
    network: "Public Sector",
    title: "Special Agreement 2026",
    type: "Sondervereinbarung",
    status: "entwurf",
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    volumeMB3: 200_000,
    volumeNN: 90_000,
    payrate: 0.45,
    conditions: "Öffentliche Ausschreibung, Sonderkonditionen",
    responsible: "Account Management",
    lastUpdated: "2026-05-08",
    notes: "Entwurf in Prüfung. Niedrigste Marge im Portfolio.",
  },
  {
    id: "V-2026-009",
    network: "Meridian Connect",
    title: "Master Agreement 2026",
    type: "Rahmenvertrag",
    status: "verhandlung",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    volumeMB3: 400_000,
    volumeNN: 300_000,
    payrate: 0.75,
    conditions: "Verlängerung in Verhandlung",
    responsible: "Account Management",
    lastUpdated: "2026-05-12",
    notes: "Starke Marge. Zusatzleistungen-Paket für H2 vorgesehen.",
  },
];

export const statusConfig: Record<
  ContractStatus,
  { label: string; color: string; bg: string }
> = {
  aktiv: {
    label: "Aktiv",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/25",
  },
  verhandlung: {
    label: "In Verhandlung",
    color: "text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/25",
  },
  abgelaufen: {
    label: "Abgelaufen",
    color: "text-rose-400",
    bg: "bg-rose-500/15 border-rose-500/25",
  },
  entwurf: {
    label: "Entwurf",
    color: "text-burgundy-300",
    bg: "bg-burgundy-500/15 border-burgundy-500/25",
  },
};

export const typeConfig: Record<ContractType, { label: string; icon: string }> =
  {
    Rahmenvertrag: { label: "Rahmenvertrag", icon: "RV" },
    Tradevertrag: { label: "Tradevertrag", icon: "TV" },
    Buchungsvertrag: { label: "Buchungsvertrag", icon: "BV" },
    "Fee-Vertrag": { label: "Fee-Vertrag", icon: "FV" },
    Sondervereinbarung: { label: "Sondervereinbarung", icon: "SA" },
  };

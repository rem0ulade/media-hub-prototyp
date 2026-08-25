export type ScoreRating =
  | "excellent"
  | "good"
  | "average"
  | "poor"
  | "critical";

export interface ScoreCategory {
  category: string;
  score: number;
  rating: ScoreRating;
  detail: string;
}

export type ContractHealth = "aktiv" | "review";

export interface NetworkScorecard {
  network: string;
  overallScore: number;
  overallRating: ScoreRating;
  categories: ScoreCategory[];
  trend: "up" | "down" | "stable";
  highlight: string;
  partnerYears: number;
  contractStatus: ContractHealth;
  sowPY: number;
  sowCY: number;
}

const PARTNER_META: Record<
  string,
  Pick<NetworkScorecard, "partnerYears" | "contractStatus" | "sowPY" | "sowCY">
> = {
  "Horizon Group": {
    partnerYears: 8,
    contractStatus: "aktiv",
    sowPY: 0.35,
    sowCY: 0.38,
  },
  "Apex Media": {
    partnerYears: 6,
    contractStatus: "aktiv",
    sowPY: 0.28,
    sowCY: 0.3,
  },
  "Spectrum Hub": {
    partnerYears: 5,
    contractStatus: "aktiv",
    sowPY: 0.22,
    sowCY: 0.24,
  },
  "Compass Group": {
    partnerYears: 7,
    contractStatus: "aktiv",
    sowPY: 0.18,
    sowCY: 0.2,
  },
  "Meridian Connect": {
    partnerYears: 4,
    contractStatus: "aktiv",
    sowPY: 0.12,
    sowCY: 0.14,
  },
  "Summit Network": {
    partnerYears: 5,
    contractStatus: "review",
    sowPY: 0.15,
    sowCY: 0.16,
  },
  "Outdoor Connect": {
    partnerYears: 3,
    contractStatus: "aktiv",
    sowPY: 0.1,
    sowCY: 0.11,
  },
  "Venture Media": {
    partnerYears: 1,
    contractStatus: "aktiv",
    sowPY: 0.06,
    sowCY: 0.08,
  },
  "Regional Media": {
    partnerYears: 6,
    contractStatus: "aktiv",
    sowPY: 0.14,
    sowCY: 0.15,
  },
  "Nexus Partners": {
    partnerYears: 4,
    contractStatus: "review",
    sowPY: 0.2,
    sowCY: 0.18,
  },
  "Public Sector": {
    partnerYears: 2,
    contractStatus: "review",
    sowPY: 0.08,
    sowCY: 0.09,
  },
  "Global Alliance": {
    partnerYears: 2,
    contractStatus: "aktiv",
    sowPY: 0.05,
    sowCY: 0.05,
  },
};

function withPartnerMeta(
  sc: Omit<
    NetworkScorecard,
    "partnerYears" | "contractStatus" | "sowPY" | "sowCY"
  >,
): NetworkScorecard {
  const meta = PARTNER_META[sc.network] ?? {
    partnerYears: 3,
    contractStatus: "aktiv" as const,
    sowPY: 0.1,
    sowCY: 0.1,
  };
  return { ...sc, ...meta };
}

function getScoreRating(score: number): ScoreRating {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 55) return "average";
  if (score >= 35) return "poor";
  return "critical";
}

export const ratingConfig: Record<
  ScoreRating,
  { label: string; color: string; bg: string; icon: string }
> = {
  excellent: {
    label: "Exzellent",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    icon: "A+",
  },
  good: {
    label: "Gut",
    color: "text-green-400",
    bg: "bg-green-500/15",
    icon: "A",
  },
  average: {
    label: "Mittel",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    icon: "B",
  },
  poor: {
    label: "Schwach",
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    icon: "C",
  },
  critical: {
    label: "Kritisch",
    color: "text-rose-400",
    bg: "bg-rose-500/15",
    icon: "D",
  },
};

const baseScorecards: Omit<
  NetworkScorecard,
  "partnerYears" | "contractStatus" | "sowPY" | "sowCY"
>[] = [
  {
    network: "Horizon Group",
    overallScore: 90,
    overallRating: "excellent",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 92,
        rating: getScoreRating(92),
        detail: "Netto CY 1,75 Mio. — +11 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 88,
        rating: getScoreRating(88),
        detail: "90 % Netto-Pacing — leicht unter Plan",
      },
      {
        category: "Marge",
        score: 86,
        rating: getScoreRating(86),
        detail: "Marge CY 70 % — stabil",
      },
      {
        category: "Zusatzleistungen",
        score: 94,
        rating: getScoreRating(94),
        detail: "30.000 EUR — höchster Beitrag",
      },
      {
        category: "Trading",
        score: 90,
        rating: getScoreRating(90),
        detail: "Plan 1,2 Mio. Netto — 90 % erfüllt",
      },
      {
        category: "Vertrags-Compliance",
        score: 90,
        rating: getScoreRating(90),
        detail: "Rahmenvertrag on track, Fixfee aktiv",
      },
    ],
    trend: "up",
    highlight: "Größter Partner mit starkem Wachstum und planmäßigem Trading.",
  },
  {
    network: "Apex Media",
    overallScore: 86,
    overallRating: "good",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 88,
        rating: getScoreRating(88),
        detail: "Netto CY 1,30 Mio. — +11 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 92,
        rating: getScoreRating(92),
        detail: "95 % Netto-Pacing — knapp unter Jahresziel",
      },
      {
        category: "Marge",
        score: 80,
        rating: getScoreRating(80),
        detail: "Marge CY 65 % — im Zielkorridor",
      },
      {
        category: "Zusatzleistungen",
        score: 84,
        rating: getScoreRating(84),
        detail: "25.000 EUR — solider Beitrag",
      },
      {
        category: "Trading",
        score: 88,
        rating: getScoreRating(88),
        detail: "Pacing 95 % — verlässlich",
      },
      {
        category: "Vertrags-Compliance",
        score: 84,
        rating: getScoreRating(84),
        detail: "Umsatzbeteiligung aktiv",
      },
    ],
    trend: "up",
    highlight: "Stabiles Wachstum mit Pacing nahe Plan — Kernpartnerschaft.",
  },
  {
    network: "Spectrum Hub",
    overallScore: 84,
    overallRating: "good",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 86,
        rating: getScoreRating(86),
        detail: "Netto CY 1,13 Mio. — +7 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 82,
        rating: getScoreRating(82),
        detail: "85 % Netto-Pacing — über Vorjahr",
      },
      {
        category: "Marge",
        score: 90,
        rating: getScoreRating(90),
        detail: "Marge CY 75 % — über Durchschnitt",
      },
      {
        category: "Zusatzleistungen",
        score: 78,
        rating: getScoreRating(78),
        detail: "18.000 EUR — gut relativ zum Volumen",
      },
      {
        category: "Trading",
        score: 80,
        rating: getScoreRating(80),
        detail: "Pacing 85 % — ausbaufähig",
      },
      {
        category: "Vertrags-Compliance",
        score: 88,
        rating: getScoreRating(88),
        detail: "Rahmenvertrag erfüllt, Fixfee aktiv",
      },
    ],
    trend: "up",
    highlight: "Starke Marge und solides Wachstum — Aufholkurs beim Trading.",
  },
  {
    network: "Compass Group",
    overallScore: 82,
    overallRating: "good",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 80,
        rating: getScoreRating(80),
        detail: "Netto CY 720 K — +13 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 78,
        rating: getScoreRating(78),
        detail: "Klassisches Geschäft im Zielkorridor",
      },
      {
        category: "Marge",
        score: 94,
        rating: getScoreRating(94),
        detail: "Marge CY 80 % — beste Marge im Portfolio",
      },
      {
        category: "Zusatzleistungen",
        score: 72,
        rating: getScoreRating(72),
        detail: "10.000 EUR — Potenzial für Q3",
      },
      {
        category: "Trading",
        score: 70,
        rating: getScoreRating(70),
        detail: "Kein aktives Trading — Fokus Classic",
      },
      {
        category: "Vertrags-Compliance",
        score: 86,
        rating: getScoreRating(86),
        detail: "Fixfee aktiv, Rahmen erfüllt",
      },
    ],
    trend: "up",
    highlight:
      "Nischenpartner mit der stärksten Marge — zuverlässige Performance.",
  },
  {
    network: "Meridian Connect",
    overallScore: 80,
    overallRating: "good",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 78,
        rating: getScoreRating(78),
        detail: "Netto CY 300 K — +11 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 80,
        rating: getScoreRating(80),
        detail: "Planmäßig im Zielkorridor",
      },
      {
        category: "Marge",
        score: 88,
        rating: getScoreRating(88),
        detail: "Marge CY 75 % — stabil",
      },
      {
        category: "Zusatzleistungen",
        score: 62,
        rating: getScoreRating(62),
        detail: "Paket für H2 in Planung",
      },
      {
        category: "Trading",
        score: 74,
        rating: getScoreRating(74),
        detail: "Kein aktives Trading",
      },
      {
        category: "Vertrags-Compliance",
        score: 88,
        rating: getScoreRating(88),
        detail: "Rahmenvertrag erfüllt",
      },
    ],
    trend: "up",
    highlight: "Solider Mittelstandspartner mit starker Marge.",
  },
  {
    network: "Summit Network",
    overallScore: 78,
    overallRating: "good",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 76,
        rating: getScoreRating(76),
        detail: "Netto CY 550 K — +11 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 88,
        rating: getScoreRating(88),
        detail: "90 % Netto-Pacing — knapp unter Plan",
      },
      {
        category: "Marge",
        score: 70,
        rating: getScoreRating(70),
        detail: "Marge CY 55 % — unter Portfolio-Schnitt",
      },
      {
        category: "Zusatzleistungen",
        score: 76,
        rating: getScoreRating(76),
        detail: "15.000 EUR — solider Beitrag",
      },
      {
        category: "Trading",
        score: 84,
        rating: getScoreRating(84),
        detail: "Pacing 90 % — on track",
      },
      {
        category: "Vertrags-Compliance",
        score: 80,
        rating: getScoreRating(80),
        detail: "Rahmenvertrag aktiv",
      },
    ],
    trend: "up",
    highlight: "Trading on track — Marge bleibt der Hebel für H2.",
  },
  {
    network: "Outdoor Connect",
    overallScore: 76,
    overallRating: "good",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 80,
        rating: getScoreRating(80),
        detail: "Netto CY 420 K — +9 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 78,
        rating: getScoreRating(78),
        detail: "Klassisches Geschäft planmäßig",
      },
      {
        category: "Marge",
        score: 82,
        rating: getScoreRating(82),
        detail: "Marge CY 70 % — stabil",
      },
      {
        category: "Zusatzleistungen",
        score: 60,
        rating: getScoreRating(60),
        detail: "Paket für H2 vorgesehen",
      },
      {
        category: "Trading",
        score: 68,
        rating: getScoreRating(68),
        detail: "Kein aktives Trading",
      },
      {
        category: "Vertrags-Compliance",
        score: 82,
        rating: getScoreRating(82),
        detail: "Vertragsbedingungen erfüllt",
      },
    ],
    trend: "up",
    highlight: "Solider Partner mit positivem YTD-Trend.",
  },
  {
    network: "Venture Media",
    overallScore: 74,
    overallRating: "average",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 76,
        rating: getScoreRating(76),
        detail: "Netto CY 300 K — +9 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 72,
        rating: getScoreRating(72),
        detail: "Neuvertrag Q2 — Pacing on track",
      },
      {
        category: "Marge",
        score: 68,
        rating: getScoreRating(68),
        detail: "Marge CY 50 % — im Rahmen Neuvertrag",
      },
      {
        category: "Zusatzleistungen",
        score: 62,
        rating: getScoreRating(62),
        detail: "Paket im Neuvertrag enthalten",
      },
      {
        category: "Trading",
        score: 70,
        rating: getScoreRating(70),
        detail: "Option für H2 vereinbart",
      },
      {
        category: "Vertrags-Compliance",
        score: 84,
        rating: getScoreRating(84),
        detail: "Buchungsrahmen erneuert — Laufzeit 2026",
      },
    ],
    trend: "up",
    highlight: "Vertragsverlängerung erfolgreich — Wachstumspartner für H2.",
  },
  {
    network: "Regional Media",
    overallScore: 72,
    overallRating: "average",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 74,
        rating: getScoreRating(74),
        detail: "Netto CY 195 K — +7 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 76,
        rating: getScoreRating(76),
        detail: "Leicht über Plan",
      },
      {
        category: "Marge",
        score: 76,
        rating: getScoreRating(76),
        detail: "Marge CY 65 % — akzeptabel",
      },
      {
        category: "Zusatzleistungen",
        score: 64,
        rating: getScoreRating(64),
        detail: "Regionale Events geplant",
      },
      {
        category: "Trading",
        score: 68,
        rating: getScoreRating(68),
        detail: "Stabiles Regionalgeschäft",
      },
      {
        category: "Vertrags-Compliance",
        score: 82,
        rating: getScoreRating(82),
        detail: "Regionalrahmen erfüllt",
      },
    ],
    trend: "up",
    highlight: "Verlässlicher Regionalpartner — kontinuierliches Wachstum.",
  },
  {
    network: "Nexus Partners",
    overallScore: 70,
    overallRating: "average",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 78,
        rating: getScoreRating(78),
        detail: "Netto CY 840 K — +12 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 58,
        rating: getScoreRating(58),
        detail: "70 % Netto-Pacing — Nachsteuerung H2",
      },
      {
        category: "Marge",
        score: 74,
        rating: getScoreRating(74),
        detail: "Marge CY 60 % — im Rahmen",
      },
      {
        category: "Zusatzleistungen",
        score: 86,
        rating: getScoreRating(86),
        detail: "24.000 EUR — starker Beitrag",
      },
      {
        category: "Trading",
        score: 60,
        rating: getScoreRating(60),
        detail: "Pacing 70 % — ausbaufähig",
      },
      {
        category: "Vertrags-Compliance",
        score: 80,
        rating: getScoreRating(80),
        detail: "Tranche akzeptiert, Vertrag aktiv",
      },
    ],
    trend: "stable",
    highlight: "Gutes Volumen, aber Pacing unter Plan — Nachsteuerung läuft.",
  },
  {
    network: "Public Sector",
    overallScore: 68,
    overallRating: "average",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 70,
        rating: getScoreRating(70),
        detail: "Netto CY 90 K — +11 % vs. PY YTD",
      },
      {
        category: "Pacing",
        score: 72,
        rating: getScoreRating(72),
        detail: "Planmäßig im öffentlichen Segment",
      },
      {
        category: "Marge",
        score: 58,
        rating: getScoreRating(58),
        detail: "Marge CY 45 % — segmenttypisch",
      },
      {
        category: "Zusatzleistungen",
        score: 55,
        rating: getScoreRating(55),
        detail: "Optionen für Q3",
      },
      {
        category: "Trading",
        score: 66,
        rating: getScoreRating(66),
        detail: "Sondervereinbarung in Finalisierung",
      },
      {
        category: "Vertrags-Compliance",
        score: 84,
        rating: getScoreRating(84),
        detail: "Ausschreibungsbedingungen erfüllt",
      },
    ],
    trend: "stable",
    highlight:
      "Öffentlicher Sektor — stabile Entwicklung, neuer Rahmen in Aussicht.",
  },
  {
    network: "Global Alliance",
    overallScore: 64,
    overallRating: "average",
    categories: [
      {
        category: "Umsatzentwicklung",
        score: 62,
        rating: getScoreRating(62),
        detail: "Netto CY 80 K — kleines Volumen",
      },
      {
        category: "Pacing",
        score: 70,
        rating: getScoreRating(70),
        detail: "Im Rahmen des kleinen Volumens",
      },
      {
        category: "Marge",
        score: 88,
        rating: getScoreRating(88),
        detail: "Marge CY 80 % — überdurchschnittlich",
      },
      {
        category: "Zusatzleistungen",
        score: 50,
        rating: getScoreRating(50),
        detail: "Noch kein Paket",
      },
      {
        category: "Trading",
        score: 55,
        rating: getScoreRating(55),
        detail: "Kein aktives Trading",
      },
      {
        category: "Vertrags-Compliance",
        score: 78,
        rating: getScoreRating(78),
        detail: "Rahmen aktiv",
      },
    ],
    trend: "stable",
    highlight: "Kleiner Partner mit starker Marge — Ausbau optional.",
  },
];

export const networkScorecards: NetworkScorecard[] =
  baseScorecards.map(withPartnerMeta);

export function mergeScorecard(sc: NetworkScorecard): NetworkScorecard {
  const fallback = networkScorecards.find(s => s.network === sc.network);
  if (!fallback) return withPartnerMeta(sc);
  return {
    ...fallback,
    ...sc,
    partnerYears: sc.partnerYears ?? fallback.partnerYears,
    contractStatus: sc.contractStatus ?? fallback.contractStatus,
    sowPY: sc.sowPY ?? fallback.sowPY,
    sowCY: sc.sowCY ?? fallback.sowCY,
  };
}

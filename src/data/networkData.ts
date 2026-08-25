export interface NetworkClassic {
  network: string;
  io: {
    mb3PY: number;
    nnPY: number;
    pfPY: number;
    mb3CY: number;
    nnCY: number;
    pfCY: number;
  };
  programmatic: {
    mb3PY: number;
    nnPY: number;
    pfPY: number;
    mb3CY: number;
    nnCY: number;
    pfCY: number;
  };
}

export interface TradingData {
  network: string;
  tranchen: {
    mb3PYTr: number | null;
    nnPYTr: number | null;
    pfPYTr: number | null;
    mb3TrCY: number | null;
    nnTrCY: number | null;
    pfTrCY: number | null;
  };
  planIst: {
    planMB3: number | null;
    planNN: number | null;
    istMB3: number | null;
    istNN: number | null;
  };
  pacing: {
    pacingMB3: number | null;
    pacingNN: number | null;
  };
}

export interface VergütungData {
  network: string;
  nnCY: number;
  vergütung: number;
  vergütungsart: string;
}

export interface AddedValueData {
  network: string;
  avEvents: number;
  avProduktproben: number;
  avMaFo: number;
  avSonstiges: number;
  avSumme: number;
}

export interface NetworkNote {
  network: string;
  note: string;
}

function classic(
  network: string,
  mb3PY: number,
  nnPY: number,
  pf: number,
  mb3CY: number,
  nnCY: number,
): NetworkClassic {
  const io = { mb3PY, nnPY, pfPY: pf, mb3CY, nnCY, pfCY: pf };
  return { network, io, programmatic: { ...io } };
}

function trading(opts: {
  network: string;
  mb3PYTr: number | null;
  nnPYTr: number | null;
  mb3TrCY: number | null;
  nnTrCY: number | null;
  planMB3: number | null;
  planNN: number | null;
  istMB3: number | null;
  istNN: number | null;
}): TradingData {
  const { planMB3, planNN, istMB3, istNN } = opts;
  return {
    network: opts.network,
    tranchen: {
      mb3PYTr: opts.mb3PYTr,
      nnPYTr: opts.nnPYTr,
      pfPYTr:
        opts.mb3PYTr && opts.nnPYTr ? opts.nnPYTr / opts.mb3PYTr : null,
      mb3TrCY: opts.mb3TrCY,
      nnTrCY: opts.nnTrCY,
      pfTrCY:
        opts.mb3TrCY && opts.nnTrCY ? opts.nnTrCY / opts.mb3TrCY : null,
    },
    planIst: { planMB3, planNN, istMB3, istNN },
    pacing: {
      pacingMB3: planMB3 && istMB3 ? istMB3 / planMB3 : null,
      pacingNN: planNN && istNN ? istNN / planNN : null,
    },
  };
}

export const networkClassicData: NetworkClassic[] = [
  classic("Horizon Group", 2_250_000, 1_575_000, 0.7, 2_500_000, 1_750_000),
  classic("Apex Media", 1_800_000, 1_170_000, 0.65, 2_000_000, 1_300_000),
  classic("Spectrum Hub", 1_400_000, 1_050_000, 0.75, 1_500_000, 1_125_000),
  classic("Nexus Partners", 1_250_000, 750_000, 0.6, 1_400_000, 840_000),
  classic("Compass Group", 800_000, 640_000, 0.8, 900_000, 720_000),
  classic("Summit Network", 900_000, 495_000, 0.55, 1_000_000, 550_000),
  classic("Outdoor Connect", 550_000, 385_000, 0.7, 600_000, 420_000),
  classic("Venture Media", 550_000, 275_000, 0.5, 600_000, 300_000),
  classic("Meridian Connect", 360_000, 270_000, 0.75, 400_000, 300_000),
  classic("Regional Media", 280_000, 182_000, 0.65, 300_000, 195_000),
  classic("Public Sector", 180_000, 81_000, 0.45, 200_000, 90_000),
  classic("Global Alliance", 90_000, 72_000, 0.8, 100_000, 80_000),
];

export const tradingIOData: TradingData[] = [
  trading({
    network: "Horizon Group",
    mb3PYTr: 1_800_000,
    nnPYTr: 810_000,
    mb3TrCY: 1_600_000,
    nnTrCY: 720_000,
    planMB3: 2_000_000,
    planNN: 1_200_000,
    istMB3: 1_800_000,
    istNN: 1_080_000,
  }),
  trading({
    network: "Apex Media",
    mb3PYTr: 1_000_000,
    nnPYTr: 450_000,
    mb3TrCY: 900_000,
    nnTrCY: 405_000,
    planMB3: 1_200_000,
    planNN: 800_000,
    istMB3: 1_140_000,
    istNN: 760_000,
  }),
  trading({
    network: "Spectrum Hub",
    mb3PYTr: 600_000,
    nnPYTr: 240_000,
    mb3TrCY: 500_000,
    nnTrCY: 200_000,
    planMB3: 800_000,
    planNN: 500_000,
    istMB3: 680_000,
    istNN: 425_000,
  }),
  trading({
    network: "Nexus Partners",
    mb3PYTr: 500_000,
    nnPYTr: 150_000,
    mb3TrCY: 400_000,
    nnTrCY: 120_000,
    planMB3: 700_000,
    planNN: 400_000,
    istMB3: 490_000,
    istNN: 280_000,
  }),
  trading({
    network: "Summit Network",
    mb3PYTr: null,
    nnPYTr: null,
    mb3TrCY: null,
    nnTrCY: null,
    planMB3: 500_000,
    planNN: 300_000,
    istMB3: 450_000,
    istNN: 270_000,
  }),
];

export const tradingPCData: TradingData[] = [
  trading({
    network: "Horizon Group",
    mb3PYTr: 900_000,
    nnPYTr: 405_000,
    mb3TrCY: 800_000,
    nnTrCY: 360_000,
    planMB3: 1_000_000,
    planNN: 600_000,
    istMB3: 880_000,
    istNN: 528_000,
  }),
  trading({
    network: "Apex Media",
    mb3PYTr: 500_000,
    nnPYTr: 225_000,
    mb3TrCY: 450_000,
    nnTrCY: 200_000,
    planMB3: 600_000,
    planNN: 400_000,
    istMB3: 528_000,
    istNN: 352_000,
  }),
  trading({
    network: "Spectrum Hub",
    mb3PYTr: 300_000,
    nnPYTr: 120_000,
    mb3TrCY: 250_000,
    nnTrCY: 100_000,
    planMB3: 400_000,
    planNN: 250_000,
    istMB3: 320_000,
    istNN: 200_000,
  }),
  trading({
    network: "Nexus Partners",
    mb3PYTr: 250_000,
    nnPYTr: 75_000,
    mb3TrCY: 200_000,
    nnTrCY: 60_000,
    planMB3: 350_000,
    planNN: 200_000,
    istMB3: 262_500,
    istNN: 150_000,
  }),
];

export const vergütungData: VergütungData[] = [
  { network: "Horizon Group", nnCY: 400_000, vergütung: 50_000, vergütungsart: "Fixfee" },
  { network: "Apex Media", nnCY: 250_000, vergütung: 0, vergütungsart: "Umsatzbeteiligung 5 %" },
  { network: "Spectrum Hub", nnCY: 180_000, vergütung: 25_000, vergütungsart: "Fixfee" },
  { network: "Nexus Partners", nnCY: 150_000, vergütung: 0, vergütungsart: "Umsatzbeteiligung 3 %" },
  { network: "Compass Group", nnCY: 80_000, vergütung: 12_000, vergütungsart: "Fixfee" },
  { network: "Summit Network", nnCY: 0, vergütung: 0, vergütungsart: "–" },
  { network: "Outdoor Connect", nnCY: 0, vergütung: 0, vergütungsart: "–" },
  { network: "Venture Media", nnCY: 0, vergütung: 0, vergütungsart: "–" },
  { network: "Meridian Connect", nnCY: 0, vergütung: 0, vergütungsart: "–" },
  { network: "Regional Media", nnCY: 0, vergütung: 0, vergütungsart: "–" },
  { network: "Public Sector", nnCY: 0, vergütung: 0, vergütungsart: "–" },
  { network: "Global Alliance", nnCY: 0, vergütung: 0, vergütungsart: "–" },
];

export const addedValueData: AddedValueData[] = [
  { network: "Horizon Group", avEvents: 15_000, avProduktproben: 5_000, avMaFo: 10_000, avSonstiges: 0, avSumme: 30_000 },
  { network: "Apex Media", avEvents: 12_000, avProduktproben: 3_000, avMaFo: 8_000, avSonstiges: 2_000, avSumme: 25_000 },
  { network: "Spectrum Hub", avEvents: 8_000, avProduktproben: 4_000, avMaFo: 6_000, avSonstiges: 0, avSumme: 18_000 },
  { network: "Nexus Partners", avEvents: 10_000, avProduktproben: 2_000, avMaFo: 12_000, avSonstiges: 0, avSumme: 24_000 },
  { network: "Compass Group", avEvents: 5_000, avProduktproben: 1_000, avMaFo: 4_000, avSonstiges: 0, avSumme: 10_000 },
  { network: "Summit Network", avEvents: 6_000, avProduktproben: 2_000, avMaFo: 3_000, avSonstiges: 4_000, avSumme: 15_000 },
  { network: "Outdoor Connect", avEvents: 0, avProduktproben: 0, avMaFo: 0, avSonstiges: 0, avSumme: 0 },
  { network: "Venture Media", avEvents: 0, avProduktproben: 0, avMaFo: 0, avSonstiges: 0, avSumme: 0 },
  { network: "Meridian Connect", avEvents: 0, avProduktproben: 0, avMaFo: 0, avSonstiges: 0, avSumme: 0 },
  { network: "Regional Media", avEvents: 0, avProduktproben: 0, avMaFo: 0, avSonstiges: 0, avSumme: 0 },
  { network: "Public Sector", avEvents: 0, avProduktproben: 0, avMaFo: 0, avSonstiges: 0, avSumme: 0 },
  { network: "Global Alliance", avEvents: 0, avProduktproben: 0, avMaFo: 0, avSonstiges: 0, avSumme: 0 },
];

export const networkNotes: NetworkNote[] = [
  { network: "Horizon Group", note: "Größter Partner im Portfolio — Pacing 90 %, leicht unter Jahresziel." },
  { network: "Apex Media", note: "Stabiles Wachstum YTD — Review für Q3 geplant." },
  { network: "Spectrum Hub", note: "Solides Pacing bei 85 % — über Vorjahr." },
  { network: "Nexus Partners", note: "Pacing 70 % — Nachsteuerung mit Partner für H2 vereinbart." },
];

const classicSums = networkClassicData.reduce(
  (acc, row) => ({
    mb3PY: acc.mb3PY + row.io.mb3PY,
    nnPY: acc.nnPY + row.io.nnPY,
    mb3CY: acc.mb3CY + row.io.mb3CY,
    nnCY: acc.nnCY + row.io.nnCY,
  }),
  { mb3PY: 0, nnPY: 0, mb3CY: 0, nnCY: 0 },
);

const tradingSums = tradingIOData.reduce(
  (acc, row) => ({
    tranchenMB3PY: acc.tranchenMB3PY + (row.tranchen.mb3PYTr ?? 0),
    tranchenNNPY: acc.tranchenNNPY + (row.tranchen.nnPYTr ?? 0),
    tranchenMB3CY: acc.tranchenMB3CY + (row.tranchen.mb3TrCY ?? 0),
    tranchenNNCY: acc.tranchenNNCY + (row.tranchen.nnTrCY ?? 0),
    planMB3: acc.planMB3 + (row.planIst.planMB3 ?? 0),
    planNN: acc.planNN + (row.planIst.planNN ?? 0),
    istMB3: acc.istMB3 + (row.planIst.istMB3 ?? 0),
    istNN: acc.istNN + (row.planIst.istNN ?? 0),
  }),
  {
    tranchenMB3PY: 0,
    tranchenNNPY: 0,
    tranchenMB3CY: 0,
    tranchenNNCY: 0,
    planMB3: 0,
    planNN: 0,
    istMB3: 0,
    istNN: 0,
  },
);

export const totals = {
  classic: {
    ...classicSums,
    pfPY: classicSums.mb3PY > 0 ? classicSums.nnPY / classicSums.mb3PY : 0,
    pfCY: classicSums.mb3CY > 0 ? classicSums.nnCY / classicSums.mb3CY : 0,
  },
  tradingIO: {
    ...tradingSums,
    tranchenPFPY:
      tradingSums.tranchenMB3PY > 0
        ? tradingSums.tranchenNNPY / tradingSums.tranchenMB3PY
        : 0,
    tranchenPFCY:
      tradingSums.tranchenMB3CY > 0
        ? tradingSums.tranchenNNCY / tradingSums.tranchenMB3CY
        : 0,
    pacingMB3:
      tradingSums.planMB3 > 0 ? tradingSums.istMB3 / tradingSums.planMB3 : 0,
    pacingNN:
      tradingSums.planNN > 0 ? tradingSums.istNN / tradingSums.planNN : 0,
  },
  vergütung: {
    nnCY: 1_060_000,
    vergütung: 87_000,
  },
  addedValue: {
    avEvents: 56_000,
    avProduktproben: 17_000,
    avMaFo: 43_000,
    avSonstiges: 6_000,
    avSumme: 122_000,
  },
};

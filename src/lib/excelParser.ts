import * as XLSX from "xlsx";
import { calculateTotals } from "@/data/excelSync";
import type {
  AddedValueData,
  NetworkClassic,
  TradingData,
  VergütungData,
} from "@/data/networkData";

export interface ValidationReport {
  rowCount: number;
  warnings: string[];
  errors: string[];
  sheetsFound: string[];
}

export interface ParsedDashboardPayload {
  networkClassicData: NetworkClassic[];
  tradingIOData: TradingData[];
  tradingPCData: TradingData[];
  vergütungData: VergütungData[];
  addedValueData: AddedValueData[];
  totals: ReturnType<typeof calculateTotals>;
}

export type ColumnMapping = Record<string, string>;

function safeNum(val: unknown): number {
  if (
    val === null ||
    val === undefined ||
    val === "" ||
    val === "–" ||
    val === "-"
  )
    return 0;
  const n = Number(val);
  return Number.isNaN(n) ? 0 : n;
}

function col(
  row: Record<string, unknown>,
  keys: string[],
  mapping?: ColumnMapping,
): unknown {
  for (const k of keys) {
    const mapped = mapping?.[k];
    if (mapped && row[mapped] !== undefined) return row[mapped];
    if (row[k] !== undefined) return row[k];
  }
  return undefined;
}

export function parseExcelBuffer(
  buffer: ArrayBuffer,
  mapping: ColumnMapping = {},
): { data: ParsedDashboardPayload; validation: ValidationReport } {
  const warnings: string[] = [];
  const errors: string[] = [];

  const workbook = XLSX.read(buffer, { type: "array" });
  const sheets = workbook.SheetNames;
  const findSheet = (candidates: string[]) => {
    for (const name of candidates) {
      const found = sheets.find(s =>
        s.toLowerCase().includes(name.toLowerCase()),
      );
      if (found) return workbook.Sheets[found];
    }
    return null;
  };

  const iopcSheet =
    findSheet(["Classic", "IO & PC", "IO&PC", "IO_PC", "IO"]) ||
    workbook.Sheets[sheets[0]];
  if (!iopcSheet) throw new Error("Kein passendes Sheet gefunden.");

  const parseClassic = (ws: XLSX.WorkSheet): NetworkClassic[] => {
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
      defval: "",
    });
    const results: NetworkClassic[] = [];
    for (const row of data) {
      const network = String(
        col(row, ["Network", "network", "NETWORK"], mapping) || "",
      ).trim();
      if (
        !network ||
        network.toLowerCase() === "gesamt" ||
        network.toLowerCase() === "total"
      )
        continue;
      results.push({
        network,
        io: {
          mb3PY: safeNum(col(row, ["Brutto PY", "MB3 PY", "mb3PY"], mapping)),
          nnPY: safeNum(col(row, ["Netto PY", "NN PY", "nnPY"], mapping)),
          pfPY: safeNum(col(row, ["Marge PY", "PF PY", "pfPY"], mapping)),
          mb3CY: safeNum(col(row, ["Brutto CY", "MB3 CY", "mb3CY"], mapping)),
          nnCY: safeNum(col(row, ["Netto CY", "NN CY", "nnCY"], mapping)),
          pfCY: safeNum(col(row, ["Marge CY", "PF CY", "pfCY"], mapping)),
        },
        programmatic: {
          mb3PY: safeNum(
            col(row, ["PC Brutto PY", "PC MB3 PY", "pcMb3PY"], mapping),
          ),
          nnPY: safeNum(
            col(row, ["PC Netto PY", "PC NN PY", "pcNnPY"], mapping),
          ),
          pfPY: safeNum(
            col(row, ["PC Marge PY", "PC PF PY", "pcPfPY"], mapping),
          ),
          mb3CY: safeNum(
            col(row, ["PC Brutto CY", "PC MB3 CY", "pcMb3CY"], mapping),
          ),
          nnCY: safeNum(
            col(row, ["PC Netto CY", "PC NN CY", "pcNnCY"], mapping),
          ),
          pfCY: safeNum(
            col(row, ["PC Marge CY", "PC PF CY", "pcPfCY"], mapping),
          ),
        },
      });
    }
    return results;
  };

  const parseTrading = (ws: XLSX.WorkSheet): TradingData[] => {
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
      defval: "",
    });
    const results: TradingData[] = [];
    for (const row of data) {
      const network = String(
        col(row, ["Network", "network", "NETWORK"], mapping) || "",
      ).trim();
      if (
        !network ||
        network.toLowerCase() === "gesamt" ||
        network.toLowerCase() === "total"
      )
        continue;
      const mb3PYTr = safeNum(
        col(row, ["Tr Brutto PY", "Tr MB3 PY", "mb3PYTr"], mapping),
      );
      const nnPYTr = safeNum(
        col(row, ["Tr Netto PY", "Tr NN PY", "nnPYTr"], mapping),
      );
      const mb3TrCY = safeNum(
        col(row, ["Tr Brutto CY", "Tr MB3 CY", "mb3TrCY"], mapping),
      );
      const nnTrCY = safeNum(
        col(row, ["Tr Netto CY", "Tr NN CY", "nnTrCY"], mapping),
      );
      const planMB3 = safeNum(
        col(row, ["Plan Brutto", "Plan MB3", "planMB3"], mapping),
      );
      const planNN = safeNum(
        col(row, ["Plan Netto", "Plan NN", "planNN"], mapping),
      );
      const istMB3 = safeNum(
        col(row, ["IST Brutto", "IST MB3", "istMB3"], mapping),
      );
      const istNN = safeNum(
        col(row, ["IST Netto", "IST NN", "istNN"], mapping),
      );
      results.push({
        network,
        tranchen: {
          mb3PYTr: mb3PYTr || null,
          nnPYTr: nnPYTr || null,
          pfPYTr: mb3PYTr > 0 ? nnPYTr / mb3PYTr : null,
          mb3TrCY: mb3TrCY || null,
          nnTrCY: nnTrCY || null,
          pfTrCY: mb3TrCY > 0 ? nnTrCY / mb3TrCY : null,
        },
        planIst: {
          planMB3: planMB3 || null,
          planNN: planNN || null,
          istMB3: istMB3 || null,
          istNN: istNN || null,
        },
        pacing: {
          pacingMB3: planMB3 > 0 ? istMB3 / planMB3 : null,
          pacingNN: planNN > 0 ? istNN / planNN : null,
        },
      });
    }
    return results;
  };

  const parseVergütung = (ws: XLSX.WorkSheet): VergütungData[] => {
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
      defval: "",
    });
    const results: VergütungData[] = [];
    for (const row of data) {
      const network = String(
        col(row, ["Network", "network"], mapping) || "",
      ).trim();
      if (!network || network.toLowerCase() === "gesamt") continue;
      results.push({
        network,
        nnCY: safeNum(col(row, ["Netto CY", "NN CY", "nnCY"], mapping)),
        vergütung: safeNum(
          col(row, ["Fee", "Partner-Fee", "Vergütung", "vergütung"], mapping),
        ),
        vergütungsart: String(
          col(row, ["Fee-Art", "Art", "Vergütungsart"], mapping) || "",
        ),
      });
    }
    return results;
  };

  const parseAddedValue = (ws: XLSX.WorkSheet): AddedValueData[] => {
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
      defval: "",
    });
    const results: AddedValueData[] = [];
    for (const row of data) {
      const network = String(
        col(row, ["Network", "network"], mapping) || "",
      ).trim();
      if (!network || network.toLowerCase() === "gesamt") continue;
      const avEvents = safeNum(
        col(row, ["AV Events", "avEvents", "Events"], mapping),
      );
      const avProduktproben = safeNum(
        col(
          row,
          ["Promotion", "AV Promotion", "avProduktproben", "Produktproben"],
          mapping,
        ),
      );
      const avMaFo = safeNum(
        col(row, ["Research", "AV Research", "avMaFo", "MaFo"], mapping),
      );
      const avSonstiges = safeNum(
        col(row, ["AV Sonstiges", "avSonstiges", "Sonstiges"], mapping),
      );
      results.push({
        network,
        avEvents,
        avProduktproben,
        avMaFo,
        avSonstiges,
        avSumme: avEvents + avProduktproben + avMaFo + avSonstiges,
      });
    }
    return results;
  };

  const networkClassicData = parseClassic(iopcSheet);
  const tradingIOData = parseTrading(iopcSheet);
  const pcSheet = findSheet(["Programmatic", "PC"]);
  const tradingPCData = pcSheet ? parseTrading(pcSheet) : tradingIOData;
  const vergSheet = findSheet([
    "Fee",
    "Partner-Fee",
    "Partner Fee",
    "Vergütung",
    "Verguetung",
    "Compensation",
  ]);
  const vergütungData = vergSheet ? parseVergütung(vergSheet) : [];
  const avSheet = findSheet([
    "Zusatzleistungen",
    "Extras",
    "Added Value",
    "AddedValue",
    "AV",
  ]);
  const addedValueData = avSheet ? parseAddedValue(avSheet) : [];

  if (networkClassicData.length === 0) {
    errors.push("Keine Netzwerk-Zeilen im Hauptblatt gefunden.");
  }
  if (!vergSheet)
    warnings.push("Sheet „Fee“ nicht gefunden — Demo-Fee bleibt aktiv.");
  if (!avSheet)
    warnings.push(
      "Sheet „Zusatzleistungen“ nicht gefunden — Demo-Zusatzleistungen bleiben aktiv.",
    );
  if (tradingIOData.length === 0)
    warnings.push("Keine Trading-Zeilen erkannt.");

  const totals = calculateTotals({
    networkClassicData: networkClassicData.length ? networkClassicData : [],
    tradingIOData: tradingIOData.length ? tradingIOData : [],
    vergütungData: vergütungData.length ? vergütungData : [],
    addedValueData: addedValueData.length ? addedValueData : [],
  });

  return {
    data: {
      networkClassicData,
      tradingIOData,
      tradingPCData,
      vergütungData,
      addedValueData,
      totals,
    },
    validation: {
      rowCount: networkClassicData.length,
      warnings,
      errors,
      sheetsFound: sheets,
    },
  };
}

export function buildExcelTemplate(): ArrayBuffer {
  const wb = XLSX.utils.book_new();
  const headers = [
    "Network",
    "Brutto PY",
    "Netto PY",
    "Marge PY",
    "Brutto CY",
    "Netto CY",
    "Marge CY",
    "Tr Brutto PY",
    "Tr Netto PY",
    "Plan Brutto",
    "Plan Netto",
    "IST Brutto",
    "IST Netto",
  ];
  const ws = XLSX.utils.aoa_to_sheet([
    headers,
    [
      "Beispiel Partner",
      1_000_000,
      700_000,
      0.7,
      1_100_000,
      770_000,
      0.7,
      200_000,
      90_000,
      300_000,
      180_000,
      270_000,
      160_000,
    ],
  ]);
  XLSX.utils.book_append_sheet(wb, ws, "Classic");
  const feeSheet = XLSX.utils.aoa_to_sheet([
    ["Network", "Netto CY", "Fee", "Fee-Art"],
    ["Beispiel Partner", 250_000, 20_000, "Fixfee"],
  ]);
  XLSX.utils.book_append_sheet(wb, feeSheet, "Fee");
  const extrasSheet = XLSX.utils.aoa_to_sheet([
    ["Network", "Events", "Promotion", "Research", "Sonstiges"],
    ["Beispiel Partner", 10_000, 4_000, 6_000, 0],
  ]);
  XLSX.utils.book_append_sheet(wb, extrasSheet, "Zusatzleistungen");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
}

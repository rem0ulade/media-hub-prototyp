/**
 * Excel Sync Layer
 * ================
 *
 * AKTUELLER STATUS: Stub/Placeholder
 * - Datenquelle: statische Fake-Daten in networkData.ts
 */

import type {
  AddedValueData,
  NetworkClassic,
  NetworkNote,
  TradingData,
  VergütungData,
} from "./networkData";

// ─── Configuration ─────────────────────────────────────────────
export interface ExcelSyncConfig {
  excelFilePath: string;
  ioSheetName: string;
  pcSheetName: string;
  syncIntervalMinutes: number;
  lastSyncTimestamp: string | null;
}

export const DEFAULT_SYNC_CONFIG: ExcelSyncConfig = {
  excelFilePath: "",
  ioSheetName: "IO",
  pcSheetName: "PC",
  syncIntervalMinutes: 60,
  lastSyncTimestamp: null,
};

// ─── Sync Status ─────────────────────────────────────────────
export type SyncStatus = "idle" | "syncing" | "success" | "error";

export interface SyncState {
  status: SyncStatus;
  lastSync: Date | null;
  lastError: string | null;
  dataSource: "static" | "excel";
}

export const initialSyncState: SyncState = {
  status: "idle",
  lastSync: null,
  lastError: null,
  dataSource: "static",
};

// ─── DashboardData ────────────────────────────────────────────
export interface DashboardData {
  networkClassicData: NetworkClassic[];
  tradingIOData: TradingData[];
  tradingPCData: TradingData[];
  vergütungData: VergütungData[];
  addedValueData: AddedValueData[];
  networkNotes: NetworkNote[];
  totals: {
    classic: {
      mb3PY: number;
      nnPY: number;
      pfPY: number;
      mb3CY: number;
      nnCY: number;
      pfCY: number;
    };
    tradingIO: {
      tranchenMB3PY: number;
      tranchenNNPY: number;
      tranchenPFPY: number;
      tranchenMB3CY: number;
      tranchenNNCY: number;
      tranchenPFCY: number;
      planMB3: number;
      planNN: number;
      istMB3: number;
      istNN: number;
      pacingMB3: number;
      pacingNN: number;
    };
    vergütung: {
      nnCY: number;
      vergütung: number;
    };
    addedValue: {
      avEvents: number;
      avProduktproben: number;
      avMaFo: number;
      avSonstiges: number;
      avSumme: number;
    };
  };
  meta: {
    reportDate: string;
    reportYear: number;
    dataSource: "static" | "excel";
    lastUpdated: string;
  };
}

// ─── Stubs ───────────────────────────────────────────────────
export async function parseExcelFile(
  _fileBuffer: ArrayBuffer,
): Promise<DashboardData | null> {
  console.warn("[ExcelSync] not implemented – using static data");
  return null;
}

export async function syncDashboardData(
  _config: ExcelSyncConfig,
): Promise<{ data: DashboardData | null; error: string | null }> {
  return { data: null, error: "Excel-Sync not configured. Using static data." };
}

/** Planned: SharePoint / SMB / S3 scheduled sync (Phase 4) */
export async function syncFromRemotePath(
  _config: ExcelSyncConfig & { remotePath: string },
): Promise<{ data: DashboardData | null; error: string | null }> {
  return {
    data: null,
    error: "Remote file sync not yet enabled for this deployment.",
  };
}

// ─── calculateTotals ────────────────────────────────────────
export function calculateTotals(data: {
  networkClassicData: NetworkClassic[];
  tradingIOData: TradingData[];
  vergütungData: VergütungData[];
  addedValueData: AddedValueData[];
}): DashboardData["totals"] {
  const classic = data.networkClassicData.reduce(
    (acc, row) => ({
      mb3PY: acc.mb3PY + row.io.mb3PY,
      nnPY: acc.nnPY + row.io.nnPY,
      mb3CY: acc.mb3CY + row.io.mb3CY,
      nnCY: acc.nnCY + row.io.nnCY,
      pfPY: 0,
      pfCY: 0,
    }),
    { mb3PY: 0, nnPY: 0, mb3CY: 0, nnCY: 0, pfPY: 0, pfCY: 0 },
  );
  classic.pfPY = classic.mb3PY > 0 ? classic.nnPY / classic.mb3PY : 0;
  classic.pfCY = classic.mb3CY > 0 ? classic.nnCY / classic.mb3CY : 0;

  const tradingIO = data.tradingIOData.reduce(
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

  const vergütung = data.vergütungData.reduce(
    (acc, row) => ({
      nnCY: acc.nnCY + row.nnCY,
      vergütung: acc.vergütung + row.vergütung,
    }),
    { nnCY: 0, vergütung: 0 },
  );

  const addedValue = data.addedValueData.reduce(
    (acc, row) => ({
      avEvents: acc.avEvents + row.avEvents,
      avProduktproben: acc.avProduktproben + row.avProduktproben,
      avMaFo: acc.avMaFo + row.avMaFo,
      avSonstiges: acc.avSonstiges + row.avSonstiges,
      avSumme: acc.avSumme + row.avSumme,
    }),
    { avEvents: 0, avProduktproben: 0, avMaFo: 0, avSonstiges: 0, avSumme: 0 },
  );

  return {
    classic,
    tradingIO: {
      ...tradingIO,
      tranchenPFPY:
        tradingIO.tranchenMB3PY > 0
          ? tradingIO.tranchenNNPY / tradingIO.tranchenMB3PY
          : 0,
      tranchenPFCY:
        tradingIO.tranchenMB3CY > 0
          ? tradingIO.tranchenNNCY / tradingIO.tranchenMB3CY
          : 0,
      pacingMB3:
        tradingIO.planMB3 > 0 ? tradingIO.istMB3 / tradingIO.planMB3 : 0,
      pacingNN: tradingIO.planNN > 0 ? tradingIO.istNN / tradingIO.planNN : 0,
    },
    vergütung,
    addedValue,
  };
}

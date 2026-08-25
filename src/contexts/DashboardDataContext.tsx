import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLicense } from "@/contexts/LicenseContext";
import type { DashboardData } from "@/data/excelSync";
import {
  type AddedValueData,
  type NetworkClassic,
  type NetworkNote,
  addedValueData as staticAddedValueData,
  networkClassicData as staticClassicData,
  networkNotes as staticNotes,
  totals as staticTotals,
  tradingIOData as staticTradingIOData,
  tradingPCData as staticTradingPCData,
  vergütungData as staticVergütungData,
  type TradingData,
  type VergütungData,
} from "@/data/networkData";
import { ApiError, api } from "@/lib/api";
import {
  type ColumnMapping,
  parseExcelBuffer,
  type ValidationReport,
} from "@/lib/excelParser";

export type DataSource = "static" | "excel";

export interface UploadHistoryItem {
  id: string;
  fileName: string | null;
  isActive: boolean;
  uploadedBy: string | null;
  createdAt: string;
  validation: ValidationReport | null;
}

interface DashboardDataState {
  networkClassicData: NetworkClassic[];
  tradingIOData: TradingData[];
  tradingPCData: TradingData[];
  vergütungData: VergütungData[];
  addedValueData: AddedValueData[];
  networkNotes: NetworkNote[];
  totals: DashboardData["totals"];
  dataSource: DataSource;
  fileName: string | null;
  lastUpload: Date | null;
  isLoading: boolean;
  error: string | null;
  lastValidation: ValidationReport | null;
  uploadHistory: UploadHistoryItem[];
  columnMapping: ColumnMapping;
  uploadExcel: (file: File) => Promise<void>;
  resetToStatic: () => void;
  activateUpload: (id: string) => Promise<void>;
  refreshHistory: () => Promise<void>;
  saveColumnMapping: (mapping: ColumnMapping) => Promise<void>;
}

const DashboardDataContext = createContext<DashboardDataState | null>(null);

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx)
    throw new Error(
      "useDashboardData must be used within DashboardDataProvider",
    );
  return ctx;
}

function applyPayload(
  payload: {
    networkClassicData: NetworkClassic[];
    tradingIOData: TradingData[];
    tradingPCData: TradingData[];
    vergütungData: VergütungData[];
    addedValueData: AddedValueData[];
    totals: DashboardData["totals"];
  },
  setters: {
    setClassic: (v: NetworkClassic[]) => void;
    setIO: (v: TradingData[]) => void;
    setPC: (v: TradingData[]) => void;
    setVerg: (v: VergütungData[]) => void;
    setAV: (v: AddedValueData[]) => void;
    setTotals: (v: DashboardData["totals"]) => void;
  },
) {
  const fc = payload.networkClassicData.length
    ? payload.networkClassicData
    : staticClassicData;
  const fi = payload.tradingIOData.length
    ? payload.tradingIOData
    : staticTradingIOData;
  const fp = payload.tradingPCData.length
    ? payload.tradingPCData
    : staticTradingPCData;
  const fv = payload.vergütungData.length
    ? payload.vergütungData
    : staticVergütungData;
  const fa = payload.addedValueData.length
    ? payload.addedValueData
    : staticAddedValueData;

  setters.setClassic(fc);
  setters.setIO(fi);
  setters.setPC(fp);
  setters.setVerg(fv);
  setters.setAV(fa);
  setters.setTotals(payload.totals);
}

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const { user, canWrite } = useAuth();
  const { license } = useLicense();

  const [classicData, setClassicData] = useState(staticClassicData);
  const [tradingIO, setTradingIO] = useState(staticTradingIOData);
  const [tradingPC, setTradingPC] = useState(staticTradingPCData);
  const [vergütung, setVergütung] = useState(staticVergütungData);
  const [addedValue, setAddedValue] = useState(staticAddedValueData);
  const [notes] = useState(staticNotes);
  const [currentTotals, setCurrentTotals] = useState(staticTotals);
  const [dataSource, setDataSource] = useState<DataSource>("static");
  const [fileName, setFileName] = useState<string | null>(null);
  const [lastUpload, setLastUpload] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastValidation, setLastValidation] = useState<ValidationReport | null>(
    null,
  );
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});

  const setters = {
    setClassic: setClassicData,
    setIO: setTradingIO,
    setPC: setTradingPC,
    setVerg: setVergütung,
    setAV: setAddedValue,
    setTotals: setCurrentTotals,
  };

  const refreshHistory = useCallback(async () => {
    if (!user) return;
    try {
      const list = await api.get<UploadHistoryItem[]>("/api/dashboard/uploads");
      setUploadHistory(list);
    } catch {
      /* offline */
    }
  }, [user]);

  const loadActiveFromApi = useCallback(async () => {
    if (!user) return;
    try {
      const { active } = await api.get<{
        active: {
          fileName: string | null;
          data: {
            networkClassicData: NetworkClassic[];
            tradingIOData: TradingData[];
            tradingPCData: TradingData[];
            vergütungData: VergütungData[];
            addedValueData: AddedValueData[];
            totals: DashboardData["totals"];
          };
          validation: ValidationReport | null;
          createdAt: string;
        } | null;
      }>("/api/dashboard/active");

      if (active?.data) {
        applyPayload(active.data, setters);
        setDataSource("excel");
        setFileName(active.fileName);
        setLastUpload(new Date(active.createdAt));
        setLastValidation(active.validation);
      }
    } catch {
      /* API not running */
    }
  }, [user]);

  const loadColumnMapping = useCallback(async () => {
    if (!user) return;
    try {
      const m = await api.get<ColumnMapping>("/api/settings/column-mapping");
      setColumnMapping(m);
    } catch {
      /* ignore */
    }
  }, [user]);

  useEffect(() => {
    loadActiveFromApi();
    refreshHistory();
    loadColumnMapping();
  }, [loadActiveFromApi, refreshHistory, loadColumnMapping]);

  const uploadExcel = useCallback(
    async (file: File) => {
      if (!canWrite || (license && !license.canWrite)) {
        setError("Kein Schreibzugriff (Rolle oder Lizenz).");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const buffer = await file.arrayBuffer();
        const { data, validation } = parseExcelBuffer(buffer, columnMapping);

        if (validation.errors.length > 0) {
          setLastValidation(validation);
          throw new Error(validation.errors.join(" "));
        }

        const fc = data.networkClassicData.length
          ? data.networkClassicData
          : staticClassicData;
        const fi = data.tradingIOData.length
          ? data.tradingIOData
          : staticTradingIOData;
        const fp = data.tradingPCData.length
          ? data.tradingPCData
          : staticTradingPCData;
        const fv = data.vergütungData.length
          ? data.vergütungData
          : staticVergütungData;
        const fa = data.addedValueData.length
          ? data.addedValueData
          : staticAddedValueData;

        const payload = {
          networkClassicData: fc,
          tradingIOData: fi,
          tradingPCData: fp,
          vergütungData: fv,
          addedValueData: fa,
          totals: data.totals,
        };

        applyPayload(payload, setters);
        setDataSource("excel");
        setFileName(file.name);
        setLastUpload(new Date());
        setLastValidation(validation);

        if (user) {
          await api.post("/api/dashboard/upload", {
            fileName: file.name,
            data: payload,
            validation,
          });
          await refreshHistory();
        }
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Excel konnte nicht gelesen werden.";
        setError(msg);
        console.error("[ExcelUpload]", err);
      } finally {
        setIsLoading(false);
      }
    },
    [canWrite, license, columnMapping, user, refreshHistory],
  );

  const resetToStatic = useCallback(() => {
    setClassicData(staticClassicData);
    setTradingIO(staticTradingIOData);
    setTradingPC(staticTradingPCData);
    setVergütung(staticVergütungData);
    setAddedValue(staticAddedValueData);
    setCurrentTotals(staticTotals);
    setDataSource("static");
    setFileName(null);
    setLastUpload(null);
    setError(null);
    setLastValidation(null);
  }, []);

  const activateUpload = useCallback(
    async (id: string) => {
      if (!user) return;
      await api.post(`/api/dashboard/uploads/${id}/activate`);
      await loadActiveFromApi();
      await refreshHistory();
    },
    [user, loadActiveFromApi, refreshHistory],
  );

  const saveColumnMapping = useCallback(
    async (mapping: ColumnMapping) => {
      setColumnMapping(mapping);
      if (user) await api.put("/api/settings/column-mapping", mapping);
    },
    [user],
  );

  return (
    <DashboardDataContext.Provider
      value={{
        networkClassicData: classicData,
        tradingIOData: tradingIO,
        tradingPCData: tradingPC,
        vergütungData: vergütung,
        addedValueData: addedValue,
        networkNotes: notes,
        totals: currentTotals,
        dataSource,
        fileName,
        lastUpload,
        isLoading,
        error,
        lastValidation,
        uploadHistory,
        columnMapping,
        uploadExcel,
        resetToStatic,
        activateUpload,
        refreshHistory,
        saveColumnMapping,
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
}

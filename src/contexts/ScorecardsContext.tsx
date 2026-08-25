import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  mergeScorecard,
  type NetworkScorecard,
  networkScorecards as staticScorecards,
} from "@/data/scorecardData";
import { api } from "@/lib/api";

interface ScorecardsState {
  scorecards: NetworkScorecard[];
  loading: boolean;
  refresh: () => Promise<void>;
  updateScorecard: (sc: NetworkScorecard) => Promise<void>;
}

const ScorecardsContext = createContext<ScorecardsState | null>(null);

export function useScorecards() {
  const ctx = useContext(ScorecardsContext);
  if (!ctx)
    throw new Error("useScorecards must be used within ScorecardsProvider");
  return ctx;
}

export function ScorecardsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [scorecards, setScorecards] =
    useState<NetworkScorecard[]>(staticScorecards);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setScorecards(staticScorecards);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<NetworkScorecard[]>("/api/scorecards");
      setScorecards(
        (data.length > 0 ? data : staticScorecards).map(mergeScorecard),
      );
    } catch {
      setScorecards(staticScorecards);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateScorecard = useCallback(
    async (sc: NetworkScorecard) => {
      await api.put(`/api/scorecards/${encodeURIComponent(sc.network)}`, sc);
      await refresh();
    },
    [refresh],
  );

  return (
    <ScorecardsContext.Provider
      value={{ scorecards, loading, refresh, updateScorecard }}
    >
      {children}
    </ScorecardsContext.Provider>
  );
}

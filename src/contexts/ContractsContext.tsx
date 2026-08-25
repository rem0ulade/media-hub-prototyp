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
  type Contract,
  contracts as staticContracts,
} from "@/data/contractData";
import { api } from "@/lib/api";

interface ContractsState {
  contracts: Contract[];
  loading: boolean;
  refresh: () => Promise<void>;
  createContract: (c: Omit<Contract, "id"> & { id?: string }) => Promise<void>;
  updateContract: (c: Contract) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
}

const ContractsContext = createContext<ContractsState | null>(null);

export function useContracts() {
  const ctx = useContext(ContractsContext);
  if (!ctx)
    throw new Error("useContracts must be used within ContractsProvider");
  return ctx;
}

export function ContractsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>(staticContracts);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setContracts(staticContracts);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<Contract[]>("/api/contracts");
      setContracts(data.length > 0 ? data : staticContracts);
    } catch {
      setContracts(staticContracts);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createContract = useCallback(
    async (c: Omit<Contract, "id"> & { id?: string }) => {
      await api.post("/api/contracts", c);
      await refresh();
    },
    [refresh],
  );

  const updateContract = useCallback(
    async (c: Contract) => {
      await api.put(`/api/contracts/${c.id}`, c);
      await refresh();
    },
    [refresh],
  );

  const deleteContract = useCallback(
    async (id: string) => {
      await api.delete(`/api/contracts/${id}`);
      await refresh();
    },
    [refresh],
  );

  return (
    <ContractsContext.Provider
      value={{
        contracts,
        loading,
        refresh,
        createContract,
        updateContract,
        deleteContract,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
}

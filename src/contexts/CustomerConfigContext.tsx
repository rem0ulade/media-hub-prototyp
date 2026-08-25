import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type CustomerConfig,
  customerConfig as defaultCustomer,
  getEnabledModules,
  type ModuleConfig,
} from "@/config/customer";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface CustomerConfigState {
  config: CustomerConfig;
  navItems: ModuleConfig[];
  loading: boolean;
  updateConfig: (patch: Partial<CustomerConfig>) => Promise<void>;
}

const CustomerConfigContext = createContext<CustomerConfigState | null>(null);

export function useCustomerConfig() {
  const ctx = useContext(CustomerConfigContext);
  if (!ctx)
    throw new Error(
      "useCustomerConfig must be used within CustomerConfigProvider",
    );
  return ctx;
}

function mergeConfig(
  base: CustomerConfig,
  patch: Partial<CustomerConfig>,
): CustomerConfig {
  return {
    ...base,
    ...patch,
    modules: { ...base.modules, ...patch.modules },
    labels: { ...base.labels, ...patch.labels },
    dashboard: { ...base.dashboard, ...patch.dashboard },
  };
}

export function CustomerConfigProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();
  const [config, setConfig] = useState<CustomerConfig>(defaultCustomer);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setConfig(defaultCustomer);
      setLoading(false);
      return;
    }
    try {
      const stored = await api.get<Partial<CustomerConfig>>(
        "/api/settings/customer",
      );
      setConfig(mergeConfig(defaultCustomer, stored));
    } catch {
      setConfig(defaultCustomer);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const updateConfig = useCallback(
    async (patch: Partial<CustomerConfig>) => {
      const next = mergeConfig(config, patch);
      await api.put("/api/settings/customer", next);
      setConfig(next);
    },
    [config],
  );

  const navItems = useMemo(() => getEnabledModules(isAdmin), [isAdmin, config]);

  return (
    <CustomerConfigContext.Provider
      value={{ config, navItems, loading, updateConfig }}
    >
      {children}
    </CustomerConfigContext.Provider>
  );
}

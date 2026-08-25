import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AdminRoute, ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrandProvider } from "@/contexts/BrandContext";
import { BrandPresetProvider } from "@/contexts/BrandPresetContext";
import { ContractsProvider } from "@/contexts/ContractsContext";
import { DashboardDataProvider } from "@/contexts/DashboardDataContext";
import { LicenseProvider } from "@/contexts/LicenseContext";
import { ScorecardsProvider } from "@/contexts/ScorecardsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BackupPage } from "@/pages/BackupPage";
import { ContractsPage } from "@/pages/ContractsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { NetworksPage } from "@/pages/NetworksPage";
import { ScorecardPage } from "@/pages/ScorecardPage";
import { SettingsPage } from "@/pages/SettingsPage";

const shell = (
  <>
    <Route path="login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="networks" element={<NetworksPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="scorecard" element={<ScorecardPage />} />
        <Route path="backup" element={<BackupPage />} />
        <Route element={<AdminRoute />}>
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Route>
  </>
);

const useHashRouter = import.meta.env.VITE_HASH_ROUTER === "true";
const Router = useHashRouter ? HashRouter : BrowserRouter;
const routerBasename = useHashRouter
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" switchable>
      <Router basename={routerBasename}>
        <BrandPresetProvider>
          <AuthProvider>
            <LicenseProvider>
              <BrandProvider>
                <DashboardDataProvider>
                  <ContractsProvider>
                    <ScorecardsProvider>
                      <Routes>
                        <Route path="/">{shell}</Route>
                        <Route
                          path="*"
                          element={<Navigate to="/login" replace />}
                        />
                      </Routes>
                      <Toaster richColors position="top-right" />
                    </ScorecardsProvider>
                  </ContractsProvider>
                </DashboardDataProvider>
              </BrandProvider>
            </LicenseProvider>
          </AuthProvider>
        </BrandPresetProvider>
      </Router>
    </ThemeProvider>
  );
}

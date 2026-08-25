import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/config/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useBrand } from "@/contexts/BrandContext";
import { useBrandPreset } from "@/contexts/BrandPresetContext";
import { ApiError } from "@/lib/api";
import { isStaticDemo } from "@/lib/static-demo";
import {
  BASE_DEMO_ACCOUNTS,
  formatDemoCredentialLine,
} from "../../shared/demo-credentials";

export function LoginPage() {
  const navigate = useNavigate();
  const { brand } = useBrand();
  const { preset, to } = useBrandPreset();
  const { user, loading, login, loginDemo, apiOnline } = useAuth();
  const isDemoMode = !apiOnline;
  const isPublicDemo = isStaticDemo;
  const showLoudDemoChrome = isDemoMode && preset.showDemoChrome;
  const showCompactCredentials =
    isDemoMode && !preset.showDemoChrome && !isPublicDemo;
  const demoAccounts =
    preset.demoAccounts.length > 0 ? preset.demoAccounts : BASE_DEMO_ACCOUNTS;
  const primaryDemo = demoAccounts[0];
  const [username, setUsername] = useState(primaryDemo.username);
  const [password, setPassword] = useState(primaryDemo.password);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isDemoMode) return;
    document.title = preset.showDemoChrome
      ? `${brand.companyName} — ${t("demoVersionTitle")}`
      : preset.pageTitle;
  }, [isDemoMode, brand.companyName, preset.pageTitle, preset.showDemoChrome]);

  if (!loading && user) return <Navigate to={to("/")} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isPublicDemo) {
        await loginDemo();
      } else {
        await login(username, password);
      }
      navigate(to("/"), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("loginError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-burgundy-950/40 to-background">
      <Card className="w-full max-w-md border-burgundy-800/40 bg-burgundy-950/25 backdrop-blur-sm">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="flex justify-center">
            <BrandLogo className="size-12" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <CardTitle className="text-xl text-white">
              {brand.companyName}
            </CardTitle>
            {showLoudDemoChrome && (
              <Badge className="bg-burgundy-600/30 text-burgundy-100 border-burgundy-500/40 text-[10px] uppercase tracking-wider">
                {t("demoVersionBadge")}
              </Badge>
            )}
          </div>
          <p className="text-xs text-white/45">{brand.tagline}</p>
        </CardHeader>
        <CardContent>
          {showLoudDemoChrome ? (
            <div className="mb-4 rounded-lg border border-burgundy-500/35 bg-burgundy-950/40 px-4 py-3 text-center">
              <Sparkles className="size-5 text-burgundy-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-burgundy-100">
                {t("demoVersionTitle")}
              </p>
              <p className="text-xs text-burgundy-200/75 mt-1.5 leading-relaxed">
                {t("demoVersionLoginLead")}
              </p>
              {!isPublicDemo ? (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-burgundy-300/50 mt-3 mb-1">
                    {t("demoVersionCredentials")}
                  </p>
                  <p className="text-[11px] text-burgundy-300/80 font-mono break-all leading-relaxed">
                    {formatDemoCredentialLine(primaryDemo)}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-burgundy-300/50 mt-3 mb-1">
                    {t("demoVersionMoreRoles")}
                  </p>
                  <div className="space-y-1 text-[10px] text-burgundy-300/65 font-mono leading-relaxed">
                    {demoAccounts.slice(1).map(account => (
                      <p key={account.id} className="break-all">
                        {formatDemoCredentialLine(account)}
                      </p>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {showCompactCredentials ? (
            <div className="mb-4 rounded-lg px-4 py-3 text-center border border-burgundy-800/35 bg-burgundy-950/30">
              <p className="text-[10px] uppercase tracking-wider text-burgundy-300/50 mb-1.5">
                {t("demoLoginHint")}
              </p>
              <p className="text-[11px] text-burgundy-300/85 font-mono break-all leading-relaxed">
                {formatDemoCredentialLine(primaryDemo)}
              </p>
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            autoComplete="off"
            data-1p-ignore
            data-bwignore
            data-lpignore="true"
          >
            {!isPublicDemo ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white/70">
                    {isDemoMode ? t("email") : t("username")}
                  </Label>
                  <Input
                    id="username"
                    name={isDemoMode ? "demo-email" : "username"}
                    type={isDemoMode ? "email" : "text"}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="off"
                    className="bg-burgundy-950/40 border-burgundy-800/40 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/70">
                    {t("password")}
                  </Label>
                  <Input
                    id="password"
                    name={isDemoMode ? "demo-access-key" : "password"}
                    type={isDemoMode ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete={isDemoMode ? "off" : "current-password"}
                    className={`bg-burgundy-950/40 border-burgundy-800/40 text-white ${
                      isDemoMode ? "[-webkit-text-security:disc]" : ""
                    }`}
                  />
                </div>
              </>
            ) : null}
            {error && (
              <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-800/30 rounded px-3 py-2">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className={`w-full text-white gap-2 ${
                isDemoMode
                  ? "bg-burgundy-600 hover:bg-burgundy-500"
                  : "bg-burgundy-700 hover:bg-burgundy-600"
              }`}
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isDemoMode ? (
                <Sparkles className="size-4" />
              ) : null}
              {showLoudDemoChrome ? t("demoVersionLoginButton") : t("login")}
            </Button>
          </form>

          {!isDemoMode && (
            <div className="text-[10px] text-white/30 text-center mt-4 space-y-1 font-mono">
              <p className="uppercase tracking-wider text-white/25">
                {t("demoVersionCredentials")}
              </p>
              <p className="break-all">
                {formatDemoCredentialLine(primaryDemo)}
              </p>
              {demoAccounts.slice(1).map(account => (
                <p key={account.id} className="break-all text-white/25">
                  {formatDemoCredentialLine(account)}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

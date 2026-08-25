import {
  Download,
  FileSpreadsheet,
  History,
  Settings,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Locale, t } from "@/config/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useBrand } from "@/contexts/BrandContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useLicense } from "@/contexts/LicenseContext";
import { api } from "@/lib/api";
import { buildExcelTemplate } from "@/lib/excelParser";

export function SettingsPage() {
  const { brand, updateBrand } = useBrand();
  const { isAdmin } = useAuth();
  const { license, refresh: refreshLicense } = useLicense();
  const {
    uploadHistory,
    activateUpload,
    columnMapping,
    saveColumnMapping,
    lastValidation,
  } = useDashboardData();

  const [brandForm, setBrandForm] = useState(brand);

  useEffect(() => {
    setBrandForm(brand);
  }, [brand]);
  const [users, setUsers] = useState<
    Array<{ id: string; username: string; role: string }>
  >([]);
  const [audit, setAudit] = useState<Array<Record<string, unknown>>>([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "viewer",
  });
  const [mappingJson, setMappingJson] = useState(
    JSON.stringify(columnMapping, null, 2),
  );
  const [licenseExpires, setLicenseExpires] = useState(
    license?.expiresAt?.slice(0, 10) ?? "",
  );

  const loadUsers = async () => {
    const data = await api.get<typeof users>("/api/users");
    setUsers(data);
  };

  const loadAudit = async () => {
    const data = await api.get<typeof audit>("/api/audit?limit=50");
    setAudit(data);
  };

  const handleSaveBrand = async () => {
    try {
      await updateBrand(brandForm);
      toast.success("Branding gespeichert");
    } catch {
      toast.error(t("settingsUnavailable"));
    }
  };

  const handleDownloadTemplate = () => {
    const buf = buildExcelTemplate();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brand.exportFileName}-template.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-white/50">
        Nur Administratoren haben Zugriff auf die Einstellungen.
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto px-3 sm:px-6 py-6 space-y-6">
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        <Settings className="size-5 text-burgundy-300" />
        {t("settings")}
      </h1>

      <Tabs defaultValue="branding">
        <TabsList className="bg-burgundy-950/40 border border-burgundy-800/30">
          <TabsTrigger value="branding">{t("branding")}</TabsTrigger>
          <TabsTrigger value="users">{t("users")}</TabsTrigger>
          <TabsTrigger value="uploads">{t("uploadHistory")}</TabsTrigger>
          <TabsTrigger value="license">Lizenz</TabsTrigger>
          <TabsTrigger value="audit">{t("auditLog")}</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="mt-4 space-y-4">
          <Card className="border-burgundy-800/25 bg-burgundy-950/15">
            <CardHeader>
              <CardTitle className="text-sm text-white">
                {t("branding")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(
                [
                  "companyName",
                  "tagline",
                  "fiscalYear",
                  "pageTitle",
                  "exportFileName",
                ] as const
              ).map(key => (
                <div key={key} className="space-y-1">
                  <Label className="text-white/60 text-xs">{key}</Label>
                  <Input
                    value={brandForm[key]}
                    onChange={e =>
                      setBrandForm({ ...brandForm, [key]: e.target.value })
                    }
                    className="bg-burgundy-950/30 border-burgundy-800/35 text-white"
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">locale</Label>
                <select
                  value={brandForm.locale ?? "de"}
                  onChange={e =>
                    setBrandForm({
                      ...brandForm,
                      locale: e.target.value as Locale,
                    })
                  }
                  className="w-full h-9 rounded-md bg-burgundy-950/30 border border-burgundy-800/35 text-white text-sm px-3"
                >
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
              <Button
                onClick={handleSaveBrand}
                className="bg-burgundy-700 hover:bg-burgundy-600"
              >
                {t("save")}
              </Button>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="gap-2"
          >
            <FileSpreadsheet className="size-4" />
            {t("excelTemplate")}
          </Button>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card className="border-burgundy-800/25 bg-burgundy-950/15">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Users className="size-4" />
                {t("users")}
              </CardTitle>
              <Button size="sm" variant="outline" onClick={loadUsers}>
                Laden
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-white/80">
                {users.map(u => (
                  <li
                    key={u.id}
                    className="flex justify-between border-b border-white/5 pb-2"
                  >
                    <span>{u.username}</span>
                    <span className="text-white/40">{u.role}</span>
                  </li>
                ))}
              </ul>
              <div className="grid gap-2 sm:grid-cols-3">
                <Input
                  placeholder="Benutzername"
                  value={newUser.username}
                  onChange={e =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="bg-burgundy-950/30 border-burgundy-800/35 text-white"
                />
                <Input
                  placeholder="Passwort"
                  type="password"
                  value={newUser.password}
                  onChange={e =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="bg-burgundy-950/30 border-burgundy-800/35 text-white"
                />
                <select
                  value={newUser.role}
                  onChange={e =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="h-9 rounded-md bg-burgundy-950/30 border border-burgundy-800/35 text-white text-sm px-3"
                >
                  <option value="admin">admin</option>
                  <option value="editor">editor</option>
                  <option value="viewer">viewer</option>
                </select>
              </div>
              <Button
                onClick={async () => {
                  try {
                    await api.post("/api/users", newUser);
                    setNewUser({ username: "", password: "", role: "viewer" });
                    await loadUsers();
                    toast.success("Benutzer angelegt");
                  } catch {
                    toast.error(t("settingsUnavailable"));
                  }
                }}
              >
                Benutzer anlegen
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploads" className="mt-4 space-y-4">
          {lastValidation && (
            <Card className="border-burgundy-800/25 bg-burgundy-950/15">
              <CardHeader>
                <CardTitle className="text-sm text-white">
                  {t("validationReport")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-white/60 space-y-1">
                <p>Zeilen: {lastValidation.rowCount}</p>
                {lastValidation.warnings.map(w => (
                  <p key={w} className="text-amber-400">
                    ⚠ {w}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="border-burgundy-800/25 bg-burgundy-950/15">
            <CardHeader>
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <History className="size-4" />
                {t("uploadHistory")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {uploadHistory.length === 0 ? (
                <p className="text-xs text-white/40">
                  Noch keine Uploads gespeichert.
                </p>
              ) : (
                uploadHistory.map(u => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between text-sm border-b border-white/5 py-2"
                  >
                    <div>
                      <span className="text-white">{u.fileName ?? u.id}</span>
                      {u.isActive && (
                        <span className="ml-2 text-[10px] text-emerald-400">
                          aktiv
                        </span>
                      )}
                      <div className="text-[10px] text-white/35">
                        {u.createdAt}
                      </div>
                    </div>
                    {!u.isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => activateUpload(u.id)}
                      >
                        {t("activate")}
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-burgundy-800/25 bg-burgundy-950/15">
            <CardHeader>
              <CardTitle className="text-sm text-white">
                Spalten-Mapping (JSON)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <textarea
                value={mappingJson}
                onChange={e => setMappingJson(e.target.value)}
                rows={6}
                className="w-full rounded-md bg-burgundy-950/30 border border-burgundy-800/35 text-white text-xs font-mono p-3"
              />
              <Button
                onClick={async () => {
                  try {
                    const parsed = JSON.parse(mappingJson) as Record<
                      string,
                      string
                    >;
                    await saveColumnMapping(parsed);
                    toast.success("Mapping gespeichert");
                  } catch {
                    toast.error(t("settingsUnavailable"));
                  }
                }}
              >
                Mapping speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="license" className="mt-4">
          <Card className="border-burgundy-800/25 bg-burgundy-950/15">
            <CardHeader>
              <CardTitle className="text-sm text-white">
                Wartungslizenz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-white/50">
                Status:{" "}
                {license?.canWrite ? (
                  <span className="text-emerald-400">aktiv</span>
                ) : (
                  <span className="text-rose-400">abgelaufen / inaktiv</span>
                )}
              </p>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Gültig bis</Label>
                <Input
                  type="date"
                  value={licenseExpires}
                  onChange={e => setLicenseExpires(e.target.value)}
                  className="bg-burgundy-950/30 border-burgundy-800/35 text-white"
                />
              </div>
              <Button
                onClick={async () => {
                  try {
                    await api.put("/api/license", {
                      expiresAt: new Date(licenseExpires).toISOString(),
                      maintenanceActive: true,
                    });
                    await refreshLicense();
                    toast.success("Lizenz aktualisiert");
                  } catch {
                    toast.error(t("settingsUnavailable"));
                  }
                }}
              >
                Lizenz speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card className="border-burgundy-800/25 bg-burgundy-950/15">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-sm text-white">
                {t("auditLog")}
              </CardTitle>
              <Button size="sm" variant="outline" onClick={loadAudit}>
                <Download className="size-3 mr-1" />
                Laden
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-white/60 space-y-1 max-h-80 overflow-y-auto font-mono">
                {audit.map(a => (
                  <li key={String(a.id)}>
                    {String(a.created_at)} · {String(a.username ?? "—")} ·{" "}
                    {String(a.action)}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

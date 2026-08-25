import { Archive, Download, FileText, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { t } from "@/config/locale";
import { useBrand } from "@/contexts/BrandContext";
import { useContracts } from "@/contexts/ContractsContext";
import { statusConfig, typeConfig } from "@/data/contractData";
import { formatDate, formatEUR } from "@/lib/formatters";

export function BackupPage() {
  const { contracts } = useContracts();
  const { brand } = useBrand();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("alle");

  const types = ["alle", ...Array.from(new Set(contracts.map(c => c.type)))];

  const filtered = contracts.filter(c => {
    const matchesSearch =
      search === "" ||
      c.network.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "alle" || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Archive className="size-5 text-burgundy-300" />
            {t("archiveTitle")}
          </h1>
          <p className="text-xs text-white/40 mt-0.5">{t("archiveSubtitle")}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-burgundy-800/25 bg-burgundy-950/15">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="text-xl font-bold font-mono text-white">
              {contracts.length}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
              {t("archiveTotal")}
            </div>
          </CardContent>
        </Card>
        <Card className="border-burgundy-800/25 bg-burgundy-950/15">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="text-xl font-bold font-mono text-emerald-400">
              {contracts.filter(c => c.status === "aktiv").length}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
              {t("archiveActive")}
            </div>
          </CardContent>
        </Card>
        <Card className="border-burgundy-800/25 bg-burgundy-950/15">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="text-xl font-bold font-mono text-amber-400">
              {
                contracts.filter(
                  c => c.status === "verhandlung" || c.status === "entwurf",
                ).length
              }
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
              {t("archiveOpen")}
            </div>
          </CardContent>
        </Card>
        <Card className="border-burgundy-800/25 bg-burgundy-950/15">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="text-xl font-bold font-mono text-rose-400">
              {contracts.filter(c => c.status === "abgelaufen").length}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
              {t("archiveExpired")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
          <Input
            placeholder={t("searchArchive")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-burgundy-950/25 border-burgundy-800/35 text-sm text-white placeholder:text-white/25 h-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {types.map(typeKey => (
            <button
              key={typeKey}
              onClick={() => setTypeFilter(typeKey)}
              className={`text-[10px] px-2.5 py-1.5 rounded-full border transition-colors ${
                typeFilter === typeKey
                  ? "border-burgundy-600/45 bg-burgundy-800/35 text-white"
                  : "border-burgundy-800/25 text-white/40 hover:text-white/60 hover:bg-burgundy-950/25"
              }`}
            >
              {typeKey === "alle" ? t("archiveAllTypes") : typeKey}
            </button>
          ))}
        </div>
      </div>

      {/* Contract Archive Table */}
      <Card className="border-burgundy-800/25 bg-burgundy-950/15">
        <CardHeader className="pb-2 px-4 sm:px-5">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="size-4 text-burgundy-300" />
            {t("archiveTableTitle")}
            <span className="text-xs text-white/35 font-normal ml-1">
              {t("archiveEntries").replace("{count}", String(filtered.length))}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-burgundy-800/35">
                  <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-white/45 font-semibold">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-white/45 font-semibold">
                    {t("labelPartner")}
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-white/45 font-semibold">
                    {t("labelContract")}
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-white/45 font-semibold">
                    {t("contractsType")}
                  </th>
                  <th className="text-center py-3 px-4 text-[10px] uppercase tracking-wider text-white/45 font-semibold">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-white/45 font-semibold">
                    {t("labelTerm")}
                  </th>
                  <th className="text-right py-3 px-4 text-[10px] uppercase tracking-wider text-white/45 font-semibold">
                    Vol. {t("labelNet")}
                  </th>
                  <th className="text-right py-3 px-4 text-[10px] uppercase tracking-wider text-white/45 font-semibold">
                    {t("labelUpdated")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const statusCfg = statusConfig[c.status];
                  const typeCfg = typeConfig[c.type];
                  return (
                    <tr
                      key={c.id}
                      className={`border-b border-white/[0.04] hover:bg-burgundy-950/35 transition-colors ${
                        i % 2 === 0 ? "bg-burgundy-950/12" : ""
                      }`}
                    >
                      <td className="py-2.5 px-4 font-mono text-xs text-white/45">
                        {c.id}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-white text-[13px]">
                        {c.network}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-white/70 max-w-[200px] truncate">
                        {c.title}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-white/55">
                        <span className="font-mono text-[10px] bg-burgundy-800/20 px-1.5 py-0.5 rounded">
                          {typeCfg.icon}
                        </span>{" "}
                        {c.type}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={`text-[9px] ${statusCfg.color} border-current/30`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-4 text-[11px] text-white/50 font-mono whitespace-nowrap">
                        {formatDate(c.startDate)} – {formatDate(c.endDate)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-xs text-white/65">
                        {c.volumeNN ? formatEUR(c.volumeNN, true) : "–"}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-white/35 font-mono">
                        {formatDate(c.lastUpdated)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-3 space-y-2.5">
            {filtered.map(c => {
              const statusCfg = statusConfig[c.status];
              const typeCfg = typeConfig[c.type];
              return (
                <div
                  key={c.id}
                  className="rounded-lg border border-burgundy-800/20 bg-burgundy-950/18 p-3"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white">
                      {c.network}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] px-1.5 py-0 ${statusCfg.color} border-current/30`}
                    >
                      {statusCfg.label}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-white/50 truncate mb-1">
                    {c.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-white/35">
                    <span>
                      {typeCfg.icon} {c.type}
                    </span>
                    <span className="font-mono">
                      {c.volumeNN ? formatEUR(c.volumeNN, true) : "–"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/35">
              <Archive className="size-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{t("archiveNoEntries")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Export Section */}
      <Card className="border-burgundy-800/25 bg-burgundy-950/15">
        <CardHeader className="pb-2 px-4 sm:px-5">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Download className="size-4 text-burgundy-300" />
            {t("archiveDataExport")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-5 pb-5">
          <p className="text-xs text-white/45 mb-4">{t("archiveExportHint")}</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="border-burgundy-700/35 text-burgundy-200 text-xs h-8 gap-1.5 hover:bg-burgundy-900/25"
              onClick={() => {
                const csv = [
                  [
                    "ID",
                    "Partner",
                    "Title",
                    "Type",
                    "Status",
                    "Start",
                    "End",
                    "Vol. Netto",
                  ].join(";"),
                  ...contracts.map(c =>
                    [
                      c.id,
                      c.network,
                      c.title,
                      c.type,
                      c.status,
                      c.startDate,
                      c.endDate,
                      c.volumeNN ?? "",
                    ].join(";"),
                  ),
                ].join("\n");
                const blob = new Blob(["﻿" + csv], {
                  type: "text/csv;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${brand.exportFileName}-contracts.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="size-3" />
              Verträge (CSV)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-burgundy-700/35 text-burgundy-200 text-xs h-8 gap-1.5 hover:bg-burgundy-900/25"
              onClick={() => {
                const data = JSON.stringify(contracts, null, 2);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${brand.exportFileName}-contracts.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="size-3" />
              Verträge (JSON)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

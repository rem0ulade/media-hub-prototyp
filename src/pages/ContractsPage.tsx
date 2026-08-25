import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Filter,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { t } from "@/config/locale";
import { useContracts } from "@/contexts/ContractsContext";
import {
  type Contract,
  type ContractStatus,
  statusConfig,
  typeConfig,
} from "@/data/contractData";
import { formatDate, formatEUR, formatPct } from "@/lib/formatters";

function ContractCard({
  contract,
  expanded,
  onToggle,
}: {
  contract: Contract;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusCfg = statusConfig[contract.status];
  const typeCfg = typeConfig[contract.type];

  return (
    <Card
      className={`border-burgundy-800/25 bg-burgundy-950/15 transition-all ${
        expanded ? "ring-1 ring-burgundy-700/35" : ""
      }`}
    >
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full text-left px-4 sm:px-5 py-4 flex items-start gap-4"
        >
          {/* Type badge */}
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-burgundy-900/25 text-[11px] font-bold text-burgundy-300 shrink-0 mt-0.5">
            {typeCfg.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-semibold text-white">
                {contract.title}
              </span>
              <Badge
                variant="outline"
                className={`text-[9px] px-1.5 py-0 ${statusCfg.color} border-current/30`}
              >
                {statusCfg.label}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/45 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="size-3" />
                {contract.network}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(contract.startDate)} –{" "}
                {formatDate(contract.endDate)}
              </span>
              <span className="font-mono">{contract.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {contract.volumeNN && (
              <div className="hidden md:block text-right">
                <div className="text-xs font-mono text-white/75 font-semibold">
                  {formatEUR(contract.volumeNN, true)}
                </div>
                <div className="text-[10px] text-white/35">
                  Vol. {t("labelNet")}
                </div>
              </div>
            )}
            {expanded ? (
              <ChevronUp className="size-4 text-white/35" />
            ) : (
              <ChevronDown className="size-4 text-white/35" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="px-4 sm:px-5 pb-5 border-t border-burgundy-800/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div>
                <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">
                  Volume {t("labelGross")}
                </div>
                <div className="text-sm font-mono text-white/75">
                  {contract.volumeMB3 ? formatEUR(contract.volumeMB3) : "–"}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">
                  Volume {t("labelNet")}
                </div>
                <div className="text-sm font-mono text-white/75">
                  {contract.volumeNN ? formatEUR(contract.volumeNN) : "–"}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">
                  {t("labelMargin")}
                </div>
                <div className="text-sm font-mono text-burgundy-300">
                  {contract.payrate ? formatPct(contract.payrate) : "–"}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">
                  {t("contractsType")}
                </div>
                <div className="text-sm text-white/65">{contract.type}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-burgundy-800/15">
              <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1.5">
                {t("labelConditions")}
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                {contract.conditions}
              </p>
            </div>

            {contract.notes && (
              <div className="mt-3 pt-3 border-t border-burgundy-800/15">
                <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1.5">
                  {t("labelNotes")}
                </div>
                <p className="text-xs text-white/50 leading-relaxed italic">
                  {contract.notes}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-[10px] text-white/30">
              <span>
                {t("labelResponsible")}: {contract.responsible}
              </span>
              <span>
                {t("labelLastUpdated")}: {formatDate(contract.lastUpdated)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ContractsPage() {
  const { contracts } = useContracts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "alle">(
    "alle",
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = contracts.filter(c => {
    const matchesSearch =
      search === "" ||
      c.network.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "alle" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    alle: contracts.length,
    aktiv: contracts.filter(c => c.status === "aktiv").length,
    verhandlung: contracts.filter(c => c.status === "verhandlung").length,
    abgelaufen: contracts.filter(c => c.status === "abgelaufen").length,
    entwurf: contracts.filter(c => c.status === "entwurf").length,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="size-5 text-burgundy-300" />
            {t("contractsTitle")}
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            {t("contractsSubtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/35 font-mono">
            {t("contractsCount")
              .replace("{filtered}", String(filtered.length))
              .replace("{total}", String(contracts.length))}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(
          ["aktiv", "verhandlung", "entwurf", "abgelaufen"] as ContractStatus[]
        ).map(s => {
          const cfg = statusConfig[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "alle" : s)}
              className={`rounded-lg border px-3 py-3 text-left transition-all ${
                statusFilter === s
                  ? `${cfg.bg} ring-1 ring-current/20`
                  : "border-burgundy-800/20 bg-burgundy-950/15 hover:bg-burgundy-950/22"
              }`}
            >
              <div className={`text-xl font-bold font-mono ${cfg.color}`}>
                {statusCounts[s]}
              </div>
              <div className="text-[10px] text-white/45 uppercase tracking-wider mt-0.5">
                {cfg.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
          <Input
            placeholder={t("searchContracts")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-burgundy-950/25 border-burgundy-800/35 text-sm text-white placeholder:text-white/25 h-9"
          />
        </div>
        {statusFilter !== "alle" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter("alle")}
            className="border-burgundy-700/35 text-burgundy-300 text-xs h-9 gap-1.5"
          >
            <Filter className="size-3" />
            {t("resetFilter")}
          </Button>
        )}
      </div>

      {/* Contract List */}
      <div className="space-y-3">
        {filtered.map(c => (
          <ContractCard
            key={c.id}
            contract={c}
            expanded={expandedId === c.id}
            onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/35">
            <FileText className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">{t("noContracts")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

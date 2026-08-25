import {
  ArrowRight,
  BriefcaseBusiness,
  CircleDollarSign,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/config/locale";
import { useBrandPreset } from "@/contexts/BrandPresetContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useScorecards } from "@/contexts/ScorecardsContext";
import { staticCrmActivities, staticCrmDeals } from "@/data/salesData";
import { formatEUR, formatPct } from "@/lib/formatters";
import { calculateSalesManagementSummary } from "@/lib/salesInsights";

export function SalesManagementSummary() {
  const { networkClassicData } = useDashboardData();
  const { scorecards } = useScorecards();
  const { to } = useBrandPreset();
  const summary = calculateSalesManagementSummary(
    staticCrmDeals,
    staticCrmActivities,
    scorecards,
    networkClassicData,
  );
  const metrics = [
    {
      label: t("salesWonYtdShort"),
      value: formatEUR(summary.wonValueYtd, true),
      detail: t("salesClosedDealValue"),
      icon: CircleDollarSign,
      color: "text-emerald-300",
    },
    {
      label: t("salesNewPipeline4w"),
      value: formatEUR(summary.newPipelineLastFourWeeks, true),
      detail:
        summary.pipelineChange === null
          ? t("salesNoPriorPeriod")
          : `${formatPct(summary.pipelineChange)} ${t("salesVsPrior")}`,
      icon: TrendingUp,
      color: "text-burgundy-300",
    },
    {
      label: t("salesWinRate"),
      value: formatPct(summary.winRateByCount),
      detail: `${formatPct(summary.winRateByValue)} ${t("salesByValue")}`,
      icon: Target,
      color: "text-amber-200",
    },
    {
      label: t("salesActiveOppsShort"),
      value: String(summary.activeOpportunities),
      detail: t("salesQualToNegotiation"),
      icon: BriefcaseBusiness,
      color: "text-sky-300",
    },
  ];

  return (
    <Card className="glass-card overflow-hidden border-white/10" padding="none">
      <CardHeader className="gap-3 border-b border-white/[0.06] px-5 pb-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-burgundy-300/75">
                {t("salesMgmtSummary")}
              </span>
              <Badge
                variant="outline"
                className="border-amber-500/25 text-[9px] uppercase text-amber-200/70"
              >
                {t("salesCrmPreview")}
              </Badge>
            </div>
            <CardTitle className="text-lg text-white">
              {t("salesMgmtSummaryTitle")}
            </CardTitle>
            <p className="mt-1 text-xs text-white/35">
              {t("salesMgmtSummarySub")}
            </p>
          </div>
          <Link
            to={to("/sales-insights")}
            className="flex w-fit items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-medium text-burgundy-100 backdrop-blur-md transition-colors hover:bg-white/[0.12] hover:text-white"
          >
            {t("salesOpenPage")} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(metric => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/40">
                <metric.icon className={`size-3.5 ${metric.color}`} />
                {metric.label}
              </div>
              <div
                className={`mt-2 font-mono text-xl font-bold ${metric.color}`}
              >
                {metric.value}
              </div>
              <div className="mt-1 text-[10px] text-white/35">
                {metric.detail}
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3">
            <span className="flex items-center gap-2 text-xs text-white/55">
              <UsersRound className="size-4 text-amber-300" />
              {t("salesHighPotential")}
            </span>
            <strong className="font-mono text-lg text-amber-200">
              {summary.highPotentialWithoutOpportunity}
            </strong>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-rose-500/15 bg-rose-500/[0.04] px-4 py-3">
            <span className="flex items-center gap-2 text-xs text-white/55">
              <UsersRound className="size-4 text-rose-300" />
              {t("salesInactiveAccounts")}
            </span>
            <strong className="font-mono text-lg text-rose-200">
              {summary.inactiveRevenueAccounts}
            </strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

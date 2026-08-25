import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarClock,
  CircleDollarSign,
  Filter,
  Radar,
  Target,
  UsersRound,
} from "lucide-react";
import { type ElementType, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { t } from "@/config/locale";
import { useContracts } from "@/contexts/ContractsContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useScorecards } from "@/contexts/ScorecardsContext";
import type { CrmDealStage } from "@/data/salesData";
import { staticCrmActivities, staticCrmDeals } from "@/data/salesData";
import { formatEUR, formatPct } from "@/lib/formatters";
import {
  calculateAccountOpportunities,
  calculateFunnel,
  calculateOwnerSummaries,
  dealStageLabels,
  getSalesReferenceDate,
} from "@/lib/salesInsights";

type PeriodFilter = "4w" | "ytd";

const ALL = "all";
const DAY_MS = 86_400_000;

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ElementType;
  color: string;
}) {
  return (
    <Card className="glass-card border-white/10" padding="none">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/40">
          <Icon className={`size-4 ${color}`} /> {label}
        </div>
        <div className={`mt-2 font-mono text-2xl font-bold ${color}`}>
          {value}
        </div>
        <p className="mt-1 text-[10px] text-white/35">{detail}</p>
      </CardContent>
    </Card>
  );
}

function scoreLabel(value: number | null): string {
  return value === null ? "N/A" : String(Math.round(value));
}

export function SalesInsightsPage() {
  const { networkClassicData } = useDashboardData();
  const { scorecards } = useScorecards();
  const { contracts } = useContracts();
  const [ownerFilter, setOwnerFilter] = useState(ALL);
  const [networkFilter, setNetworkFilter] = useState(ALL);
  const [stageFilter, setStageFilter] = useState(ALL);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("ytd");
  const reference = getSalesReferenceDate(staticCrmDeals, staticCrmActivities);
  const periodStart =
    periodFilter === "4w"
      ? reference.getTime() - 27 * DAY_MS
      : new Date(reference.getFullYear(), 0, 1).getTime();

  const owners = Array.from(
    new Set(staticCrmDeals.map(deal => deal.owner)),
  ).sort();
  const networks = Array.from(
    new Set([
      ...staticCrmDeals.map(deal => deal.network),
      ...networkClassicData.map(row => row.network),
    ]),
  ).sort();

  const filteredDeals = useMemo(
    () =>
      staticCrmDeals.filter(deal => {
        const createdAt = new Date(`${deal.createdAt}T12:00:00`).getTime();
        return (
          createdAt >= periodStart &&
          (ownerFilter === ALL || deal.owner === ownerFilter) &&
          (networkFilter === ALL || deal.network === networkFilter) &&
          (stageFilter === ALL || deal.stage === stageFilter)
        );
      }),
    [networkFilter, ownerFilter, periodStart, stageFilter],
  );
  const filteredActivities = useMemo(
    () =>
      staticCrmActivities.filter(activity => {
        const occurredAt = new Date(
          `${activity.occurredAt}T12:00:00`,
        ).getTime();
        return (
          occurredAt >= periodStart &&
          (ownerFilter === ALL || activity.owner === ownerFilter) &&
          (networkFilter === ALL || activity.network === networkFilter)
        );
      }),
    [networkFilter, ownerFilter, periodStart],
  );
  const ownerSummaries = calculateOwnerSummaries(
    filteredDeals,
    filteredActivities,
  );
  const accountOpportunities = calculateAccountOpportunities(
    networkClassicData,
    scorecards,
    contracts,
    staticCrmDeals,
    staticCrmActivities,
  ).filter(
    account =>
      (ownerFilter === ALL || account.owner === ownerFilter) &&
      (networkFilter === ALL || account.network === networkFilter),
  );
  const funnel = calculateFunnel(filteredDeals);
  const openPipeline = filteredDeals
    .filter(deal => !["gewonnen", "verloren"].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.value, 0);
  const wonValue = filteredDeals
    .filter(deal => deal.stage === "gewonnen")
    .reduce((sum, deal) => sum + deal.value, 0);
  const decided = filteredDeals.filter(deal =>
    ["gewonnen", "verloren"].includes(deal.stage),
  );
  const wonCount = decided.filter(deal => deal.stage === "gewonnen").length;
  const priorityAccounts = accountOpportunities.filter(
    account => account.priorityReasons.length > 0,
  );
  const overdueDeals = filteredDeals.filter(
    deal =>
      !["gewonnen", "verloren"].includes(deal.stage) &&
      new Date(`${deal.expectedCloseAt}T12:00:00`) < reference,
  );

  return (
    <div className="mx-auto max-w-[1540px] space-y-6 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              {t("salesInsightsTitle")}
            </h1>
            <Badge
              variant="outline"
              className="border-amber-500/25 text-[9px] uppercase text-amber-200/70"
            >
              {t("salesCrmPreview")}
            </Badge>
          </div>
          <p className="text-xs text-white/45">{t("salesInsightsSubtitle")}</p>
          <p className="mt-1 text-[10px] text-white/25">
            {t("salesCrmAsOf")} {reference.toLocaleDateString("de-DE")}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            value={periodFilter}
            onValueChange={value => setPeriodFilter(value as PeriodFilter)}
          >
            <SelectTrigger
              size="sm"
              className="border-white/10 bg-white/[0.06] text-xs backdrop-blur-md"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">{t("salesPeriodYtd")}</SelectItem>
              <SelectItem value="4w">{t("salesPeriod4w")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger
              size="sm"
              className="border-white/10 bg-white/[0.06] text-xs backdrop-blur-md"
            >
              <SelectValue placeholder={t("salesOwner")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("salesAllOwners")}</SelectItem>
              {owners.map(owner => (
                <SelectItem key={owner} value={owner}>
                  {owner}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={networkFilter} onValueChange={setNetworkFilter}>
            <SelectTrigger
              size="sm"
              className="border-white/10 bg-white/[0.06] text-xs backdrop-blur-md"
            >
              <SelectValue placeholder={t("navNetworks")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("salesAllPartners")}</SelectItem>
              {networks.map(network => (
                <SelectItem key={network} value={network}>
                  {network}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger
              size="sm"
              className="border-white/10 bg-white/[0.06] text-xs backdrop-blur-md"
            >
              <Filter className="size-3.5" />
              <SelectValue placeholder={t("salesStage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("salesAllStages")}</SelectItem>
              {(Object.keys(dealStageLabels) as CrmDealStage[]).map(stage => (
                <SelectItem key={stage} value={stage}>
                  {dealStageLabels[stage]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={t("salesWon")}
          value={formatEUR(wonValue, true)}
          detail={
            periodFilter === "ytd" ? t("salesWonYtd") : t("salesWonFourWeeks")
          }
          icon={CircleDollarSign}
          color="text-emerald-300"
        />
        <MetricCard
          label={t("salesOpenPipeline")}
          value={formatEUR(openPipeline, true)}
          detail={t("salesActiveOpps").replace(
            "{count}",
            String(
              filteredDeals.filter(
                deal => !["gewonnen", "verloren"].includes(deal.stage),
              ).length,
            ),
          )}
          icon={BriefcaseBusiness}
          color="text-burgundy-300"
        />
        <MetricCard
          label={t("salesWinRate")}
          value={formatPct(
            decided.length > 0 ? wonCount / decided.length : null,
          )}
          detail={t("salesDecidedDeals")
            .replace("{won}", String(wonCount))
            .replace("{total}", String(decided.length))}
          icon={Target}
          color="text-amber-200"
        />
        <MetricCard
          label={t("salesManagementCases")}
          value={String(priorityAccounts.length)}
          detail={t("salesOverdueOpps").replace(
            "{count}",
            String(overdueDeals.length),
          )}
          icon={AlertTriangle}
          color="text-rose-300"
        />
      </div>

      <section aria-labelledby="sales-performance-title">
        <Card className="glass-card border-white/10" padding="none">
          <CardHeader className="pb-2">
            <CardTitle
              id="sales-performance-title"
              className="flex items-center gap-2 text-base text-white"
            >
              <UsersRound className="size-4 text-burgundy-300" />{" "}
              {t("salesPerformance")}
            </CardTitle>
            <p className="text-xs text-white/35">{t("salesPerformanceSub")}</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06]">
                  <TableHead>{t("salesOwner")}</TableHead>
                  <TableHead>{t("salesWon")}</TableHead>
                  <TableHead>{t("salesPipeline")}</TableHead>
                  <TableHead>{t("salesWinRate")}</TableHead>
                  <TableHead>{t("salesCycle")}</TableHead>
                  <TableHead>{t("salesOpportunities")}</TableHead>
                  <TableHead>{t("salesActiveAccounts")}</TableHead>
                  <TableHead>{t("salesMeetings")}</TableHead>
                  <TableHead>{t("salesActivity4w")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ownerSummaries.map(owner => (
                  <TableRow key={owner.owner} className="border-white/[0.05]">
                    <TableCell className="font-medium text-white">
                      {owner.owner}
                    </TableCell>
                    <TableCell className="font-mono text-emerald-300">
                      {formatEUR(owner.wonValueYtd, true)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatEUR(owner.openPipeline, true)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatPct(owner.winRateByCount)}
                    </TableCell>
                    <TableCell>
                      {owner.averageSalesCycleDays === null
                        ? "N/A"
                        : `${owner.averageSalesCycleDays} ${t("salesDays")}`}
                    </TableCell>
                    <TableCell>{owner.opportunitiesCreatedYtd}</TableCell>
                    <TableCell>{owner.activeAccountsYtd}</TableCell>
                    <TableCell>{owner.meetingsYtd}</TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {owner.activitiesLastFourWeeks}
                      </span>
                      <span
                        className={`ml-2 text-[10px] ${(owner.activityChange ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {owner.activityChange === null
                          ? "N/A"
                          : formatPct(owner.activityChange)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section
        className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]"
        aria-labelledby="growth-radar-title"
      >
        <Card className="glass-card border-white/10" padding="none">
          <CardHeader className="pb-2">
            <CardTitle
              id="growth-radar-title"
              className="flex items-center gap-2 text-base text-white"
            >
              <Radar className="size-4 text-sky-300" /> {t("salesGrowthRadar")}
            </CardTitle>
            <p className="text-xs text-white/35">{t("salesGrowthRadarSub")}</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06]">
                  <TableHead>{t("salesPartnerCustomer")}</TableHead>
                  <TableHead>{t("salesOwnerShort")}</TableHead>
                  <TableHead>{t("salesRevenueCy")}</TableHead>
                  <TableHead>{t("salesPotential")}</TableHead>
                  <TableHead>{t("scorecardSow")}</TableHead>
                  <TableHead>{t("salesPipeline")}</TableHead>
                  <TableHead>{t("salesLastActivity")}</TableHead>
                  <TableHead>{t("salesPriority")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountOpportunities.slice(0, 10).map(account => (
                  <TableRow
                    key={account.network}
                    className="border-white/[0.05]"
                  >
                    <TableCell>
                      <div className="font-medium text-white">
                        {account.network}
                      </div>
                      <div className="text-[10px] text-white/35">
                        {account.account}
                      </div>
                    </TableCell>
                    <TableCell>{account.owner ?? "N/A"}</TableCell>
                    <TableCell className="font-mono">
                      {formatEUR(account.revenueCy, true)}
                    </TableCell>
                    <TableCell>{scoreLabel(account.potentialScore)}</TableCell>
                    <TableCell>
                      {scoreLabel(account.shareOfWalletScore)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatEUR(account.openPipeline, true)}
                    </TableCell>
                    <TableCell>
                      {account.lastActivityAt
                        ? new Date(
                            `${account.lastActivityAt}T12:00:00`,
                          ).toLocaleDateString("de-DE")
                        : t("salesNone")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          account.priorityReasons.length >= 3
                            ? "border-rose-500/30 text-rose-300"
                            : account.priorityReasons.length > 0
                              ? "border-amber-500/30 text-amber-200"
                              : "border-emerald-500/30 text-emerald-300"
                        }
                      >
                        {t("salesSignals").replace(
                          "{count}",
                          String(account.priorityReasons.length),
                        )}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10" padding="none">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <BriefcaseBusiness className="size-4 text-burgundy-300" />{" "}
              {t("salesFunnel")}
            </CardTitle>
            <p className="text-xs text-white/35">{t("salesFunnelSub")}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnel.map((stage, index) => {
              const maxValue = Math.max(...funnel.map(item => item.value), 1);
              return (
                <div key={stage.stage}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-white/60">{stage.label}</span>
                    <span className="font-mono text-white">
                      {formatEUR(stage.value, true)} · {stage.count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full ${index < 3 ? "bg-burgundy-500" : stage.stage === "gewonnen" ? "bg-emerald-500" : "bg-white/20"}`}
                      style={{ width: `${(stage.value / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="mt-4 rounded-lg border border-rose-500/15 bg-rose-500/[0.04] p-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-white/55">
                  <CalendarClock className="size-4 text-rose-300" />{" "}
                  {t("salesOverdueLabel")}
                </span>
                <strong className="font-mono text-rose-200">
                  {overdueDeals.length}
                </strong>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="management-actions-title">
        <Card className="glass-card border-white/10" padding="none">
          <CardHeader className="pb-2">
            <CardTitle
              id="management-actions-title"
              className="flex items-center gap-2 text-base text-white"
            >
              <AlertTriangle className="size-4 text-amber-300" />{" "}
              {t("salesActions")}
            </CardTitle>
            <p className="text-xs text-white/35">{t("salesActionsSub")}</p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {priorityAccounts.slice(0, 9).map(account => (
              <article
                key={account.network}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {account.network}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-white/35">
                      {account.owner ?? t("salesNoOwner")} ·{" "}
                      {formatEUR(account.openPipeline, true)}{" "}
                      {t("salesPipeline")}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-amber-500/25 text-amber-200"
                  >
                    {account.priorityReasons.length}
                  </Badge>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {account.priorityReasons.slice(0, 3).map(reason => (
                    <li
                      key={reason}
                      className="flex gap-2 text-[11px] leading-relaxed text-white/55"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-400" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

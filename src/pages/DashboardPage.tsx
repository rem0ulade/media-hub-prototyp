import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  Star,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/config/locale";
import { useBrand } from "@/contexts/BrandContext";
import { useBrandPreset } from "@/contexts/BrandPresetContext";
import { useContracts } from "@/contexts/ContractsContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useScorecards } from "@/contexts/ScorecardsContext";
import { statusConfig } from "@/data/contractData";
import { ratingConfig } from "@/data/scorecardData";
import { formatEUR, formatPct } from "@/lib/formatters";

// ─── Fake monthly YTD data (Jan–Jul) ──────────────────────────────
const monthlyData = [
  { month: "Jan", cy: 1_150_000, py: 1_050_000 },
  { month: "Feb", cy: 1_050_000, py: 950_000 },
  { month: "Mar", cy: 950_000, py: 850_000 },
  { month: "Apr", cy: 1_050_000, py: 950_000 },
  { month: "May", cy: 1_150_000, py: 1_050_000 },
  { month: "Jun", cy: 1_120_000, py: 1_020_000 },
  { month: "Jul", cy: 1_200_000, py: 1_075_000 },
];

const cumulativeData = monthlyData.map((_, i) => ({
  month: monthlyData[i].month,
  cy: monthlyData.slice(0, i + 1).reduce((s, d) => s + d.cy, 0),
  py: monthlyData.slice(0, i + 1).reduce((s, d) => s + d.py, 0),
}));

// ─── Fake weekly ticker (KW 14–30, bis Ende Juli) ───────────────────
type WeekTickerRow = {
  kw: string;
  label: string;
  revenueCY: number;
  revenuePY: number;
  ytdCY: number;
  ytdPY: number;
};

const weeklyTickerData: WeekTickerRow[] = [
  {
    kw: "KW 14",
    label: "30. Mär – 5. Apr",
    revenueCY: 240_000,
    revenuePY: 220_000,
    ytdCY: 3_390_000,
    ytdPY: 3_070_000,
  },
  {
    kw: "KW 15",
    label: "6. – 12. Apr",
    revenueCY: 250_000,
    revenuePY: 230_000,
    ytdCY: 3_640_000,
    ytdPY: 3_300_000,
  },
  {
    kw: "KW 16",
    label: "13. – 19. Apr",
    revenueCY: 260_000,
    revenuePY: 235_000,
    ytdCY: 3_900_000,
    ytdPY: 3_535_000,
  },
  {
    kw: "KW 17",
    label: "20. – 26. Apr",
    revenueCY: 250_000,
    revenuePY: 225_000,
    ytdCY: 4_150_000,
    ytdPY: 3_760_000,
  },
  {
    kw: "KW 18",
    label: "27. Apr – 3. Mai",
    revenueCY: 270_000,
    revenuePY: 245_000,
    ytdCY: 4_420_000,
    ytdPY: 4_005_000,
  },
  {
    kw: "KW 19",
    label: "4. – 10. Mai",
    revenueCY: 280_000,
    revenuePY: 255_000,
    ytdCY: 4_700_000,
    ytdPY: 4_260_000,
  },
  {
    kw: "KW 20",
    label: "11. – 17. Mai",
    revenueCY: 270_000,
    revenuePY: 245_000,
    ytdCY: 4_970_000,
    ytdPY: 4_505_000,
  },
  {
    kw: "KW 21",
    label: "18. – 24. Mai",
    revenueCY: 260_000,
    revenuePY: 235_000,
    ytdCY: 5_230_000,
    ytdPY: 4_740_000,
  },
  {
    kw: "KW 22",
    label: "25. – 31. Mai",
    revenueCY: 250_000,
    revenuePY: 230_000,
    ytdCY: 5_480_000,
    ytdPY: 4_970_000,
  },
  {
    kw: "KW 23",
    label: "1. – 7. Jun",
    revenueCY: 280_000,
    revenuePY: 250_000,
    ytdCY: 5_760_000,
    ytdPY: 5_220_000,
  },
  {
    kw: "KW 24",
    label: "8. – 14. Jun",
    revenueCY: 270_000,
    revenuePY: 245_000,
    ytdCY: 6_030_000,
    ytdPY: 5_465_000,
  },
  {
    kw: "KW 25",
    label: "15. – 21. Jun",
    revenueCY: 260_000,
    revenuePY: 235_000,
    ytdCY: 6_290_000,
    ytdPY: 5_700_000,
  },
  {
    kw: "KW 26",
    label: "22. – 28. Jun",
    revenueCY: 280_000,
    revenuePY: 255_000,
    ytdCY: 6_570_000,
    ytdPY: 5_955_000,
  },
  {
    kw: "KW 27",
    label: "29. Jun – 5. Jul",
    revenueCY: 270_000,
    revenuePY: 245_000,
    ytdCY: 6_840_000,
    ytdPY: 6_200_000,
  },
  {
    kw: "KW 28",
    label: "6. – 12. Jul",
    revenueCY: 280_000,
    revenuePY: 255_000,
    ytdCY: 7_120_000,
    ytdPY: 6_455_000,
  },
  {
    kw: "KW 29",
    label: "13. – 19. Jul",
    revenueCY: 270_000,
    revenuePY: 245_000,
    ytdCY: 7_390_000,
    ytdPY: 6_700_000,
  },
  {
    kw: "KW 30",
    label: "20. – 26. Jul",
    revenueCY: 280_000,
    revenuePY: 245_000,
    ytdCY: 7_670_000,
    ytdPY: 6_945_000,
  },
];

function weekOverWeekChange(
  weeks: WeekTickerRow[],
  index: number,
): number | null {
  if (index <= 0) return null;
  const prev = weeks[index - 1].revenueCY;
  if (prev <= 0) return null;
  return (weeks[index].revenueCY - prev) / prev;
}

function ytdVsPy(ytdCY: number, ytdPY: number): number {
  if (ytdPY <= 0) return 0;
  return (ytdCY - ytdPY) / ytdPY;
}

// ─── Custom tooltip ────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-burgundy-800/40 rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <div className="text-white/60 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
        {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-white/60">{p.name}:</span>
          <span className="text-white font-mono font-semibold">
            {formatEUR(p.value, true)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────
function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  iconColorClass,
}: {
  title: string;
  value: string;
  subtitle: string;
  trend?: "up" | "down";
  trendValue?: string;
  icon: React.ElementType;
  iconColorClass: string;
}) {
  return (
    <Card className="border-burgundy-800/35 bg-burgundy-950/25 backdrop-blur-sm hover:bg-burgundy-950/35 transition-colors">
      <CardContent className="pt-4 pb-3 px-3 sm:pt-5 sm:pb-4 sm:px-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Icon className={`size-4 sm:size-5 shrink-0 ${iconColorClass}`} />
          {trend && trendValue && (
            <div
              className={`flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shrink min-w-0 ${
                trend === "up"
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-rose-400 bg-rose-500/10"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="size-3 shrink-0" />
              ) : (
                <TrendingDown className="size-3 shrink-0" />
              )}
              <span className="truncate">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
          {value}
        </div>
        <div className="text-[10px] sm:text-xs text-white/55 mt-1.5 uppercase tracking-wider font-medium leading-snug">
          {title}
        </div>
        <div className="text-[10px] sm:text-xs text-white/35 mt-0.5 leading-snug">
          {subtitle}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Weekly ticker (Umsatz WoW + vs PY YTD) ───────────────────────
function WeeklyTicker() {
  const latest = weeklyTickerData[weeklyTickerData.length - 1];
  const wow = weekOverWeekChange(weeklyTickerData, weeklyTickerData.length - 1);
  const ytdGap = ytdVsPy(latest.ytdCY, latest.ytdPY);
  const maxWeekRevenue = Math.max(...weeklyTickerData.map(w => w.revenueCY));

  const chartData = weeklyTickerData.map((w, i) => ({
    kw: w.kw.replace("KW ", ""),
    revenueCY: w.revenueCY,
    revenuePY: w.revenuePY,
    wow: weekOverWeekChange(weeklyTickerData, i),
  }));

  return (
    <Card className="border-burgundy-800/25 bg-burgundy-950/12">
      <CardHeader className="pb-2 px-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <CalendarRange className="size-4 text-burgundy-300" />
              Wochenticker — Umsatz &amp; YTD vs. PY
            </CardTitle>
            <p className="text-xs text-white/35 mt-0.5">
              Wöchentliche Nettoumsätze · Veränderung zur Vorwoche · kumuliert
              YTD
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-6 text-xs w-full sm:w-auto">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                Aktuelle KW
              </div>
              <div className="text-base font-bold font-mono text-white">
                {formatEUR(latest.revenueCY, true)}
              </div>
              {wow !== null && (
                <div
                  className={`flex items-center gap-1 font-semibold mt-0.5 ${wow >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {wow >= 0 ? (
                    <TrendingUp className="size-3" />
                  ) : (
                    <TrendingDown className="size-3" />
                  )}
                  {wow >= 0 ? "+" : ""}
                  {(wow * 100).toFixed(1)} % vs. VW
                </div>
              )}
            </div>
            <div className="h-10 w-px bg-white/10 hidden sm:block" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                YTD CY
              </div>
              <div className="text-base font-bold font-mono text-white">
                {formatEUR(latest.ytdCY, true)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                YTD PY
              </div>
              <div className="text-base font-mono text-white/55">
                {formatEUR(latest.ytdPY, true)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                Δ vs. PY YTD
              </div>
              <div
                className={`text-base font-bold font-mono ${ytdGap >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {ytdGap >= 0 ? "+" : ""}
                {(ytdGap * 100).toFixed(1)} %
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-4 space-y-4">
        <ResponsiveContainer width="100%" height={160}>
          <ComposedChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="kw"
              tickFormatter={v => `KW ${v}`}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar
              dataKey="revenuePY"
              name="PY Woche"
              fill="rgba(255,255,255,0.1)"
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="revenueCY"
              name="CY Woche"
              fill="var(--chart-1)"
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
          <div className="flex gap-2 min-w-max xl:min-w-0 xl:grid xl:grid-cols-8">
            {weeklyTickerData.map((w, i) => {
              const wowChg = weekOverWeekChange(weeklyTickerData, i);
              const ytdDelta = ytdVsPy(w.ytdCY, w.ytdPY);
              const barPct =
                maxWeekRevenue > 0 ? (w.revenueCY / maxWeekRevenue) * 100 : 0;
              const isLatest = i === weeklyTickerData.length - 1;
              return (
                <div
                  key={w.kw}
                  className={`snap-start flex flex-col rounded-lg border px-3 py-2.5 min-w-[140px] xl:min-w-0 transition-colors ${
                    isLatest
                      ? "border-burgundy-500/40 bg-burgundy-500/8 ring-1 ring-burgundy-500/20"
                      : "border-burgundy-800/30 bg-burgundy-950/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-white">{w.kw}</span>
                    {isLatest && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 border-burgundy-500/40 text-burgundy-300"
                      >
                        {t("dashCurrentWeek")}
                      </Badge>
                    )}
                  </div>
                  <span className="text-[10px] text-white/35 truncate mb-2">
                    {w.label}
                  </span>
                  <div className="text-sm font-bold font-mono text-white">
                    {formatEUR(w.revenueCY, true)}
                  </div>
                  <div className="h-1.5 mt-2 mb-2 rounded-full bg-white/6 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-burgundy-700 to-burgundy-400"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <div className="space-y-0.5 text-[11px]">
                    {wowChg !== null ? (
                      <div
                        className={`font-semibold font-mono ${wowChg >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        WoW {wowChg >= 0 ? "+" : ""}
                        {(wowChg * 100).toFixed(1)} %
                      </div>
                    ) : (
                      <div className="text-white/30">WoW —</div>
                    )}
                    <div
                      className={`font-mono ${ytdDelta >= 0 ? "text-emerald-400/90" : "text-rose-400/90"}`}
                    >
                      YTD {ytdDelta >= 0 ? "+" : ""}
                      {(ytdDelta * 100).toFixed(1)} % PY
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Monthly Revenue Chart (CY vs PY bars) ────────────────────────
function RevenueChart() {
  return (
    <Card className="border-burgundy-800/25 bg-burgundy-950/12 col-span-1 lg:col-span-2">
      <CardHeader className="pb-2 px-4 sm:px-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="size-4 text-burgundy-300" />
            {t("dashRevenueChart")}
          </CardTitle>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-white/50">
              <span className="w-3 h-3 rounded-sm bg-burgundy-500 inline-block" />
              CY 2026
            </span>
            <span className="flex items-center gap-1.5 text-white/35">
              <span className="w-3 h-3 rounded-sm bg-white/20 inline-block" />
              PY 2025
            </span>
          </div>
        </div>
        <p className="text-xs text-white/35 mt-0.5">
          {t("dashRevenueChartSub")}
        </p>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart
            data={monthlyData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => `${(v / 1000000).toFixed(1)}M`}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar
              dataKey="py"
              name="PY 2025"
              fill="rgba(255,255,255,0.12)"
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="cy"
              name="CY 2026"
              fill="var(--chart-1)"
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ─── Cumulative YTD area chart ─────────────────────────────────────
function CumulativeChart() {
  const ytdCY = cumulativeData[cumulativeData.length - 1].cy;
  const ytdPY = cumulativeData[cumulativeData.length - 1].py;
  const gap = ((ytdCY - ytdPY) / ytdPY) * 100;

  return (
    <Card className="border-burgundy-800/25 bg-burgundy-950/12">
      <CardHeader className="pb-1 px-4 sm:px-5">
        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
          <TrendingUp className="size-4 text-burgundy-300" />
          {t("dashCumulativeYtd")}
        </CardTitle>
        <div className="flex items-center gap-3 mt-1">
          <div>
            <div className="text-lg font-bold text-white font-mono">
              {formatEUR(ytdCY, true)}
            </div>
            <div className="text-xs text-white/40 uppercase tracking-wider">
              CY 2026
            </div>
          </div>
          <div
            className={`text-sm font-semibold font-mono px-2 py-0.5 rounded ${gap >= 0 ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"}`}
          >
            {gap >= 0 ? "+" : ""}
            {gap.toFixed(1)}%
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm font-mono text-white/45">
              {formatEUR(ytdPY, true)}
            </div>
            <div className="text-xs text-white/30 uppercase tracking-wider">
              PY 2025
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-4 pt-2">
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart
            data={cumulativeData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradCY" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="gradPY" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => `${(v / 1000000).toFixed(1)}M`}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="py"
              name="PY 2025"
              stroke="rgba(255,255,255,0.2)"
              fill="url(#gradPY)"
              strokeWidth={1.5}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="cy"
              name="CY 2026"
              stroke="var(--chart-1)"
              fill="url(#gradCY)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-1)", r: 3, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ─── Network Mix donut ─────────────────────────────────────────────
const NETWORK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
];

function NetworkMixChart() {
  const { networkClassicData } = useDashboardData();
  const top6 = [...networkClassicData]
    .sort((a, b) => b.io.nnCY - a.io.nnCY)
    .slice(0, 6);
  const total = top6.reduce((s, n) => s + n.io.nnCY, 0);
  const data = top6.map(n => ({ name: n.network, value: n.io.nnCY }));

  return (
    <Card className="border-burgundy-800/25 bg-burgundy-950/12">
      <CardHeader className="pb-1 px-4 sm:px-5">
        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
          <BarChart3 className="size-4 text-burgundy-300" />
          {t("dashRevenueMix")}
        </CardTitle>
        <p className="text-xs text-white/35 mt-0.5">{t("dashShareOfNn")}</p>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={34}
                  outerRadius={54}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={NETWORK_COLORS[i % NETWORK_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5 min-w-0">
            {data.map((d, i) => {
              const pct = total > 0 ? (d.value / total) * 100 : 0;
              return (
                <div key={d.name} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: NETWORK_COLORS[i % NETWORK_COLORS.length],
                    }}
                  />
                  <span className="text-xs text-white/65 truncate flex-1">
                    {d.name}
                  </span>
                  <span className="text-xs font-mono text-white/80 shrink-0">
                    {pct.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Top Networks bar list ─────────────────────────────────────────
function TopNetworksOverview() {
  const { networkClassicData } = useDashboardData();
  const navigate = useNavigate();
  const { to } = useBrandPreset();
  const sorted = [...networkClassicData]
    .sort((a, b) => b.io.nnCY - a.io.nnCY)
    .slice(0, 5);

  return (
    <Card className="border-burgundy-800/25 bg-burgundy-950/12">
      <CardHeader className="pb-2 px-4 sm:px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 className="size-4 text-burgundy-300" />
            {t("dashTopNetworks")}
          </CardTitle>
          <button
            onClick={() => navigate(to("/networks"))}
            className="text-xs text-burgundy-300/65 hover:text-burgundy-300 flex items-center gap-1 transition-colors"
          >
            {t("dashViewAll")} <ArrowRight className="size-3" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-4">
        <div className="space-y-3">
          {sorted.map((n, i) => {
            const maxNN = sorted[0].io.nnCY;
            const pct = maxNN > 0 ? (n.io.nnCY / maxNN) * 100 : 0;
            const nnChange =
              n.io.nnPY > 0 ? (n.io.nnCY - n.io.nnPY) / n.io.nnPY : 0;
            return (
              <div key={n.network} className="flex items-center gap-3">
                <span className="text-xs text-white/30 font-mono w-4">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white truncate">
                      {n.network}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono text-white/70">
                        {formatEUR(n.io.nnCY, true)}
                      </span>
                      <span
                        className={`text-xs font-mono font-semibold ${nnChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {nnChange >= 0 ? "+" : ""}
                        {(nnChange * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div
                    className="h-2 bg-white/6 rounded-full overflow-hidden"
                    style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-burgundy-700 to-burgundy-400 transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        boxShadow: "0 0 6px rgba(59,130,246,0.35)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Pacing ───────────────────────────────────────────────────────
function PacingSummary() {
  const { tradingIOData } = useDashboardData();
  const navigate = useNavigate();
  const { to } = useBrandPreset();
  const withPacing = tradingIOData.filter(d => d.pacing.pacingNN !== null);

  return (
    <Card className="border-burgundy-800/25 bg-burgundy-950/12">
      <CardHeader className="pb-2 px-4 sm:px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="size-4 text-emerald-400/65" />
            {t("dashPacingOverview")}
          </CardTitle>
          <button
            onClick={() => navigate(to("/networks"))}
            className="text-xs text-burgundy-300/65 hover:text-burgundy-300 flex items-center gap-1 transition-colors"
          >
            {t("dashDetails")} <ArrowRight className="size-3" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-4">
        <div className="space-y-3">
          {withPacing.map(n => {
            const pacing = n.pacing.pacingNN ?? 0;
            const isOver = pacing > 1;
            const isLow = pacing < 0.3;
            return (
              <div key={n.network} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-white w-28 truncate">
                  {n.network}
                </span>
                <div className="flex-1 relative">
                  <div
                    className="h-2 bg-white/6 rounded-full overflow-hidden"
                    style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isOver ? "bg-emerald-500" : isLow ? "bg-amber-500" : "bg-burgundy-500"}`}
                      style={{
                        width: `${Math.min(pacing * 100, 100)}%`,
                        boxShadow: isOver
                          ? "0 0 6px rgba(52,211,153,0.4)"
                          : isLow
                            ? "0 0 6px rgba(251,191,36,0.35)"
                            : "0 0 6px rgba(59,130,246,0.35)",
                      }}
                    />
                  </div>
                  <div
                    className="absolute top-0 bottom-0 w-px bg-white/20"
                    style={{ left: "100%" }}
                  />
                </div>
                <span
                  className={`text-xs font-mono font-semibold w-14 text-right ${isOver ? "text-emerald-400" : isLow ? "text-amber-400" : "text-burgundy-300"}`}
                >
                  {formatPct(pacing)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Scorecard summary ─────────────────────────────────────────────
function ScoreCardSummary() {
  const navigate = useNavigate();
  const { to } = useBrandPreset();
  const { scorecards } = useScorecards();
  const sorted = [...scorecards]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5);

  return (
    <Card className="border-burgundy-800/25 bg-burgundy-950/12">
      <CardHeader className="pb-2 px-4 sm:px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="size-4 text-burgundy-300" />
            {t("dashPartnerScorecard")}
          </CardTitle>
          <button
            onClick={() => navigate(to("/scorecard"))}
            className="text-xs text-burgundy-300/65 hover:text-burgundy-300 flex items-center gap-1 transition-colors"
          >
            {t("dashAllScores")} <ArrowRight className="size-3" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-4">
        <div className="space-y-2.5">
          {sorted.map(sc => {
            const cfg = ratingConfig[sc.overallRating];
            return (
              <div key={sc.network} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-white w-28 truncate">
                  {sc.network}
                </span>
                <div className="flex-1">
                  <div
                    className="h-2 bg-white/6 rounded-full overflow-hidden"
                    style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        sc.overallScore >= 75
                          ? "bg-emerald-500"
                          : sc.overallScore >= 55
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      }`}
                      style={{
                        width: `${sc.overallScore}%`,
                        boxShadow:
                          sc.overallScore >= 75
                            ? "0 0 6px rgba(52,211,153,0.4)"
                            : sc.overallScore >= 55
                              ? "0 0 6px rgba(251,191,36,0.35)"
                              : "0 0 6px rgba(239,68,68,0.35)",
                      }}
                    />
                  </div>
                </div>
                <span
                  className={`text-xs font-mono font-semibold w-10 text-right ${cfg.color}`}
                >
                  {sc.overallScore}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Contract Alerts ───────────────────────────────────────────────
function ContractAlerts() {
  const navigate = useNavigate();
  const { to } = useBrandPreset();
  const { contracts } = useContracts();
  const alerts = contracts.filter(
    c =>
      c.status === "verhandlung" ||
      c.status === "abgelaufen" ||
      c.status === "entwurf",
  );

  return (
    <Card className="border-burgundy-800/25 bg-burgundy-950/12">
      <CardHeader className="pb-2 px-4 sm:px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-400/65" />
            {t("dashContractAlerts")}
          </CardTitle>
          <button
            onClick={() => navigate(to("/contracts"))}
            className="text-xs text-burgundy-300/65 hover:text-burgundy-300 flex items-center gap-1 transition-colors"
          >
            {t("dashAllContracts")} <ArrowRight className="size-3" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-4">
        <div className="space-y-2.5">
          {alerts.map(c => {
            const cfg = statusConfig[c.status];
            return (
              <div
                key={c.id}
                className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${cfg.bg}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-white truncate">
                      {c.network}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${cfg.color} border-current/30 px-1.5 py-0`}
                    >
                      {cfg.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/50 truncate">{c.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ──────────────────────────────────────────────────────────
export function DashboardPage() {
  const { totals } = useDashboardData();
  const { brand } = useBrand();
  const nnYoY =
    totals.classic.nnPY > 0
      ? (totals.classic.nnCY - totals.classic.nnPY) / totals.classic.nnPY
      : 0;
  const tradingPacingUp = totals.tradingIO.pacingNN >= 1;

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {t("managementSummary")}
        </h1>
        <p className="text-xs text-white/40 mt-0.5">
          {brand.companyName} &middot; {brand.platformLabel}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t("dashKpiNetNet")}
          value={formatEUR(totals.classic.nnCY, true)}
          subtitle={t("dashKpiNetNetSub")}
          trend={nnYoY >= 0 ? "up" : "down"}
          trendValue={`${(nnYoY * 100).toFixed(1)} % ${t("dashVsPy")}`}
          icon={BarChart3}
          iconColorClass="text-burgundy-400"
        />
        <KPICard
          title={t("dashKpiTrading")}
          value={formatEUR(totals.tradingIO.istNN, true)}
          subtitle={t("dashKpiTradingSub").replace(
            "{plan}",
            formatEUR(totals.tradingIO.planNN, true),
          )}
          trend={tradingPacingUp ? "up" : "down"}
          trendValue={`${formatPct(totals.tradingIO.pacingNN)} ${t("dashPacing")}`}
          icon={tradingPacingUp ? TrendingUp : TrendingDown}
          iconColorClass={
            tradingPacingUp ? "text-emerald-400" : "text-rose-400"
          }
        />
        <KPICard
          title={t("dashKpiRemuneration")}
          value={formatEUR(totals.vergütung.vergütung, true)}
          subtitle={t("dashKpiRemunerationSub").replace(
            "{nn}",
            formatEUR(totals.vergütung.nnCY, true),
          )}
          icon={Wallet}
          iconColorClass="text-emerald-400"
        />
        <KPICard
          title={t("dashKpiAddedValue")}
          value={formatEUR(totals.addedValue.avSumme, true)}
          subtitle={t("dashKpiAddedValueSub")
            .replace("{events}", formatEUR(totals.addedValue.avEvents))
            .replace("{research}", formatEUR(totals.addedValue.avMaFo))}
          icon={Star}
          iconColorClass="text-amber-400"
        />
      </div>

      {/* Weekly ticker */}
      <WeeklyTicker />

      {/* Revenue Charts row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <RevenueChart />
        <CumulativeChart />
      </div>

      {/* Mix + Pacing row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <NetworkMixChart />
        <div className="lg:col-span-2">
          <TopNetworksOverview />
        </div>
      </div>

      {/* Scorecard + Pacing + Alerts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <PacingSummary />
        <ScoreCardSummary />
        <ContractAlerts />
      </div>
    </div>
  );
}

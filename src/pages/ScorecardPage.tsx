import {
  Award,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { t } from "@/config/locale";
import { useScorecards } from "@/contexts/ScorecardsContext";
import { type NetworkScorecard, ratingConfig } from "@/data/scorecardData";
import { formatPct } from "@/lib/formatters";

function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#34d399" : score >= 55 ? "#fbbf24" : "#f43f5e";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
        aria-hidden="true"
      >
        <title>Score</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold font-mono text-white">{score}</span>
      </div>
    </div>
  );
}

function ScorecardCard({
  scorecard,
  expanded,
  onToggle,
}: {
  scorecard: NetworkScorecard;
  expanded: boolean;
  onToggle: () => void;
}) {
  const cfg = ratingConfig[scorecard.overallRating];
  const TrendIcon =
    scorecard.trend === "up"
      ? TrendingUp
      : scorecard.trend === "down"
        ? TrendingDown
        : Minus;
  const trendColor =
    scorecard.trend === "up"
      ? "text-emerald-400"
      : scorecard.trend === "down"
        ? "text-rose-400"
        : "text-white/35";

  return (
    <Card
      className={`border-burgundy-800/25 bg-burgundy-950/15 transition-all ${
        expanded ? "ring-1 ring-burgundy-700/35" : ""
      }`}
    >
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full text-left px-4 sm:px-5 py-4 flex items-center gap-4"
        >
          <ScoreRing score={scorecard.overallScore} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-semibold text-white">
                {scorecard.network}
              </span>
              <Badge
                variant="outline"
                className={`text-[9px] px-1.5 py-0 ${cfg.color} border-current/30`}
              >
                {cfg.label}
              </Badge>
              <TrendIcon className={`size-3.5 ${trendColor}`} />
            </div>
            <p className="text-[11px] text-white/55 mb-1">
              {t("scorecardPartnerYearsValue").replace(
                "{years}",
                String(scorecard.partnerYears),
              )}
              {" · "}
              {t("scorecardSow")} {formatPct(scorecard.sowCY)}
              {" · "}
              {scorecard.contractStatus === "review"
                ? t("scorecardStatusReview")
                : t("scorecardStatusActive")}
            </p>
            <p className="text-[11px] text-white/45 truncate">
              {scorecard.highlight}
            </p>
          </div>
          <div className="shrink-0">
            {expanded ? (
              <ChevronUp className="size-4 text-white/35" />
            ) : (
              <ChevronDown className="size-4 text-white/35" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="px-4 sm:px-5 pb-5 border-t border-burgundy-800/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <div className="rounded-lg border border-burgundy-800/30 bg-burgundy-950/25 p-3 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                  {t("scorecardPartnerYears")}
                </div>
                <div className="flex items-end justify-between gap-2">
                  <span className="text-lg font-bold font-mono text-white">
                    {t("scorecardPartnerYearsValue").replace(
                      "{years}",
                      String(scorecard.partnerYears),
                    )}
                  </span>
                  <span className="text-xs text-white/50">
                    {scorecard.contractStatus === "review"
                      ? t("scorecardStatusReview")
                      : t("scorecardStatusActive")}
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-burgundy-800/30 bg-burgundy-950/25 p-3 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                  {t("scorecardSow")}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-white/35">
                      {t("scorecardSowPy")}
                    </div>
                    <div className="text-sm font-mono text-white/80">
                      {formatPct(scorecard.sowPY)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/35">
                      {t("scorecardSowCy")}
                    </div>
                    <div className="text-sm font-mono font-semibold text-white">
                      {formatPct(scorecard.sowCY)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/35">
                      {t("scorecardSowDelta")}
                    </div>
                    <div
                      className={`text-sm font-mono font-semibold ${
                        scorecard.sowCY - scorecard.sowPY >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {scorecard.sowCY - scorecard.sowPY >= 0 ? "+" : ""}
                      {formatPct(scorecard.sowCY - scorecard.sowPY)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 pt-4">
              {scorecard.categories.map(cat => {
                const catCfg = ratingConfig[cat.rating];
                return (
                  <div key={cat.category} className="flex items-center gap-3">
                    <div className="w-36 sm:w-44 shrink-0">
                      <div className="text-xs font-medium text-white/65">
                        {cat.category}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-white/7 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            cat.score >= 75
                              ? "bg-emerald-500"
                              : cat.score >= 55
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>
                    <span
                      className={`text-xs font-mono font-semibold w-8 text-right ${catCfg.color}`}
                    >
                      {cat.score}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Category details */}
            <div className="mt-4 pt-3 border-t border-burgundy-800/15 space-y-2">
              {scorecard.categories.map(cat => (
                <div key={cat.category} className="flex gap-2 items-start">
                  <span className="text-[10px] text-white/35 w-32 sm:w-40 shrink-0 uppercase tracking-wider pt-0.5">
                    {cat.category}
                  </span>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    {cat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RankingOverview({ scorecards }: { scorecards: NetworkScorecard[] }) {
  const sorted = [...scorecards].sort(
    (a, b) => b.overallScore - a.overallScore,
  );
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card className="border-emerald-800/25 bg-emerald-950/12">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="size-4 text-emerald-400" />
            <span className="text-[10px] text-emerald-400/65 uppercase tracking-wider font-semibold">
              {t("scorecardTopPerformer")}
            </span>
          </div>
          <div className="text-base font-bold text-white">{top.network}</div>
          <div className="text-xs text-emerald-400 font-mono mt-0.5">
            Score: {top.overallScore}
          </div>
        </CardContent>
      </Card>
      <Card className="border-burgundy-800/25 bg-burgundy-950/15">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardCheck className="size-4 text-burgundy-300" />
            <span className="text-[10px] text-burgundy-300/65 uppercase tracking-wider font-semibold">
              {t("scorecardAvgScore")}
            </span>
          </div>
          <div className="text-base font-bold text-white font-mono">
            {Math.round(
              scorecards.reduce((s, n) => s + n.overallScore, 0) /
                scorecards.length,
            )}
          </div>
          <div className="text-xs text-white/40 mt-0.5">
            {t("scorecardPartnersEvaluated").replace(
              "{count}",
              String(scorecards.length),
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="border-rose-800/25 bg-rose-950/12">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="size-4 text-rose-400" />
            <span className="text-[10px] text-rose-400/65 uppercase tracking-wider font-semibold">
              {t("scorecardNeedsAttention")}
            </span>
          </div>
          <div className="text-base font-bold text-white">{bottom.network}</div>
          <div className="text-xs text-rose-400 font-mono mt-0.5">
            Score: {bottom.overallScore}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ScorecardPage() {
  const { scorecards } = useScorecards();
  const [expandedNetwork, setExpandedNetwork] = useState<string | null>(null);
  const sorted = [...scorecards].sort(
    (a, b) => b.overallScore - a.overallScore,
  );

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ClipboardCheck className="size-5 text-burgundy-300" />
          {t("scorecardTitle")}
        </h1>
        <p className="text-xs text-white/40 mt-0.5">{t("scorecardSubtitle")}</p>
      </div>

      <RankingOverview scorecards={scorecards} />

      {/* Score Legend */}
      <div className="flex items-center gap-4 flex-wrap text-[10px]">
        <span className="text-white/35 uppercase tracking-wider font-semibold">
          {t("scorecardLegend")}
        </span>
        {Object.values(ratingConfig).map(r => (
          <span
            key={r.label}
            className={`${r.color} flex items-center gap-1.5`}
          >
            <span className="font-mono bg-white/8 px-1 rounded text-[9px]">
              {r.icon}
            </span>
            {r.label}
          </span>
        ))}
      </div>

      {/* Scorecard List */}
      <div className="space-y-3">
        {sorted.map(sc => (
          <ScorecardCard
            key={sc.network}
            scorecard={sc}
            expanded={expandedNetwork === sc.network}
            onToggle={() =>
              setExpandedNetwork(
                expandedNetwork === sc.network ? null : sc.network,
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

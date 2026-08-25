import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { t } from "@/config/locale";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import type { TradingData } from "@/data/networkData";
import { formatEUR, formatPct } from "@/lib/formatters";

function PacingBar({ value, label }: { value: number | null; label: string }) {
  if (value === null)
    return <span className="text-xs text-muted-foreground">–</span>;
  const isOver = value > 1;
  const isLow = value < 0.3;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white/60 uppercase tracking-wider">
          {label}
        </span>
        <span
          className={`text-xs font-mono font-semibold ${isOver ? "text-emerald-400" : isLow ? "text-amber-400" : "text-burgundy-300"}`}
        >
          {formatPct(value)}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isOver ? "bg-emerald-500" : isLow ? "bg-amber-500" : "bg-burgundy-500"}`}
          style={{ width: `${Math.min(value * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 py-3 mb-4 bg-background/90 backdrop-blur-sm border-b border-burgundy-800/20">
      <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-white/50 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

function ClassicCardView() {
  const { networkClassicData, totals } = useDashboardData();
  return (
    <div className="grid gap-3 p-3">
      {networkClassicData.map(row => {
        const nnChange =
          row.io.nnPY > 0 ? (row.io.nnCY - row.io.nnPY) / row.io.nnPY : 0;
        return (
          <div
            key={row.network}
            className="rounded-lg border border-burgundy-800/30 bg-burgundy-950/20 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-white text-sm">
                {row.network}
              </span>
              <span
                className={`text-sm font-mono font-semibold ${nnChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {nnChange >= 0 ? "+" : ""}
                {(nnChange * 100).toFixed(1)} %
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div>
                <span className="text-white/50 uppercase text-[10px] tracking-wider">
                  {t("labelNetPy")}
                </span>
                <div className="font-mono text-white/80 mt-0.5">
                  {formatEUR(row.io.nnPY)}
                </div>
              </div>
              <div>
                <span className="text-white/50 uppercase text-[10px] tracking-wider">
                  {t("labelNetCy")}
                </span>
                <div className="font-mono text-white font-semibold mt-0.5">
                  {formatEUR(row.io.nnCY)}
                </div>
              </div>
              <div>
                <span className="text-white/50 uppercase text-[10px] tracking-wider">
                  {t("labelGrossPy")}
                </span>
                <div className="font-mono text-white/60 mt-0.5">
                  {formatEUR(row.io.mb3PY)}
                </div>
              </div>
              <div>
                <span className="text-white/50 uppercase text-[10px] tracking-wider">
                  {t("labelGrossCy")}
                </span>
                <div className="font-mono text-white/70 mt-0.5">
                  {formatEUR(row.io.mb3CY)}
                </div>
              </div>
              <div>
                <span className="text-white/50 uppercase text-[10px] tracking-wider">
                  {t("labelMarginPy")}
                </span>
                <div className="font-mono text-burgundy-300 mt-0.5">
                  {formatPct(row.io.pfPY)}
                </div>
              </div>
              <div>
                <span className="text-white/50 uppercase text-[10px] tracking-wider">
                  {t("labelMarginCy")}
                </span>
                <div className="font-mono text-burgundy-300 mt-0.5">
                  {formatPct(row.io.pfCY)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="rounded-lg border-2 border-burgundy-700/40 bg-burgundy-950/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-white text-sm">Gesamt</span>
          <span className="text-sm font-mono font-semibold text-rose-400">
            {totals.classic.nnPY > 0
              ? (
                  ((totals.classic.nnCY - totals.classic.nnPY) /
                    totals.classic.nnPY) *
                  100
                ).toFixed(1)
              : "0.0"}{" "}
            %
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div>
            <span className="text-white/50 uppercase text-[10px] tracking-wider">
              {t("labelNetPy")}
            </span>
            <div className="font-mono text-white/80 mt-0.5">
              {formatEUR(totals.classic.nnPY)}
            </div>
          </div>
          <div>
            <span className="text-white/50 uppercase text-[10px] tracking-wider">
              {t("labelNetCy")}
            </span>
            <div className="font-mono text-white font-bold mt-0.5">
              {formatEUR(totals.classic.nnCY)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassicTable() {
  const { networkClassicData, totals } = useDashboardData();
  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-burgundy-800/40">
              <th className="text-left py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold w-[140px]">
                {t("labelPartner")}
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelGrossPy")}
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelNetPy")}
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-burgundy-300 font-semibold">
                {t("labelMarginPy")}
              </th>
              <th className="text-center py-3 px-1 text-white/30">
                <ArrowRight className="size-3 inline" />
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelGrossCy")}
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelNetCy")}
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-burgundy-300 font-semibold">
                {t("labelMarginCy")}
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelDeltaNet")}
              </th>
            </tr>
          </thead>
          <tbody>
            {networkClassicData.map((row, i) => {
              const nnChange =
                row.io.nnPY > 0 ? (row.io.nnCY - row.io.nnPY) / row.io.nnPY : 0;
              return (
                <tr
                  key={row.network}
                  className={`border-b border-white/[0.04] hover:bg-burgundy-950/40 transition-colors ${i % 2 === 0 ? "bg-burgundy-950/15" : ""}`}
                >
                  <td className="py-2.5 px-3 font-semibold text-white text-[13px]">
                    {row.network}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-white/60 text-xs">
                    {formatEUR(row.io.mb3PY)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-white/80 text-xs">
                    {formatEUR(row.io.nnPY)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-burgundy-300/80 text-xs">
                    {formatPct(row.io.pfPY)}
                  </td>
                  <td className="py-2.5 px-1 text-center text-burgundy-700/50">
                    →
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-white/60 text-xs">
                    {formatEUR(row.io.mb3CY)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-white font-semibold text-xs">
                    {formatEUR(row.io.nnCY)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-burgundy-300/80 text-xs">
                    {formatPct(row.io.pfCY)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-mono text-xs font-semibold ${nnChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {nnChange >= 0 ? "+" : ""}
                    {(nnChange * 100).toFixed(1)} %
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-burgundy-700/40 bg-burgundy-950/40 font-semibold">
              <td className="py-3 px-3 text-white text-[13px]">Gesamt</td>
              <td className="py-3 px-3 text-right font-mono text-white/70 text-xs">
                {formatEUR(totals.classic.mb3PY)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-white/90 text-xs">
                {formatEUR(totals.classic.nnPY)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-burgundy-300 text-xs">
                {formatPct(totals.classic.pfPY)}
              </td>
              <td className="py-3 px-1 text-center text-burgundy-700/50">→</td>
              <td className="py-3 px-3 text-right font-mono text-white/70 text-xs">
                {formatEUR(totals.classic.mb3CY)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-white text-xs">
                {formatEUR(totals.classic.nnCY)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-burgundy-300 text-xs">
                {formatPct(totals.classic.pfCY)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-rose-400 text-xs">
                {totals.classic.nnPY > 0
                  ? (
                      ((totals.classic.nnCY - totals.classic.nnPY) /
                        totals.classic.nnPY) *
                      100
                    ).toFixed(1)
                  : "0.0"}{" "}
                %
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="md:hidden">
        <ClassicCardView />
      </div>
    </>
  );
}

function TradingCardView({ data }: { data: TradingData[] }) {
  return (
    <div className="grid gap-3 p-3">
      {data.map(row => (
        <div
          key={row.network}
          className="rounded-lg border border-burgundy-800/30 bg-burgundy-950/20 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-white text-sm">
              {row.network}
            </span>
            {row.pacing.pacingMB3 !== null && (
              <span
                className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded ${
                  row.pacing.pacingMB3 > 1
                    ? "bg-emerald-500/20 text-emerald-400"
                    : row.pacing.pacingMB3 < 0.3
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-burgundy-500/20 text-burgundy-300"
                }`}
              >
                {formatPct(row.pacing.pacingMB3)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="text-white/50 uppercase text-[10px] tracking-wider">
                Tranche PY ({t("labelNet")})
              </span>
              <div className="font-mono text-white/70 mt-0.5">
                {row.tranchen.nnPYTr !== null
                  ? formatEUR(row.tranchen.nnPYTr)
                  : "–"}
              </div>
            </div>
            <div>
              <span className="text-white/50 uppercase text-[10px] tracking-wider">
                Tranche CY ({t("labelNet")})
              </span>
              <div className="font-mono text-white/80 mt-0.5">
                {row.tranchen.nnTrCY !== null
                  ? formatEUR(row.tranchen.nnTrCY)
                  : "–"}
              </div>
            </div>
            <div>
              <span className="text-white/50 uppercase text-[10px] tracking-wider">
                Plan {t("labelNet")}
              </span>
              <div className="font-mono text-burgundy-200/70 mt-0.5">
                {row.planIst.planNN !== null
                  ? formatEUR(row.planIst.planNN)
                  : "–"}
              </div>
            </div>
            <div>
              <span className="text-white/50 uppercase text-[10px] tracking-wider">
                IST {t("labelNet")}
              </span>
              <div className="font-mono text-emerald-300/80 mt-0.5">
                {row.planIst.istNN !== null
                  ? formatEUR(row.planIst.istNN)
                  : "–"}
              </div>
            </div>
          </div>
          {(row.pacing.pacingMB3 !== null || row.pacing.pacingNN !== null) && (
            <div className="mt-3 pt-3 border-t border-burgundy-800/20 space-y-2">
              <PacingBar
                value={row.pacing.pacingMB3}
                label={t("labelGrossPacing")}
              />
              <PacingBar
                value={row.pacing.pacingNN}
                label={`${t("labelNet")}-Pacing`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TradingTable({ data }: { data: TradingData[] }) {
  return (
    <>
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-burgundy-800/40">
              <th className="text-left py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold w-[120px]">
                {t("labelPartner")}
              </th>
              <th
                colSpan={3}
                className="text-center py-2 px-2 text-[10px] uppercase tracking-wider text-burgundy-300/70 font-semibold border-b border-burgundy-800/25"
              >
                Tranchen PY
              </th>
              <th
                colSpan={3}
                className="text-center py-2 px-2 text-[10px] uppercase tracking-wider text-burgundy-200/80 font-semibold border-b border-burgundy-800/25"
              >
                Tranchen CY
              </th>
              <th
                colSpan={2}
                className="text-center py-2 px-2 text-[10px] uppercase tracking-wider text-burgundy-200/70 font-semibold border-b border-burgundy-800/20"
              >
                Plan
              </th>
              <th
                colSpan={2}
                className="text-center py-2 px-2 text-[10px] uppercase tracking-wider text-emerald-300/80 font-semibold border-b border-emerald-800/20"
              >
                IST
              </th>
              <th
                colSpan={2}
                className="text-center py-2 px-2 text-[10px] uppercase tracking-wider text-amber-300/80 font-semibold border-b border-amber-800/20"
              >
                Pacing
              </th>
            </tr>
            <tr className="border-b border-white/[0.06]">
              <th />
              <th className="text-right py-1.5 px-2 text-[9px] text-white/45 font-normal">
                {t("labelGross")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-white/45 font-normal">
                {t("labelNet")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-burgundy-300/50 font-normal">
                {t("labelMargin")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-white/45 font-normal">
                {t("labelGross")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-white/45 font-normal">
                {t("labelNet")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-burgundy-300/50 font-normal">
                {t("labelMargin")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-white/45 font-normal">
                {t("labelGross")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-white/45 font-normal">
                {t("labelNet")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-white/45 font-normal">
                {t("labelGross")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-white/45 font-normal">
                {t("labelNet")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-white/45 font-normal">
                {t("labelGross")}
              </th>
              <th className="text-right py-1.5 px-2 text-[9px] text-white/45 font-normal">
                {t("labelNet")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.network}
                className={`border-b border-white/[0.04] hover:bg-burgundy-950/40 transition-colors ${i % 2 === 0 ? "bg-burgundy-950/15" : ""}`}
              >
                <td className="py-2.5 px-3 font-semibold text-white text-[13px]">
                  {row.network}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-white/55 text-[11px]">
                  {formatEUR(row.tranchen.mb3PYTr)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-white/75 text-[11px]">
                  {formatEUR(row.tranchen.nnPYTr)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-burgundy-300/65 text-[11px]">
                  {formatPct(row.tranchen.pfPYTr)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-white/55 text-[11px]">
                  {formatEUR(row.tranchen.mb3TrCY)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-white/75 text-[11px]">
                  {formatEUR(row.tranchen.nnTrCY)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-burgundy-300/65 text-[11px]">
                  {formatPct(row.tranchen.pfTrCY)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-burgundy-200/60 text-[11px]">
                  {formatEUR(row.planIst.planMB3)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-burgundy-200/75 text-[11px]">
                  {formatEUR(row.planIst.planNN)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-emerald-300/70 text-[11px]">
                  {formatEUR(row.planIst.istMB3)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-emerald-300/80 text-[11px]">
                  {formatEUR(row.planIst.istNN)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-[11px]">
                  <span
                    className={
                      row.pacing.pacingMB3 === null
                        ? "text-white/30"
                        : row.pacing.pacingMB3 > 1
                          ? "text-emerald-400"
                          : row.pacing.pacingMB3 < 0.3
                            ? "text-amber-400"
                            : "text-burgundy-300"
                    }
                  >
                    {formatPct(row.pacing.pacingMB3)}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-[11px]">
                  <span
                    className={
                      row.pacing.pacingNN === null
                        ? "text-white/30"
                        : row.pacing.pacingNN > 1
                          ? "text-emerald-400"
                          : row.pacing.pacingNN < 0.3
                            ? "text-amber-400"
                            : "text-burgundy-300"
                    }
                  >
                    {formatPct(row.pacing.pacingNN)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden">
        <TradingCardView data={data} />
      </div>
    </>
  );
}

function VergütungTable() {
  const { vergütungData, totals } = useDashboardData();
  const active = vergütungData.filter(v => v.nnCY > 0 || v.vergütung > 0);
  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-burgundy-800/40">
              <th className="text-left py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelPartner")}
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelNetCy")}
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelFee")}
              </th>
              <th className="text-left py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold hidden sm:table-cell">
                {t("labelFeeType")}
              </th>
            </tr>
          </thead>
          <tbody>
            {active.map((row, i) => (
              <tr
                key={row.network}
                className={`border-b border-white/[0.04] hover:bg-burgundy-950/40 transition-colors ${i % 2 === 0 ? "bg-burgundy-950/15" : ""}`}
              >
                <td className="py-2.5 px-3 font-semibold text-white text-[13px]">
                  {row.network}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-white/75 text-xs">
                  {formatEUR(row.nnCY)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-400 text-xs font-semibold">
                  {row.vergütung > 0 ? formatEUR(row.vergütung) : "–"}
                </td>
                <td className="py-2.5 px-3 text-white/55 text-xs hidden sm:table-cell">
                  {row.vergütungsart}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-burgundy-700/40 bg-burgundy-950/40 font-semibold">
              <td className="py-3 px-3 text-white text-[13px]">Gesamt</td>
              <td className="py-3 px-3 text-right font-mono text-white/90 text-xs">
                {formatEUR(totals.vergütung.nnCY)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-emerald-400 text-xs">
                {formatEUR(totals.vergütung.vergütung)}
              </td>
              <td className="hidden sm:table-cell" />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="md:hidden p-3 space-y-3">
        {active.map(row => (
          <div
            key={row.network}
            className="rounded-lg border border-burgundy-800/30 bg-burgundy-950/20 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white text-sm">
                {row.network}
              </span>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                {row.vergütung > 0 ? formatEUR(row.vergütung) : "–"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">{t("labelNetCy")}</span>
              <span className="font-mono text-white/70">
                {formatEUR(row.nnCY)}
              </span>
            </div>
            {row.vergütungsart && row.vergütungsart !== "–" && (
              <div className="text-xs text-white/45 mt-1.5">
                {row.vergütungsart}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function AddedValueTable() {
  const { addedValueData, totals } = useDashboardData();
  const active = addedValueData.filter(v => v.avSumme > 0);
  return (
    <>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-burgundy-800/40">
              <th className="text-left py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelPartner")}
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelEvents")} €
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelPromotion")} €
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelResearch")} €
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {t("labelOther")} €
              </th>
              <th className="text-right py-3 px-3 text-[10px] uppercase tracking-wider text-white/70 font-bold">
                {t("labelSum")} €
              </th>
            </tr>
          </thead>
          <tbody>
            {active.map((row, i) => (
              <tr
                key={row.network}
                className={`border-b border-white/[0.04] hover:bg-burgundy-950/40 transition-colors ${i % 2 === 0 ? "bg-burgundy-950/15" : ""}`}
              >
                <td className="py-2.5 px-3 font-semibold text-white text-[13px]">
                  {row.network}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-white/65 text-xs">
                  {row.avEvents > 0 ? formatEUR(row.avEvents) : "–"}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-white/65 text-xs">
                  {row.avProduktproben > 0
                    ? formatEUR(row.avProduktproben)
                    : "–"}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-white/65 text-xs">
                  {row.avMaFo > 0 ? formatEUR(row.avMaFo) : "–"}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-white/65 text-xs">
                  {row.avSonstiges > 0 ? formatEUR(row.avSonstiges) : "–"}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-white font-semibold text-xs">
                  {formatEUR(row.avSumme)}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-burgundy-700/40 bg-burgundy-950/40 font-semibold">
              <td className="py-3 px-3 text-white text-[13px]">Gesamt</td>
              <td className="py-3 px-3 text-right font-mono text-white/75 text-xs">
                {formatEUR(totals.addedValue.avEvents)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-white/75 text-xs">
                {formatEUR(totals.addedValue.avProduktproben)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-white/75 text-xs">
                {formatEUR(totals.addedValue.avMaFo)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-white/75 text-xs">
                {formatEUR(totals.addedValue.avSonstiges)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-white text-xs">
                {formatEUR(totals.addedValue.avSumme)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sm:hidden p-3 space-y-3">
        {active.map(row => (
          <div
            key={row.network}
            className="rounded-lg border border-burgundy-800/30 bg-burgundy-950/20 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white text-sm">
                {row.network}
              </span>
              <span className="font-mono text-white font-bold text-sm">
                {formatEUR(row.avSumme)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {row.avEvents > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/50">{t("labelEvents")}</span>
                  <span className="font-mono text-white/70">
                    {formatEUR(row.avEvents)}
                  </span>
                </div>
              )}
              {row.avProduktproben > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/50">{t("labelPromotion")}</span>
                  <span className="font-mono text-white/70">
                    {formatEUR(row.avProduktproben)}
                  </span>
                </div>
              )}
              {row.avMaFo > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/50">{t("labelResearch")}</span>
                  <span className="font-mono text-white/70">
                    {formatEUR(row.avMaFo)}
                  </span>
                </div>
              )}
              {row.avSonstiges > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/50">{t("labelOther")}</span>
                  <span className="font-mono text-white/70">
                    {formatEUR(row.avSonstiges)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function PacingOverview() {
  const { tradingIOData } = useDashboardData();
  const networks = tradingIOData.filter(
    d => d.pacing.pacingMB3 !== null || d.pacing.pacingNN !== null,
  );
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {networks.map(n => (
        <div
          key={n.network}
          className="rounded-lg border border-burgundy-800/35 bg-burgundy-950/25 p-4"
        >
          <div className="text-sm font-semibold text-white mb-3">
            {n.network}
          </div>
          <div className="space-y-3">
            <PacingBar value={n.pacing.pacingMB3} label={t("labelGross")} />
            <PacingBar value={n.pacing.pacingNN} label={t("labelNet")} />
          </div>
          <div className="mt-3 pt-2.5 border-t border-burgundy-800/25 flex justify-between text-[11px] text-white/50">
            <span>Plan: {formatEUR(n.planIst.planNN, true)}</span>
            <span>IST: {formatEUR(n.planIst.istNN, true)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesSection() {
  const { networkNotes } = useDashboardData();
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? networkNotes : networkNotes.slice(0, 3);
  return (
    <div className="space-y-2">
      {shown.map(n => (
        <div
          key={n.network}
          className="flex gap-3 items-start rounded-lg border border-burgundy-800/30 bg-burgundy-950/20 p-3 sm:p-4"
        >
          <Badge
            variant="outline"
            className="mt-0.5 shrink-0 text-[10px] border-burgundy-600/40 text-burgundy-300"
          >
            {n.network}
          </Badge>
          <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
            {n.note}
          </p>
        </div>
      ))}
      {networkNotes.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-white/50 hover:text-burgundy-300 transition-colors py-1"
        >
          {expanded ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
          {expanded
            ? t("networksShowLess")
            : t("networksShowMore").replace(
                "{count}",
                String(networkNotes.length - 3),
              )}
        </button>
      )}
    </div>
  );
}

export function NetworksPage() {
  const { tradingIOData, tradingPCData } = useDashboardData();

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {t("networksTitle")}
        </h1>
        <p className="text-xs text-white/45 mt-0.5">{t("networksSubtitle")}</p>
      </div>

      {/* ── Klassische Umsätze ── */}
      <div>
        <SectionHeader
          title={t("networksClassicTitle")}
          subtitle={t("networksClassicSub")}
        />
        <Card className="border-burgundy-800/30 bg-burgundy-950/15">
          <CardContent className="p-0">
            <ClassicTable />
          </CardContent>
        </Card>
      </div>

      {/* ── Trading ── */}
      <div>
        <SectionHeader
          title={t("networksTradingTitle")}
          subtitle={t("networksTradingSub")}
        />
        <Tabs defaultValue="online" className="w-full">
          <div className="-mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 pb-3">
            <TabsList className="bg-burgundy-950/40 border border-burgundy-800/35">
              <TabsTrigger
                value="online"
                className="text-xs data-[state=active]:bg-burgundy-800/50 data-[state=active]:text-burgundy-100"
              >
                Online Trading
              </TabsTrigger>
              <TabsTrigger
                value="offline"
                className="text-xs data-[state=active]:bg-burgundy-800/50 data-[state=active]:text-burgundy-100"
              >
                Offline Trading
              </TabsTrigger>
              <TabsTrigger
                value="pacing"
                className="text-xs data-[state=active]:bg-burgundy-800/50 data-[state=active]:text-burgundy-100"
              >
                Pacing Übersicht
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="online">
            <Card className="border-burgundy-800/30 bg-burgundy-950/15">
              <CardContent className="p-0">
                <TradingTable data={tradingIOData} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="offline">
            <Card className="border-burgundy-800/30 bg-burgundy-950/15">
              <CardContent className="p-0">
                <TradingTable data={tradingPCData} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pacing">
            <PacingOverview />
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Partner-Fee & Zusatzleistungen ── */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div>
          <SectionHeader
            title={t("networksFeeTitle")}
            subtitle={t("networksFeeSub")}
          />
          <Card className="border-burgundy-800/30 bg-burgundy-950/15">
            <CardContent className="p-0">
              <VergütungTable />
            </CardContent>
          </Card>
        </div>
        <div>
          <SectionHeader
            title={t("networksExtrasTitle")}
            subtitle={t("networksExtrasSub")}
          />
          <Card className="border-burgundy-800/30 bg-burgundy-950/15">
            <CardContent className="p-0">
              <AddedValueTable />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Notes ── */}
      <div>
        <SectionHeader
          title={t("networksNotes")}
          subtitle={t("networksNotesSub")}
        />
        <NotesSection />
      </div>
    </div>
  );
}

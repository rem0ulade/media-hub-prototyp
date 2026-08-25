import type { Contract } from "@/data/contractData";
import type { NetworkClassic } from "@/data/networkData";
import type {
  AccountSalesOpportunity,
  CrmActivity,
  CrmDeal,
  CrmDealStage,
  SalesOwnerSummary,
} from "@/data/salesData";
import type { NetworkScorecard } from "@/data/scorecardData";

const DAY_MS = 86_400_000;
const OPEN_STAGES: CrmDealStage[] = [
  "qualifizierung",
  "angebot",
  "verhandlung",
];

export const dealStageLabels: Record<CrmDealStage, string> = {
  qualifizierung: "Qualifizierung",
  angebot: "Angebot",
  verhandlung: "Verhandlung",
  gewonnen: "Gewonnen",
  verloren: "Verloren",
};

function timestamp(value: string): number {
  return new Date(`${value}T12:00:00`).getTime();
}

function daysBetween(from: string, to: string): number {
  return Math.max(0, Math.round((timestamp(to) - timestamp(from)) / DAY_MS));
}

function inRange(value: string, start: number, end: number): boolean {
  const date = timestamp(value);
  return date >= start && date <= end;
}

function ratioChange(current: number, previous: number): number | null {
  return previous > 0 ? current / previous - 1 : current > 0 ? 1 : null;
}

export function getSalesReferenceDate(
  deals: CrmDeal[],
  activities: CrmActivity[],
): Date {
  const dates = [
    ...deals.flatMap(deal =>
      [deal.createdAt, deal.closedAt, deal.lastActivityAt].filter(
        (date): date is string => Boolean(date),
      ),
    ),
    ...activities.map(activity => activity.occurredAt),
  ];
  const latest = Math.max(...dates.map(timestamp));
  return Number.isFinite(latest) ? new Date(latest) : new Date();
}

export interface SalesManagementSummary {
  wonValueYtd: number;
  newPipelineLastFourWeeks: number;
  winRateByCount: number | null;
  winRateByValue: number | null;
  activeOpportunities: number;
  highPotentialWithoutOpportunity: number;
  inactiveRevenueAccounts: number;
  pipelineChange: number | null;
}

export function calculateSalesManagementSummary(
  deals: CrmDeal[],
  activities: CrmActivity[],
  scorecards: NetworkScorecard[],
  networkData: NetworkClassic[],
): SalesManagementSummary {
  const reference = getSalesReferenceDate(deals, activities);
  const referenceTime = reference.getTime();
  const yearStart = new Date(reference.getFullYear(), 0, 1).getTime();
  const currentStart = referenceTime - 27 * DAY_MS;
  const previousStart = referenceTime - 55 * DAY_MS;
  const closedYtd = deals.filter(
    deal => deal.closedAt && inRange(deal.closedAt, yearStart, referenceTime),
  );
  const won = closedYtd.filter(deal => deal.stage === "gewonnen");
  const decided = closedYtd.filter(
    deal => deal.stage === "gewonnen" || deal.stage === "verloren",
  );
  const wonValue = won.reduce((sum, deal) => sum + deal.value, 0);
  const decidedValue = decided.reduce((sum, deal) => sum + deal.value, 0);
  const currentPipeline = deals
    .filter(deal => inRange(deal.createdAt, currentStart, referenceTime))
    .reduce((sum, deal) => sum + deal.value, 0);
  const previousPipeline = deals
    .filter(deal => inRange(deal.createdAt, previousStart, currentStart - 1))
    .reduce((sum, deal) => sum + deal.value, 0);
  const openNetworks = new Set(
    deals
      .filter(deal => OPEN_STAGES.includes(deal.stage))
      .map(deal => deal.network),
  );
  const highPotentialWithoutOpportunity = scorecards.filter(
    scorecard =>
      scorecard.overallScore >= 70 && !openNetworks.has(scorecard.network),
  ).length;
  const revenueThreshold =
    [...networkData]
      .map(row => row.io.nnCY + row.programmatic.nnCY)
      .sort((a, b) => a - b)[Math.floor(networkData.length / 2)] ?? 0;
  const latestActivityByNetwork = new Map<string, number>();
  for (const activity of activities) {
    latestActivityByNetwork.set(
      activity.network,
      Math.max(
        latestActivityByNetwork.get(activity.network) ?? 0,
        timestamp(activity.occurredAt),
      ),
    );
  }
  const inactiveRevenueAccounts = networkData.filter(row => {
    const revenue = row.io.nnCY + row.programmatic.nnCY;
    const lastActivity = latestActivityByNetwork.get(row.network);
    return (
      revenue >= revenueThreshold &&
      (!lastActivity || referenceTime - lastActivity > 30 * DAY_MS)
    );
  }).length;

  return {
    wonValueYtd: wonValue,
    newPipelineLastFourWeeks: currentPipeline,
    winRateByCount: decided.length > 0 ? won.length / decided.length : null,
    winRateByValue: decidedValue > 0 ? wonValue / decidedValue : null,
    activeOpportunities: deals.filter(deal => OPEN_STAGES.includes(deal.stage))
      .length,
    highPotentialWithoutOpportunity,
    inactiveRevenueAccounts,
    pipelineChange: ratioChange(currentPipeline, previousPipeline),
  };
}

export function calculateOwnerSummaries(
  deals: CrmDeal[],
  activities: CrmActivity[],
): SalesOwnerSummary[] {
  const reference = getSalesReferenceDate(deals, activities);
  const referenceTime = reference.getTime();
  const yearStart = new Date(reference.getFullYear(), 0, 1).getTime();
  const currentStart = referenceTime - 27 * DAY_MS;
  const previousStart = referenceTime - 55 * DAY_MS;
  const owners = Array.from(
    new Set([
      ...deals.map(deal => deal.owner),
      ...activities.map(activity => activity.owner),
    ]),
  );

  return owners
    .map(owner => {
      const ownerDeals = deals.filter(deal => deal.owner === owner);
      const ownerActivities = activities.filter(
        activity => activity.owner === owner,
      );
      const closed = ownerDeals.filter(
        deal =>
          deal.closedAt && inRange(deal.closedAt, yearStart, referenceTime),
      );
      const won = closed.filter(deal => deal.stage === "gewonnen");
      const decided = closed.filter(
        deal => deal.stage === "gewonnen" || deal.stage === "verloren",
      );
      const wonValue = won.reduce((sum, deal) => sum + deal.value, 0);
      const decidedValue = decided.reduce((sum, deal) => sum + deal.value, 0);
      const cycles = decided.flatMap(deal =>
        deal.closedAt ? [daysBetween(deal.createdAt, deal.closedAt)] : [],
      );
      const currentActivities = ownerActivities.filter(activity =>
        inRange(activity.occurredAt, currentStart, referenceTime),
      ).length;
      const previousActivities = ownerActivities.filter(activity =>
        inRange(activity.occurredAt, previousStart, currentStart - 1),
      ).length;

      return {
        owner,
        wonValueYtd: wonValue,
        openPipeline: ownerDeals
          .filter(deal => OPEN_STAGES.includes(deal.stage))
          .reduce((sum, deal) => sum + deal.value, 0),
        winRateByCount: decided.length > 0 ? won.length / decided.length : null,
        winRateByValue: decidedValue > 0 ? wonValue / decidedValue : null,
        averageSalesCycleDays:
          cycles.length > 0
            ? Math.round(
                cycles.reduce((sum, days) => sum + days, 0) / cycles.length,
              )
            : null,
        opportunitiesCreatedYtd: ownerDeals.filter(deal =>
          inRange(deal.createdAt, yearStart, referenceTime),
        ).length,
        activeAccountsYtd: new Set(
          ownerActivities
            .filter(activity =>
              inRange(activity.occurredAt, yearStart, referenceTime),
            )
            .map(activity => activity.account),
        ).size,
        meetingsYtd: ownerActivities.filter(
          activity =>
            activity.type === "meeting" &&
            inRange(activity.occurredAt, yearStart, referenceTime),
        ).length,
        activitiesLastFourWeeks: currentActivities,
        activityChange: ratioChange(currentActivities, previousActivities),
      };
    })
    .sort(
      (a, b) =>
        b.wonValueYtd - a.wonValueYtd || b.openPipeline - a.openPipeline,
    );
}

function categoryScore(scorecard: NetworkScorecard | undefined, name: string) {
  return (
    scorecard?.categories.find(category => category.category === name)?.score ??
    null
  );
}

function potentialScore(scorecard: NetworkScorecard | undefined) {
  return (
    categoryScore(scorecard, "Potenzial") ??
    categoryScore(scorecard, "Umsatzentwicklung") ??
    scorecard?.overallScore ??
    null
  );
}

function shareOfWalletScore(scorecard: NetworkScorecard | undefined) {
  const category = categoryScore(scorecard, "Share of Wallet");
  if (category !== null) return category;
  if (scorecard?.sowCY == null) return null;
  return Math.round(scorecard.sowCY * 100);
}

function profitabilityScore(scorecard: NetworkScorecard | undefined) {
  return (
    categoryScore(scorecard, "Profitabilität") ??
    categoryScore(scorecard, "Marge") ??
    null
  );
}

export function calculateAccountOpportunities(
  networkData: NetworkClassic[],
  scorecards: NetworkScorecard[],
  contracts: Contract[],
  deals: CrmDeal[],
  activities: CrmActivity[],
): AccountSalesOpportunity[] {
  const reference = getSalesReferenceDate(deals, activities);
  const referenceDate = reference.toISOString().slice(0, 10);

  return networkData
    .filter(row => row.network.toLocaleLowerCase("de-DE") !== "sonstige")
    .map(row => {
      const networkDeals = deals.filter(deal => deal.network === row.network);
      const openDeals = networkDeals.filter(deal =>
        OPEN_STAGES.includes(deal.stage),
      );
      const networkActivities = activities
        .filter(activity => activity.network === row.network)
        .sort((a, b) => timestamp(b.occurredAt) - timestamp(a.occurredAt));
      const lastActivityAt = networkActivities[0]?.occurredAt ?? null;
      const scorecard = scorecards.find(item => item.network === row.network);
      const contract = contracts
        .filter(item => item.network === row.network)
        .sort((a, b) => b.endDate.localeCompare(a.endDate))[0];
      const revenueCy = row.io.nnCY + row.programmatic.nnCY;
      const revenuePy = row.io.nnPY + row.programmatic.nnPY;
      const potential = potentialScore(scorecard);
      const sowScore = shareOfWalletScore(scorecard);
      const profitScore = profitabilityScore(scorecard);
      const inactivityDays = lastActivityAt
        ? daysBetween(lastActivityAt, referenceDate)
        : null;
      const reasons: string[] = [];
      if ((potential ?? 0) >= 70 && openDeals.length === 0)
        reasons.push("Hohes Potenzial ohne offenen Deal");
      if (sowScore !== null && sowScore < 55)
        reasons.push("Niedriger Share of Wallet");
      if (revenuePy > 0 && revenueCy < revenuePy * 0.8)
        reasons.push("Umsatz deutlich unter Vorjahr");
      if (inactivityDays === null || inactivityDays > 45)
        reasons.push(
          inactivityDays === null
            ? "Keine CRM-Aktivität"
            : `Seit ${inactivityDays} Tagen ohne Aktivität`,
        );
      if (contract && contract.endDate <= referenceDate)
        reasons.push("Vertrag abgelaufen");
      if (
        openDeals.some(
          deal => timestamp(deal.expectedCloseAt) < reference.getTime(),
        )
      )
        reasons.push("Opportunity überfällig");
      if (openDeals.some(deal => !deal.nextStep))
        reasons.push("Nächster Schritt fehlt");

      return {
        account: networkDeals[0]?.account ?? row.network,
        network: row.network,
        owner:
          networkDeals[0]?.owner ??
          networkActivities[0]?.owner ??
          contract?.responsible ??
          null,
        revenueCy,
        revenuePy,
        potentialScore: potential,
        profitabilityScore: profitScore,
        shareOfWalletScore: sowScore,
        contractStatus: contract?.status ?? null,
        contractEndDate: contract?.endDate ?? null,
        openPipeline: openDeals.reduce((sum, deal) => sum + deal.value, 0),
        openDeals: openDeals.length,
        lastActivityAt,
        inactivityDays,
        priorityReasons: reasons,
      };
    })
    .sort(
      (a, b) =>
        b.priorityReasons.length - a.priorityReasons.length ||
        (b.potentialScore ?? 0) - (a.potentialScore ?? 0),
    );
}

export function calculateFunnel(deals: CrmDeal[]) {
  return (Object.keys(dealStageLabels) as CrmDealStage[]).map(stage => {
    const rows = deals.filter(deal => deal.stage === stage);
    return {
      stage,
      label: dealStageLabels[stage],
      count: rows.length,
      value: rows.reduce((sum, deal) => sum + deal.value, 0),
    };
  });
}

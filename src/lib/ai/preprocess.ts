import type { CanonicalMatch, MatchStats } from "@/types/match";

/**
 * Wordalisation-inspired preprocessing.
 * Converts raw numeric stats into categorical labels so the LLM
 * reasons about meaning rather than parsing decimals.
 *
 * Based on: "Automated Explanation of Machine Learning Models of
 * Footballing Actions in Words" — map numeric values to percentile
 * categories before sending to the LLM.
 */

// --- xG Interpretation ---

type XgVerdict = {
  label: string;
  description: string;
};

function classifyXgPerformance(
  xg: number,
  actual: number
): XgVerdict {
  const diff = actual - xg;
  const ratio = xg > 0 ? actual / xg : actual > 0 ? Infinity : 1;

  if (diff >= 2)
    return { label: "massively overperformed", description: `scored ${actual} from ${xg.toFixed(1)} xG — clinical finishing or lucky breaks` };
  if (diff >= 1)
    return { label: "overperformed", description: `scored ${actual} from ${xg.toFixed(1)} xG — took their chances well` };
  if (diff >= 0.3)
    return { label: "slightly overperformed", description: `scored ${actual} from ${xg.toFixed(1)} xG — marginally efficient` };
  if (diff > -0.3)
    return { label: "performed as expected", description: `scored ${actual} from ${xg.toFixed(1)} xG — finishing matched chance quality` };
  if (diff > -1)
    return { label: "slightly underperformed", description: `scored ${actual} from ${xg.toFixed(1)} xG — missed some good chances` };
  if (diff > -2)
    return { label: "underperformed", description: `scored ${actual} from ${xg.toFixed(1)} xG — wasteful in front of goal` };
  return { label: "massively underperformed", description: `scored ${actual} from ${xg.toFixed(1)} xG — significant missed opportunities` };
}

function classifyXgChanceQuality(xg: number): string {
  if (xg < 0.03) return "slim chance";
  if (xg < 0.10) return "decent chance";
  if (xg < 0.20) return "good chance";
  if (xg < 0.30) return "very good chance";
  return "excellent chance";
}

// --- Possession Interpretation ---

function classifyPossessionDominance(home: number, away: number): string {
  const diff = home - away;
  if (Math.abs(diff) < 5) return "evenly shared possession";
  if (diff >= 15) return "home team dominated possession heavily";
  if (diff >= 5) return "home team had the majority of possession";
  if (diff <= -15) return "away team dominated possession heavily";
  return "away team had the majority of possession";
}

// --- Shot Efficiency ---

function classifyShotEfficiency(
  shots: number | null,
  onTarget: number | null
): string | null {
  if (shots == null || onTarget == null || shots === 0) return null;
  const ratio = onTarget / shots;
  if (ratio >= 0.6) return "highly accurate shooting";
  if (ratio >= 0.4) return "decent shot accuracy";
  if (ratio >= 0.2) return "low shot accuracy";
  return "very wasteful shooting";
}

// --- xG Difference (match control metric) ---

function classifyXgBalance(
  xgHome: number,
  xgAway: number
): string {
  const diff = xgHome - xgAway;
  if (Math.abs(diff) < 0.3) return "evenly matched in chance quality";
  if (diff >= 1.5) return "home team created far superior chances";
  if (diff >= 0.3) return "home team created better chances overall";
  if (diff <= -1.5) return "away team created far superior chances";
  return "away team created better chances overall";
}

// --- Main preprocessing function ---

export type PreprocessedContext = {
  xgAnalysis: string | null;
  possessionAnalysis: string | null;
  shotEfficiency: { home: string | null; away: string | null };
  matchControlVerdict: string | null;
  dataCompleteness: string[];
};

export function preprocessMatchStats(
  match: CanonicalMatch
): PreprocessedContext {
  const { stats } = match;
  const { homeScore, awayScore, homeTeam, awayTeam } = match.match;
  const caveats: string[] = [];

  // xG analysis
  let xgAnalysis: string | null = null;
  if (stats.xgHome != null && stats.xgAway != null) {
    const homeVerdict = classifyXgPerformance(stats.xgHome, homeScore);
    const awayVerdict = classifyXgPerformance(stats.xgAway, awayScore);
    const balance = classifyXgBalance(stats.xgHome, stats.xgAway);
    xgAnalysis = [
      `${homeTeam}: ${homeVerdict.description} (${homeVerdict.label})`,
      `${awayTeam}: ${awayVerdict.description} (${awayVerdict.label})`,
      `Overall chance quality: ${balance}`,
    ].join(". ");
  } else {
    caveats.push("xG data unavailable — analysis based on shots and events only");
  }

  // Possession
  let possessionAnalysis: string | null = null;
  if (stats.possessionHome != null && stats.possessionAway != null) {
    possessionAnalysis = classifyPossessionDominance(
      stats.possessionHome,
      stats.possessionAway
    );
  } else {
    caveats.push("Possession data unavailable");
  }

  // Shot efficiency
  const homeShotEff = classifyShotEfficiency(
    stats.shotsHome,
    stats.shotsOnTargetHome
  );
  const awayShotEff = classifyShotEfficiency(
    stats.shotsAway,
    stats.shotsOnTargetAway
  );

  // Match control
  let matchControlVerdict: string | null = null;
  if (stats.xgHome != null && stats.xgAway != null) {
    matchControlVerdict = classifyXgBalance(stats.xgHome, stats.xgAway);
  }

  // Event data completeness
  if (match.events.length < 3) {
    caveats.push("Limited event data — only major incidents recorded");
  }

  return {
    xgAnalysis,
    possessionAnalysis,
    shotEfficiency: { home: homeShotEff, away: awayShotEff },
    matchControlVerdict,
    dataCompleteness: caveats,
  };
}

/**
 * Classify individual event xG for key moment descriptions.
 * Use when event-level xG data is available (future enhancement).
 */
export { classifyXgChanceQuality };

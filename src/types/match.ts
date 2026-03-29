export type MatchStatus = "scheduled" | "live" | "halftime" | "finished";

export type MatchSummary = {
  id: string;
  competition: string;
  status: MatchStatus;
  kickoffAt: string | null;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
};

export type MatchStats = {
  possessionHome: number | null;
  possessionAway: number | null;
  shotsHome: number | null;
  shotsAway: number | null;
  shotsOnTargetHome: number | null;
  shotsOnTargetAway: number | null;
  xgHome: number | null;
  xgAway: number | null;
};

export type MatchEvent = {
  minute: number;
  team: string;
  type: string;
  player?: string | null;
  description: string;
};

export type CanonicalMatch = {
  match: MatchSummary;
  stats: MatchStats;
  events: MatchEvent[];
};

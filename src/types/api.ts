import type { MatchSummary, CanonicalMatch } from "./match";
import type { Analysis } from "./analysis";

// API response envelopes

export type ApiResponse<T> = {
  data: T;
};

export type ApiError = {
  error: {
    message: string;
    code: string;
  };
};

// Route-specific response types

export type MatchListResponse = ApiResponse<{ matches: MatchSummary[] }>;
export type MatchDetailResponse = ApiResponse<{ match: CanonicalMatch }>;
export type AnalyzeResponse = ApiResponse<{ analysis: Analysis }>;
export type AnalysisDetailResponse = ApiResponse<{ analysis: Analysis }>;

export type SavedMoment = {
  id: string;
  analysisId: string;
  momentIndex: number;
  note: string | null;
  createdAt: string;
  // Hydrated fields from joins
  matchId?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
};

export type SavedMomentsListResponse = ApiResponse<{ moments: SavedMoment[] }>;

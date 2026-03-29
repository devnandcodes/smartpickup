import { z } from "zod";
import { AnalysisResultSchema } from "@/lib/ai/schema";

export type AudienceLevel = "beginner" | "advanced";
export type AnalysisMode = "post_match" | "live_snapshot" | "halftime";

export type AnalysisRequest = {
  matchId: string;
  audienceLevel: AudienceLevel;
  mode: AnalysisMode;
};

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export type Analysis = {
  id: string;
  matchId: string;
  userId: string;
  audienceLevel: AudienceLevel;
  mode: AnalysisMode;
  headline: string;
  result: AnalysisResult;
  model: string;
  createdAt: string;
};

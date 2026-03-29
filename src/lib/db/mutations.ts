import type { SupabaseClient } from "@supabase/supabase-js";
import type { CanonicalMatch } from "@/types/match";
import type { AnalysisResult } from "@/lib/ai/schema";

export async function upsertMatch(
  supabase: SupabaseClient,
  match: CanonicalMatch,
  rawProviderData?: unknown
) {
  const { error } = await supabase.from("matches").upsert({
    id: match.match.id,
    competition: match.match.competition,
    status: match.match.status,
    kickoff_at: match.match.kickoffAt,
    home_team: match.match.homeTeam,
    away_team: match.match.awayTeam,
    home_score: match.match.homeScore,
    away_score: match.match.awayScore,
    stats: match.stats,
    events: match.events,
    raw_provider_data: rawProviderData ?? null,
    cached_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function insertAnalysis(
  supabase: SupabaseClient,
  params: {
    matchId: string;
    userId: string;
    audienceLevel: string;
    mode: string;
    result: AnalysisResult;
    headline: string;
    promptTokens: number;
    completionTokens: number;
    model: string;
  }
) {
  const { data, error } = await supabase
    .from("analyses")
    .insert({
      match_id: params.matchId,
      user_id: params.userId,
      audience_level: params.audienceLevel,
      mode: params.mode,
      result: params.result,
      headline: params.headline,
      prompt_tokens: params.promptTokens,
      completion_tokens: params.completionTokens,
      model: params.model,
    })
    .select("id, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function insertSavedMoment(
  supabase: SupabaseClient,
  params: {
    userId: string;
    analysisId: string;
    momentIndex: number;
    note?: string;
  }
) {
  const { data, error } = await supabase
    .from("saved_moments")
    .insert({
      user_id: params.userId,
      analysis_id: params.analysisId,
      moment_index: params.momentIndex,
      note: params.note ?? null,
    })
    .select("id, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSavedMoment(
  supabase: SupabaseClient,
  momentId: string
) {
  const { error } = await supabase
    .from("saved_moments")
    .delete()
    .eq("id", momentId);

  if (error) throw error;
}

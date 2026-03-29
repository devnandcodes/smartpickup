import type { SupabaseClient } from "@supabase/supabase-js";

export async function getMatchById(supabase: SupabaseClient, matchId: string) {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
  return data;
}

export async function getMatchesByDate(
  supabase: SupabaseClient,
  date?: string,
  competition?: string
) {
  let query = supabase
    .from("matches")
    .select("id, competition, status, kickoff_at, home_team, away_team, home_score, away_score")
    .order("kickoff_at", { ascending: false })
    .limit(50);

  if (date) {
    query = query
      .gte("kickoff_at", `${date}T00:00:00Z`)
      .lt("kickoff_at", `${date}T23:59:59Z`);
  }

  if (competition) {
    query = query.eq("competition", competition);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getAnalysisById(
  supabase: SupabaseClient,
  analysisId: string
) {
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function getCachedAnalysis(
  supabase: SupabaseClient,
  matchId: string,
  userId: string,
  audienceLevel: string,
  mode: string
) {
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("match_id", matchId)
    .eq("user_id", userId)
    .eq("audience_level", audienceLevel)
    .eq("mode", mode)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function getSavedMoments(
  supabase: SupabaseClient,
  userId: string,
  limit = 20,
  offset = 0
) {
  const { data, error } = await supabase
    .from("saved_moments")
    .select(
      `
      id, analysis_id, moment_index, note, created_at,
      analyses (
        match_id, result,
        matches ( home_team, away_team, home_score, away_score )
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data ?? [];
}

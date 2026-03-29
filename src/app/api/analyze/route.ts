import { NextRequest } from "next/server";
import { z } from "zod";
import { createSportsProvider } from "@/lib/sports/provider";
import { analyzeMatch } from "@/lib/ai/analyze-match";
import { handleApiError, NotFoundError, AppError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth/session";
import { getCachedAnalysis } from "@/lib/db/queries";
import { insertAnalysis, upsertMatch } from "@/lib/db/mutations";

const AnalyzeRequestSchema = z.object({
  matchId: z.string().min(1),
  audienceLevel: z.enum(["beginner", "advanced"]),
  mode: z.enum(["post_match", "live_snapshot", "halftime"]),
});

export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth();

    const body = await request.json();
    const parsed = AnalyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError("Invalid request body", "VALIDATION_ERROR", 422);
    }

    const { matchId, audienceLevel, mode } = parsed.data;

    // Check for cached analysis
    const cached = await getCachedAnalysis(
      supabase,
      matchId,
      user.id,
      audienceLevel,
      mode
    );

    if (cached) {
      return Response.json({
        data: {
          analysis: {
            id: cached.id,
            matchId: cached.match_id,
            userId: cached.user_id,
            audienceLevel: cached.audience_level,
            mode: cached.mode,
            headline: cached.headline,
            result: cached.result,
            model: cached.model,
            createdAt: cached.created_at,
          },
        },
      });
    }

    // Fetch match data
    const provider = createSportsProvider();
    const matchData = await provider.getMatch(matchId);
    if (!matchData) {
      throw new NotFoundError(`Match ${matchId} not found`);
    }

    if (matchData.match.status === "scheduled") {
      throw new AppError(
        "Cannot analyze a match that hasn't started",
        "MATCH_NOT_STARTED",
        422
      );
    }

    // Run AI analysis
    const { result, promptTokens, completionTokens } = await analyzeMatch(
      matchData,
      audienceLevel,
      mode
    );

    // Persist match data (upsert via admin client for RLS bypass)
    // For MVP, we use the user's client — matches table has no insert policy for users,
    // so we skip this step and rely on mock data being in-memory.
    // TODO: Use admin client when integrating real provider

    // Persist analysis
    const inserted = await insertAnalysis(supabase, {
      matchId,
      userId: user.id,
      audienceLevel,
      mode,
      result,
      headline: result.headline,
      promptTokens,
      completionTokens,
      model: "gpt-4o-mini",
    });

    return Response.json({
      data: {
        analysis: {
          id: inserted.id,
          matchId,
          userId: user.id,
          audienceLevel,
          mode,
          headline: result.headline,
          result,
          model: "gpt-4o-mini",
          createdAt: inserted.created_at,
        },
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

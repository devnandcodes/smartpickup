import { NextRequest } from "next/server";
import { handleApiError, NotFoundError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth/session";
import { getAnalysisById } from "@/lib/db/queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> }
) {
  try {
    const { analysisId } = await params;
    const { supabase } = await requireAuth();

    const data = await getAnalysisById(supabase, analysisId);
    if (!data) {
      throw new NotFoundError(`Analysis ${analysisId} not found`);
    }

    return Response.json({
      data: {
        analysis: {
          id: data.id,
          matchId: data.match_id,
          userId: data.user_id,
          audienceLevel: data.audience_level,
          mode: data.mode,
          headline: data.headline,
          result: data.result,
          model: data.model,
          createdAt: data.created_at,
        },
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { createSportsProvider } from "@/lib/sports/provider";
import { handleApiError, NotFoundError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params;
    const provider = createSportsProvider();
    const match = await provider.getMatch(matchId);

    if (!match) {
      throw new NotFoundError(`Match ${matchId} not found`);
    }

    return Response.json({ data: { match } });
  } catch (error) {
    return handleApiError(error);
  }
}

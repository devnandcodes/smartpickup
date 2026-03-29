import { NextRequest } from "next/server";
import { createSportsProvider } from "@/lib/sports/provider";
import { handleApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date") ?? undefined;
    const competition = searchParams.get("competition") ?? undefined;

    const provider = createSportsProvider();
    const matches = await provider.getMatchList(date, competition);

    return Response.json({ data: { matches } });
  } catch (error) {
    return handleApiError(error);
  }
}

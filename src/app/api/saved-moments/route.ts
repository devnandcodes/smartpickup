import { NextRequest } from "next/server";
import { z } from "zod";
import { handleApiError, AppError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth/session";
import { getSavedMoments } from "@/lib/db/queries";
import { insertSavedMoment, deleteSavedMoment } from "@/lib/db/mutations";

export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const moments = await getSavedMoments(supabase, user.id, limit, offset);

    return Response.json({ data: { moments } });
  } catch (error) {
    return handleApiError(error);
  }
}

const SaveMomentSchema = z.object({
  analysisId: z.string().uuid(),
  momentIndex: z.number().int().min(0),
  note: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth();

    const body = await request.json();
    const parsed = SaveMomentSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError("Invalid request body", "VALIDATION_ERROR", 422);
    }

    const moment = await insertSavedMoment(supabase, {
      userId: user.id,
      analysisId: parsed.data.analysisId,
      momentIndex: parsed.data.momentIndex,
      note: parsed.data.note,
    });

    return Response.json({ data: { moment } }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { supabase } = await requireAuth();
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      throw new AppError("Missing moment ID", "VALIDATION_ERROR", 422);
    }

    await deleteSavedMoment(supabase, id);
    return Response.json({ data: { success: true } });
  } catch (error) {
    return handleApiError(error);
  }
}

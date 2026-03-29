import { createClient } from "@/lib/supabase/server";
import { UnauthorizedError } from "@/lib/errors";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user, supabase };
}

export async function requireAuth() {
  const { user, supabase } = await getSession();
  if (!user) {
    throw new UnauthorizedError();
  }
  return { user, supabase };
}

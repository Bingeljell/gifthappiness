import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { getSessionUser } from "../lib/session";
import type { Env } from "../lib/env";

// GET /me/celebrations
// Lists celebrations owned by the signed-in user, including drafts -- unlike
// GET /celebrations/:slug (celebrations_public), which only shows published
// ones to the public. Requires a session (see workers/src/lib/session.ts).
export async function listMyCelebrations(request: Request, env: Env): Promise<Response> {
  const user = await getSessionUser(request, env);
  if (!user) {
    return errorResponse("Not signed in", env, 401);
  }

  const supabase = getSupabaseClient(env);
  const { data, error } = await supabase
    .from("celebrations")
    .select("id, slug, celebration_type, celebration_date, active_from, active_till, status, charity_id")
    .eq("host_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse("Could not read celebrations", env, 500);
  }

  return json({ celebrations: data }, env);
}

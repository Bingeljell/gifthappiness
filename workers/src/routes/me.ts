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

// GET /me/contributions
// Lists contributions made by the signed-in user across all celebrations.
// Reads the base `contributions` table (not `contributions_public`) since a
// donor should see their own amount/message regardless of show_amount/
// show_name/anonymous, which only redact the public-facing view.
export async function listMyContributions(request: Request, env: Env): Promise<Response> {
  const user = await getSessionUser(request, env);
  if (!user) {
    return errorResponse("Not signed in", env, 401);
  }

  const supabase = getSupabaseClient(env);
  const { data: contributions, error } = await supabase
    .from("contributions")
    .select("id, celebration_id, amount, message, show_name, show_amount, anonymous, payment_status, created_at")
    .eq("donor_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse("Could not read contributions", env, 500);
  }

  const celebrationIds = [...new Set((contributions ?? []).map((c) => c.celebration_id))];
  const celebrationsById = new Map<string, { slug: string; celebration_type: string }>();

  if (celebrationIds.length > 0) {
    const { data: celebrations } = await supabase
      .from("celebrations")
      .select("id, slug, celebration_type")
      .in("id", celebrationIds);

    for (const c of celebrations ?? []) {
      celebrationsById.set(c.id, { slug: c.slug, celebration_type: c.celebration_type });
    }
  }

  const result = (contributions ?? []).map((c) => ({
    ...c,
    celebration: celebrationsById.get(c.celebration_id) ?? null,
  }));

  return json({ contributions: result }, env);
}

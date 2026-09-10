import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { getSessionUser } from "../lib/session";
import { readJsonBody, optionalString, ValidationError } from "../lib/validate";
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
    .select(
      "id, slug, celebration_type, celebration_date, active_from, active_till, status, message, charity_id, charity:charities!charity_id(name, slug)",
    )
    .eq("host_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse("Could not read celebrations", env, 500);
  }

  // Flatten postgrest's nested charity (object or array depending on the
  // relationship it infers) so the client sees plain fields.
  const celebrations = (data ?? []).map((c) => {
    const charity = (Array.isArray(c.charity) ? c.charity[0] : c.charity) as
      | { name: string; slug: string }
      | undefined;
    const rest = { ...c } as Record<string, unknown>;
    delete rest.charity;
    return { ...rest, charity_name: charity?.name ?? null, charity_slug: charity?.slug ?? null };
  });

  return json({ celebrations }, env);
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

// PATCH /me/celebrations/:slug
// Lets a host edit their own celebration. Distinct from the admin route in
// adminCelebrations.ts: this one is session-gated on *ownership* rather than
// is_admin, and never accepts a status change -- a host cannot publish their
// own celebration, since admin approval is the whole point of that gate.
//
// What's editable narrows once the celebration is live (product decision
// 2026-09-10). While it's a draft, everything including the charity can
// change. Once published, only the message and the dates: guests contribute
// to a *specific charity*, so letting a host swap it afterwards would
// silently redirect money people already gave under a different premise.
const DRAFT_EDITABLE = ["celebrationType", "celebrationDate", "activeFrom", "activeTill", "message", "charitySlug"] as const;
const PUBLISHED_EDITABLE = ["celebrationDate", "activeFrom", "activeTill", "message"] as const;

const FIELD_TO_COLUMN: Record<string, string> = {
  celebrationType: "celebration_type",
  celebrationDate: "celebration_date",
  activeFrom: "active_from",
  activeTill: "active_till",
  message: "message",
};

export async function updateMyCelebration(slug: string, request: Request, env: Env): Promise<Response> {
  const user = await getSessionUser(request, env);
  if (!user) {
    return errorResponse("Not signed in", env, 401);
  }

  try {
    const body = await readJsonBody(request);
    const supabase = getSupabaseClient(env);

    const { data: celebration, error: readError } = await supabase
      .from("celebrations")
      .select("id, host_id, status")
      .eq("slug", slug)
      .maybeSingle();

    if (readError) {
      return errorResponse("Could not read celebration", env, 500);
    }
    // Same 404 for "doesn't exist" and "isn't yours" -- distinguishing them
    // would let a signed-in user probe which slugs exist.
    if (!celebration || celebration.host_id !== user.id) {
      return errorResponse("Celebration not found", env, 404);
    }

    const status = celebration.status as string;
    if (status !== "draft" && status !== "published") {
      return errorResponse(
        "This celebration can no longer be edited. Please contact us if you need to change it.",
        env,
        409,
      );
    }

    const allowed: readonly string[] = status === "draft" ? DRAFT_EDITABLE : PUBLISHED_EDITABLE;
    const updates: Record<string, unknown> = {};

    for (const field of Object.keys(body)) {
      if (!allowed.includes(field)) {
        // Naming the live-celebration rule explicitly: a generic "invalid
        // field" here reads like a bug to a host who can see the input.
        if (status === "published" && DRAFT_EDITABLE.includes(field as (typeof DRAFT_EDITABLE)[number])) {
          return errorResponse(
            `"${field}" can't be changed once your celebration is live. You can still update the message and dates.`,
            env,
            409,
          );
        }
        return errorResponse(`Unknown field "${field}"`, env, 422);
      }

      if (field === "charitySlug") {
        const charitySlug = optionalString(body.charitySlug, "charitySlug");
        if (!charitySlug) {
          throw new ValidationError("charitySlug cannot be empty");
        }
        const { data: charity } = await supabase
          .from("charities")
          .select("id")
          .eq("slug", charitySlug)
          .maybeSingle();
        if (!charity) {
          return errorResponse("Unknown charity", env, 404);
        }
        updates.charity_id = charity.id;
        continue;
      }

      const column = FIELD_TO_COLUMN[field];
      const maxLength = field === "message" ? 1000 : undefined;
      updates[column] = optionalString(body[field], field, maxLength ? { maxLength } : undefined) ?? null;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No updatable fields provided", env, 422);
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("celebrations")
      .update(updates)
      .eq("id", celebration.id)
      .select("id, slug, celebration_type, celebration_date, active_from, active_till, status, message, charity_id")
      .maybeSingle();

    if (error || !data) {
      return errorResponse("Could not update celebration", env, 500);
    }

    return json({ celebration: data }, env);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

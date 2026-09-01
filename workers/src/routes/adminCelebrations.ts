import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { readJsonBody, optionalString, ValidationError } from "../lib/validate";
import { getSessionUser } from "../lib/session";
import type { Env } from "../lib/env";

// Mirrors admin.ts's isAuthorizedAdmin -- kept local rather than shared to
// avoid a cross-route import cycle for one guard clause (same tradeoff
// already made in uploads.ts).
async function isAuthorizedAdmin(request: Request, env: Env): Promise<boolean> {
  const auth = request.headers.get("Authorization") ?? "";
  const [scheme, token] = auth.split(" ");
  if (scheme === "Bearer" && env.ADMIN_API_KEY.length > 0 && token === env.ADMIN_API_KEY) {
    return true;
  }

  const user = await getSessionUser(request, env);
  return user?.isAdmin === true;
}

const CELEBRATION_STATUSES = ["draft", "published", "expired", "flagged"] as const;

// GET /admin/celebrations
// Lists every celebration (all statuses, unlike celebrations_public which
// only shows 'published' ones publicly) with the host and charity names
// embedded via postgrest's FK-based nested select, so the admin list doesn't
// need a second round-trip per row. This is also the only place a celebration
// can be found before it's published, since celebrations_public excludes
// drafts -- i.e. the only way an admin can review one before it goes live.
export async function listCelebrationsAdmin(request: Request, env: Env): Promise<Response> {
  if (!(await isAuthorizedAdmin(request, env))) {
    return errorResponse("Unauthorized", env, 401);
  }

  const supabase = getSupabaseClient(env);
  const { data, error } = await supabase
    .from("celebrations")
    .select(
      "id, slug, celebration_type, celebration_date, active_from, active_till, status, message, created_at, host:users!host_id(name, email, mobile), charity:charities!charity_id(name, slug)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse("Could not list celebrations", env, 500);
  }
  return json({ celebrations: data }, env);
}

// PATCH /admin/celebrations/:slug
// Product decision (2026-09-01): every celebration needs admin approval
// before it goes live -- this route is that approval mechanism (and the
// only thing that has ever moved a celebration out of 'draft': POST
// /celebrations always inserts 'draft' and nothing else transitions it, a
// previously-open gap in docs/plan.md). There's no separate "completed"
// status -- 'expired' already means "this celebration's active window is
// over", so admins close one out by setting that instead of adding a new
// value. Also doubles as a general admin edit (celebration_type/date/active
// window/message) for fixing a celebration that has something wrong with it.
export async function updateCelebration(slug: string, request: Request, env: Env): Promise<Response> {
  if (!(await isAuthorizedAdmin(request, env))) {
    return errorResponse("Unauthorized", env, 401);
  }

  try {
    const body = await readJsonBody(request);
    const updates: Record<string, unknown> = {};

    if ("status" in body) {
      const status = body.status;
      if (typeof status !== "string" || !CELEBRATION_STATUSES.includes(status as (typeof CELEBRATION_STATUSES)[number])) {
        throw new ValidationError(`status must be one of ${CELEBRATION_STATUSES.join(", ")}`);
      }
      updates.status = status;
    }
    if ("celebrationType" in body) updates.celebration_type = optionalString(body.celebrationType, "celebrationType") ?? null;
    if ("celebrationDate" in body) updates.celebration_date = optionalString(body.celebrationDate, "celebrationDate") ?? null;
    if ("activeFrom" in body) updates.active_from = optionalString(body.activeFrom, "activeFrom") ?? null;
    if ("activeTill" in body) updates.active_till = optionalString(body.activeTill, "activeTill") ?? null;
    if ("message" in body) updates.message = optionalString(body.message, "message", { maxLength: 1000 }) ?? null;

    if (Object.keys(updates).length === 0) {
      return errorResponse("No updatable fields provided", env, 422);
    }
    updates.updated_at = new Date().toISOString();

    const supabase = getSupabaseClient(env);
    const { data, error } = await supabase
      .from("celebrations")
      .update(updates)
      .eq("slug", slug)
      .select(
        "id, slug, celebration_type, celebration_date, active_from, active_till, status, message, created_at, host:users!host_id(name, email, mobile), charity:charities!charity_id(name, slug)",
      )
      .maybeSingle();

    if (error) {
      return errorResponse("Could not update celebration", env, 500);
    }
    if (!data) {
      return errorResponse("Celebration not found", env, 404);
    }
    return json({ celebration: data }, env);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

// DELETE /admin/celebrations/:slug -- for removing a celebration that was
// never actually used (a leftover 'draft' a host abandoned, or a smoke-test
// record like the one that surfaced this: a real UNICEF-blocking-delete case
// turned out to be exactly this kind of leftover, not real donor data).
// Deliberately narrower than deleteCharity in admin.ts: refuses outright on
// 'published'/'flagged' (those need a status change first, not a delete),
// and separately refuses if any contribution references it -- contributions
// cascade-delete with their celebration (`on delete cascade`), so a
// celebration that collected real money must never be deletable at all,
// regardless of its current status.
export async function deleteCelebration(slug: string, request: Request, env: Env): Promise<Response> {
  if (!(await isAuthorizedAdmin(request, env))) {
    return errorResponse("Unauthorized", env, 401);
  }

  const supabase = getSupabaseClient(env);

  const { data: celebration, error: findError } = await supabase.from("celebrations").select("id, status").eq("slug", slug).maybeSingle();
  if (findError) {
    return errorResponse("Could not look up celebration", env, 500);
  }
  if (!celebration) {
    return errorResponse("Celebration not found", env, 404);
  }
  if (celebration.status !== "draft" && celebration.status !== "expired") {
    return errorResponse(`Can't delete a ${celebration.status} celebration -- change its status first (e.g. mark it complete).`, env, 409);
  }

  const { count, error: countError } = await supabase
    .from("contributions")
    .select("id", { count: "exact", head: true })
    .eq("celebration_id", celebration.id);
  if (countError) {
    return errorResponse("Could not check for existing contributions", env, 500);
  }
  if (count && count > 0) {
    return errorResponse(
      `This celebration has ${count} contribution${count === 1 ? "" : "s"} tied to it and can't be deleted.`,
      env,
      409,
    );
  }

  const { error: deleteError } = await supabase.from("celebrations").delete().eq("slug", slug);
  if (deleteError) {
    return errorResponse("Could not delete celebration", env, 500);
  }

  return json({ deleted: true }, env);
}

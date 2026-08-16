import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { readJsonBody, requireString, optionalString, ValidationError } from "../lib/validate";
import type { Env } from "../lib/env";

// Gated by a shared-secret bearer token for now. docs/plan.md's CMS/Admin
// Direction still has "define admin roles" as an open decision point; this
// is a placeholder until real Supabase-Auth-backed role checks replace it.
function isAuthorizedAdmin(request: Request, env: Env): boolean {
  const auth = request.headers.get("Authorization") ?? "";
  const [scheme, token] = auth.split(" ");
  return scheme === "Bearer" && token === env.ADMIN_API_KEY && env.ADMIN_API_KEY.length > 0;
}

export async function listCharitiesAdmin(request: Request, env: Env): Promise<Response> {
  if (!isAuthorizedAdmin(request, env)) {
    return errorResponse("Unauthorized", env, 401);
  }

  const supabase = getSupabaseClient(env);
  const { data, error } = await supabase.from("charities").select("*").order("name");

  if (error) {
    return errorResponse("Could not list charities", env, 500);
  }
  return json({ charities: data }, env);
}

export async function createCharity(request: Request, env: Env): Promise<Response> {
  if (!isAuthorizedAdmin(request, env)) {
    return errorResponse("Unauthorized", env, 401);
  }

  try {
    const body = await readJsonBody(request);

    const record = {
      slug: requireString(body.slug, "slug"),
      name: requireString(body.name, "name"),
      category: requireString(body.category, "category"),
      short_description: requireString(body.shortDescription, "shortDescription"),
      what_they_do: requireString(body.whatTheyDo, "whatTheyDo"),
      who_they_help: requireString(body.whoTheyHelp, "whoTheyHelp"),
      why_selected: requireString(body.whySelected, "whySelected"),
      impact_example: optionalString(body.impactExample, "impactExample"),
      sdgs: Array.isArray(body.sdgs) ? body.sdgs : [],
      ceiling: Number(body.ceiling ?? 0),
      registration: optionalString(body.registration, "registration"),
      years_active: body.yearsActive ? Number(body.yearsActive) : null,
      verification_notes: optionalString(body.verificationNotes, "verificationNotes"),
    };

    if (!Number.isFinite(record.ceiling) || record.ceiling <= 0) {
      return errorResponse("ceiling must be a positive number", env, 422);
    }

    const supabase = getSupabaseClient(env);
    const { data, error } = await supabase.from("charities").insert(record).select("*").single();

    if (error || !data) {
      return errorResponse("Could not create charity", env, 500);
    }
    return json({ charity: data }, env, 201);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

// PATCH /admin/charities/:slug — partial update, e.g. status/ceiling/amount_raised.
export async function updateCharity(slug: string, request: Request, env: Env): Promise<Response> {
  if (!isAuthorizedAdmin(request, env)) {
    return errorResponse("Unauthorized", env, 401);
  }

  try {
    const body = await readJsonBody(request);
    const allowedFields = [
      "name",
      "category",
      "status",
      "short_description",
      "what_they_do",
      "who_they_help",
      "why_selected",
      "impact_example",
      "sdgs",
      "amount_raised",
      "ceiling",
      "registration",
      "years_active",
      "verification_notes",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No updatable fields provided", env, 422);
    }
    updates.updated_at = new Date().toISOString();

    const supabase = getSupabaseClient(env);
    const { data, error } = await supabase
      .from("charities")
      .update(updates)
      .eq("slug", slug)
      .select("*")
      .maybeSingle();

    if (error) {
      return errorResponse("Could not update charity", env, 500);
    }
    if (!data) {
      return errorResponse("Charity not found", env, 404);
    }
    return json({ charity: data }, env);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

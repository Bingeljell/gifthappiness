import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { readJsonBody, requireString, optionalString, ValidationError } from "../lib/validate";
import { getSessionUser } from "../lib/session";
import type { Env } from "../lib/env";

// Session + users.is_admin is the real check (Phase 6 Stage 3). The
// ADMIN_API_KEY shared secret is kept as an explicit fallback during the
// transition per docs/plan.md, not deleted outright.
async function isAuthorizedAdmin(request: Request, env: Env): Promise<boolean> {
  const auth = request.headers.get("Authorization") ?? "";
  const [scheme, token] = auth.split(" ");
  if (scheme === "Bearer" && env.ADMIN_API_KEY.length > 0 && token === env.ADMIN_API_KEY) {
    return true;
  }

  const user = await getSessionUser(request, env);
  return user?.isAdmin === true;
}

export async function listCharitiesAdmin(request: Request, env: Env): Promise<Response> {
  if (!(await isAuthorizedAdmin(request, env))) {
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
  if (!(await isAuthorizedAdmin(request, env))) {
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
      registration: optionalString(body.registration, "registration"),
      years_active: body.yearsActive ? Number(body.yearsActive) : null,
      verification_notes: optionalString(body.verificationNotes, "verificationNotes"),
      website: optionalString(body.website, "website"),
      logo_url: optionalString(body.logoUrl, "logoUrl"),
      header_image_url: optionalString(body.headerImageUrl, "headerImageUrl"),
    };

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

// PATCH /admin/charities/:slug — partial update, e.g. status/amount_raised.
export async function updateCharity(slug: string, request: Request, env: Env): Promise<Response> {
  if (!(await isAuthorizedAdmin(request, env))) {
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
      "registration",
      "years_active",
      "verification_notes",
      "website",
      "logo_url",
      "header_image_url",
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

// DELETE /admin/charities/:slug -- refuses if any celebration has ever
// pointed at this charity (celebrations.charity_id has no cascade rule, and
// donation history shouldn't silently disappear). For a charity that's been
// used, the existing `status: 'completed'` update is the intended way to
// retire it; this route is for removing charities that were never actually
// used (test/dummy entries, or one added and reconsidered before launch).
export async function deleteCharity(slug: string, request: Request, env: Env): Promise<Response> {
  if (!(await isAuthorizedAdmin(request, env))) {
    return errorResponse("Unauthorized", env, 401);
  }

  const supabase = getSupabaseClient(env);

  const { data: charity, error: findError } = await supabase.from("charities").select("id").eq("slug", slug).maybeSingle();
  if (findError) {
    return errorResponse("Could not look up charity", env, 500);
  }
  if (!charity) {
    return errorResponse("Charity not found", env, 404);
  }

  const { count, error: countError } = await supabase
    .from("celebrations")
    .select("id", { count: "exact", head: true })
    .eq("charity_id", charity.id);
  if (countError) {
    return errorResponse("Could not check for existing celebrations", env, 500);
  }
  if (count && count > 0) {
    return errorResponse(
      `This charity has ${count} celebration${count === 1 ? "" : "s"} tied to it and can't be deleted. Mark it "completed" instead.`,
      env,
      409,
    );
  }

  const { error: deleteError } = await supabase.from("charities").delete().eq("slug", slug);
  if (deleteError) {
    return errorResponse("Could not delete charity", env, 500);
  }

  return json({ deleted: true }, env);
}

import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { readJsonBody, requireString, requireEmail, requireMobile, optionalString, ValidationError } from "../lib/validate";
import { notifyHostSubmitted, notifyAdminsOfNewCelebration } from "../lib/emails";
import type { Env } from "../lib/env";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// POST /celebrations
// Creates (or reuses) a host by email, then a draft celebration.
// Status stays "draft" until OTP verification and publish are wired up —
// this route only covers the "creating a celebration" item from
// docs/plan.md's Worker API route list.
export async function createCelebration(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  try {
    const body = await readJsonBody(request);

    const hostName = requireString(body.hostName, "hostName");
    const hostEmail = requireEmail(body.hostEmail, "hostEmail");
    const hostMobile = requireMobile(body.hostMobile, "hostMobile");
    const hostAddress = optionalString(body.hostAddress, "hostAddress");
    const celebrationType = requireString(body.celebrationType, "celebrationType");
    const celebrationDate = optionalString(body.celebrationDate, "celebrationDate");
    const charitySlug = requireString(body.charitySlug, "charitySlug");
    const activeFrom = optionalString(body.activeFrom, "activeFrom");
    const activeTill = optionalString(body.activeTill, "activeTill");
    const message = optionalString(body.message, "message", { maxLength: 1000 });

    const supabase = getSupabaseClient(env);

    const { data: charity, error: charityError } = await supabase
      .from("charities")
      .select("id, name")
      .eq("slug", charitySlug)
      .single();

    if (charityError || !charity) {
      return errorResponse("Unknown charity", env, 404);
    }

    // Email is the host's identity/verification key now (see docs/plan.md's
    // OTP-to-email deviation note); mobile is still collected but not used
    // for lookups. `users` is the unified account table (Phase 6) -- a host
    // signing up here may already exist as a user (e.g. from a prior login),
    // in which case name/mobile/address are filled in on that account.
    const { data: existingHost } = await supabase
      .from("users")
      .select("id")
      .eq("email", hostEmail)
      .maybeSingle();

    let hostId = existingHost?.id as string | undefined;
    if (!hostId) {
      const { data: newHost, error: hostError } = await supabase
        .from("users")
        .insert({ name: hostName, email: hostEmail, mobile: hostMobile, address: hostAddress })
        .select("id")
        .single();

      if (hostError || !newHost) {
        return errorResponse("Could not create host", env, 500);
      }
      hostId = newHost.id;
    } else {
      await supabase
        .from("users")
        .update({ name: hostName, mobile: hostMobile, address: hostAddress })
        .eq("id", hostId);
    }

    const slug = `${slugify(hostName)}-${slugify(celebrationType)}-${crypto.randomUUID().slice(0, 8)}`;

    const { data: celebration, error: celebrationError } = await supabase
      .from("celebrations")
      .insert({
        slug,
        host_id: hostId,
        charity_id: charity.id,
        celebration_type: celebrationType,
        celebration_date: celebrationDate,
        active_from: activeFrom,
        active_till: activeTill,
        message,
        status: "draft",
      })
      .select("id, slug, status")
      .single();

    if (celebrationError || !celebration) {
      return errorResponse("Could not create celebration", env, 500);
    }

    // Both sends are fire-and-forget: the celebration row is already
    // committed, so a mail failure must not turn a successful submission into
    // an error for the host.
    const summary = {
      slug: celebration.slug,
      celebrationType,
      celebrationDate: celebrationDate ?? null,
      charityName: charity.name as string,
      hostName,
      hostEmail,
    };
    notifyHostSubmitted(env, ctx, summary);
    notifyAdminsOfNewCelebration(env, ctx, summary);

    return json({ celebration }, env, 201);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

// GET /celebrations/:slug
// Reads from celebrations_public, which already excludes anything not meant
// to be public (draft/expired/flagged celebrations, internal ids).
export async function getCelebration(slug: string, env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env);
  const { data, error } = await supabase
    .from("celebrations_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return errorResponse("Could not read celebration", env, 500);
  }
  if (!data) {
    return errorResponse("Celebration not found", env, 404);
  }
  return json({ celebration: data }, env);
}


// GET /celebrations/:slug/contributions
// Public contributor list for a celebration page. Reads contributions_public,
// which redacts donor names per anonymous/show_name and withholds amounts
// until a payment actually succeeded (see supabase/schema.sql).
//
// Deliberately mirrors getCelebration's 404 behaviour: an unpublished
// celebration has no public contributor list either, so this resolves the
// slug through celebrations_public rather than the base table.
export async function listCelebrationContributions(slug: string, env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env);

  const { data: celebration, error: celebrationError } = await supabase
    .from("celebrations_public")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (celebrationError) {
    return errorResponse("Could not read celebration", env, 500);
  }
  if (!celebration) {
    return errorResponse("Celebration not found", env, 404);
  }

  const { data, error } = await supabase
    .from("contributions_public")
    .select("id, donor_name, amount, payment_status, message, created_at")
    .eq("celebration_id", celebration.id)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse("Could not read contributions", env, 500);
  }

  return json({ contributions: data ?? [], count: (data ?? []).length }, env);
}


// GET /celebrations
// Public directory of published celebrations. Reads celebrations_public,
// which already filters to status = 'published' and exposes only public
// columns, so nothing here needs to re-check visibility.
//
// No pagination yet: the table is small and adding a cursor before it's
// needed would be speculative. Revisit when the list is long enough to matter.
export async function listCelebrations(env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env);

  const { data, error } = await supabase
    .from("celebrations_public")
    .select(
      "id, slug, celebration_type, celebration_date, active_from, active_till, message, picture_url, host_name, charity_slug, charity_name, charity_logo_url, charity_header_image_url",
    )
    .order("celebration_date", { ascending: true, nullsFirst: false });

  if (error) {
    return errorResponse("Could not list celebrations", env, 500);
  }

  return json({ celebrations: data ?? [] }, env);
}

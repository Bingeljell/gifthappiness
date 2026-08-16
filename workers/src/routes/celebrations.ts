import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { readJsonBody, requireString, requireMobile, optionalString, ValidationError } from "../lib/validate";
import type { Env } from "../lib/env";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// POST /celebrations
// Creates (or reuses) a host by mobile number, then a draft celebration.
// Status stays "draft" until OTP verification and publish are wired up —
// this route only covers the "creating a celebration" item from
// docs/plan.md's Worker API route list.
export async function createCelebration(request: Request, env: Env): Promise<Response> {
  try {
    const body = await readJsonBody(request);

    const hostName = requireString(body.hostName, "hostName");
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
      .select("id")
      .eq("slug", charitySlug)
      .single();

    if (charityError || !charity) {
      return errorResponse("Unknown charity", env, 404);
    }

    const { data: existingHost } = await supabase
      .from("hosts")
      .select("id")
      .eq("mobile", hostMobile)
      .maybeSingle();

    let hostId = existingHost?.id as string | undefined;
    if (!hostId) {
      const { data: newHost, error: hostError } = await supabase
        .from("hosts")
        .insert({ name: hostName, mobile: hostMobile, address: hostAddress })
        .select("id")
        .single();

      if (hostError || !newHost) {
        return errorResponse("Could not create host", env, 500);
      }
      hostId = newHost.id;
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

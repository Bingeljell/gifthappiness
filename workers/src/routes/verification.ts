import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { readJsonBody, requireString, requireEmail, requireMobile, ValidationError } from "../lib/validate";
import type { Env } from "../lib/env";

const CODE_TTL_MINUTES = 15;
const VALID_PURPOSES = new Set(["host_signup", "contribution"]);
const VALID_CHANNELS = new Set(["email", "mobile"]);

function generateCode(): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(100000 + (bytes[0] % 900000));
}

async function hashCode(code: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function requirePurpose(value: unknown): string {
  const purpose = requireString(value, "purpose");
  if (!VALID_PURPOSES.has(purpose)) {
    throw new ValidationError(`purpose must be one of: ${Array.from(VALID_PURPOSES).join(", ")}`);
  }
  return purpose;
}

function requireChannel(value: unknown): "email" | "mobile" {
  const channel = requireString(value, "channel");
  if (!VALID_CHANNELS.has(channel)) {
    throw new ValidationError(`channel must be one of: ${Array.from(VALID_CHANNELS).join(", ")}`);
  }
  return channel as "email" | "mobile";
}

function normalizeContact(channel: "email" | "mobile", value: unknown): string {
  return channel === "email" ? requireEmail(value, "contact") : requireMobile(value, "contact");
}

// POST /verify/request
// channel: "email" is the active path right now -- host verification runs
// over email, OTP-over-SMS is deferred (see supabase/schema.sql). The
// "mobile" channel is already accepted here so turning OTP back on later is
// just wiring an SMS provider at the TODO below, no schema or route changes.
//
// Never returns the code in the response. Until an email provider (or later,
// an SMS provider) is chosen, there is nowhere for the code to be dispatched
// to, so this route can't be exercised end-to-end yet.
export async function requestVerification(request: Request, env: Env): Promise<Response> {
  try {
    const body = await readJsonBody(request);
    const channel = requireChannel(body.channel);
    const contact = normalizeContact(channel, body.contact);
    const purpose = requirePurpose(body.purpose);

    const code = generateCode();
    const codeHash = await hashCode(code);
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();

    const supabase = getSupabaseClient(env);
    const { error } = await supabase.from("verifications").insert({
      channel,
      contact,
      purpose,
      code_hash: codeHash,
      expires_at: expiresAt,
    });

    if (error) {
      return errorResponse("Could not issue a verification code", env, 500);
    }

    // TODO(email): dispatch `code` via the chosen transactional email provider.
    // TODO(mobile, later): dispatch `code` via SMS once an OTP provider is picked.

    return json({ status: "issued", channel, expiresInMinutes: CODE_TTL_MINUTES }, env, 201);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

// POST /verify/confirm
export async function confirmVerification(request: Request, env: Env): Promise<Response> {
  try {
    const body = await readJsonBody(request);
    const channel = requireChannel(body.channel);
    const contact = normalizeContact(channel, body.contact);
    const purpose = requirePurpose(body.purpose);
    const code = requireString(body.code, "code", { maxLength: 6 });

    const codeHash = await hashCode(code);
    const supabase = getSupabaseClient(env);

    const { data: candidate, error } = await supabase
      .from("verifications")
      .select("id, code_hash, expires_at, verified_at")
      .eq("channel", channel)
      .eq("contact", contact)
      .eq("purpose", purpose)
      .is("verified_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !candidate) {
      return errorResponse("No pending verification for this contact", env, 404);
    }
    if (new Date(candidate.expires_at).getTime() < Date.now()) {
      return errorResponse("Verification code has expired", env, 410);
    }
    if (candidate.code_hash !== codeHash) {
      return errorResponse("Incorrect code", env, 401);
    }

    await supabase.from("verifications").update({ verified_at: new Date().toISOString() }).eq("id", candidate.id);

    if (channel === "email" && purpose === "host_signup") {
      await supabase.from("hosts").update({ email_verified: true }).eq("email", contact);
    }

    return json({ verified: true }, env);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

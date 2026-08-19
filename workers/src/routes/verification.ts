import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { readJsonBody, requireString, requireEmail, requireMobile, ValidationError } from "../lib/validate";
import { generateCode, hashCode } from "../lib/code";
import { sendEmail } from "../lib/email";
import type { Env } from "../lib/env";

const CODE_TTL_MINUTES = 15;
const VALID_PURPOSES = new Set(["host_signup", "contribution"]);
const VALID_CHANNELS = new Set(["email", "mobile"]);

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
// Never returns the code in the response -- it's emailed via Resend instead
// (see lib/email.ts). Mobile-channel codes still have nowhere to be
// dispatched to until an SMS provider is picked.
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

    if (channel === "email") {
      const sent = await sendEmail(env, contact, "Your GiftHappiness verification code", `Your verification code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes.`);
      if (!sent) {
        return errorResponse("Could not send the verification code email", env, 502);
      }
    }
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
      await supabase.from("users").update({ email_verified: true }).eq("email", contact);
    }

    return json({ verified: true }, env);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

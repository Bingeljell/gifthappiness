import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { readJsonBody, requireMobile, requireString, ValidationError } from "../lib/validate";
import type { Env } from "../lib/env";

const OTP_TTL_MINUTES = 5;
const VALID_PURPOSES = new Set(["host_signup", "contribution"]);

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

// POST /otp/request
// Issues a code and stores its hash. Deliberately never returns the code in
// the response — until an SMS provider is chosen (docs/plan.md "OTP provider"
// is still an open decision), there is nowhere for this code to be dispatched
// to, so this route cannot be exercised end-to-end yet. Wire the provider
// call where the TODO below is.
export async function requestOtp(request: Request, env: Env): Promise<Response> {
  try {
    const body = await readJsonBody(request);
    const mobile = requireMobile(body.mobile);
    const purpose = requirePurpose(body.purpose);

    const code = generateCode();
    const codeHash = await hashCode(code);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

    const supabase = getSupabaseClient(env);
    const { error } = await supabase.from("otp_verifications").insert({
      mobile,
      purpose,
      code_hash: codeHash,
      expires_at: expiresAt,
    });

    if (error) {
      return errorResponse("Could not issue OTP", env, 500);
    }

    // TODO: dispatch `code` via the chosen SMS/OTP provider once selected.

    return json({ status: "issued", expiresInMinutes: OTP_TTL_MINUTES }, env, 201);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

// POST /otp/verify
export async function verifyOtp(request: Request, env: Env): Promise<Response> {
  try {
    const body = await readJsonBody(request);
    const mobile = requireMobile(body.mobile);
    const purpose = requirePurpose(body.purpose);
    const code = requireString(body.code, "code", { maxLength: 6 });

    const codeHash = await hashCode(code);
    const supabase = getSupabaseClient(env);

    const { data: candidate, error } = await supabase
      .from("otp_verifications")
      .select("id, code_hash, expires_at, verified_at")
      .eq("mobile", mobile)
      .eq("purpose", purpose)
      .is("verified_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !candidate) {
      return errorResponse("No pending verification for this mobile number", env, 404);
    }
    if (new Date(candidate.expires_at).getTime() < Date.now()) {
      return errorResponse("OTP has expired", env, 410);
    }
    if (candidate.code_hash !== codeHash) {
      return errorResponse("Incorrect code", env, 401);
    }

    await supabase.from("otp_verifications").update({ verified_at: new Date().toISOString() }).eq("id", candidate.id);

    return json({ verified: true }, env);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

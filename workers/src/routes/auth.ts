import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import { readJsonBody, requireEmail, requireString, ValidationError } from "../lib/validate";
import { generateCode, hashCode } from "../lib/code";
import { createSession, deleteSession, getSessionUser } from "../lib/session";
import type { Env } from "../lib/env";

const CODE_TTL_MINUTES = 15;

// POST /auth/request
// Find-or-create the user by email, then issue a login code through the
// same verifications table/mechanism as host-signup verification (purpose
// "login" instead of "host_signup" -- see workers/src/routes/verification.ts
// and supabase/schema.sql). Same TODO as that route: dispatch needs an email
// provider, so this can't be exercised end-to-end until one is chosen.
export async function requestLogin(request: Request, env: Env): Promise<Response> {
  try {
    const body = await readJsonBody(request);
    const email = requireEmail(body.email);

    const supabase = getSupabaseClient(env);

    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
    if (!existingUser) {
      const { error: createError } = await supabase.from("users").insert({ email });
      if (createError) {
        return errorResponse("Could not start sign-in", env, 500);
      }
    }

    const code = generateCode();
    const codeHash = await hashCode(code);
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();

    const { error } = await supabase.from("verifications").insert({
      channel: "email",
      contact: email,
      purpose: "login",
      code_hash: codeHash,
      expires_at: expiresAt,
    });

    if (error) {
      return errorResponse("Could not issue a sign-in code", env, 500);
    }

    // TODO(email): dispatch `code` via the chosen transactional email provider.

    return json({ status: "issued", expiresInMinutes: CODE_TTL_MINUTES }, env, 201);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

// POST /auth/confirm
// Validates the login code, marks the account email_verified, and returns a
// new session token.
export async function confirmLogin(request: Request, env: Env): Promise<Response> {
  try {
    const body = await readJsonBody(request);
    const email = requireEmail(body.email);
    const code = requireString(body.code, "code", { maxLength: 6 });

    const codeHash = await hashCode(code);
    const supabase = getSupabaseClient(env);

    const { data: candidate, error } = await supabase
      .from("verifications")
      .select("id, code_hash, expires_at, verified_at")
      .eq("channel", "email")
      .eq("contact", email)
      .eq("purpose", "login")
      .is("verified_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !candidate) {
      return errorResponse("No pending sign-in code for this email", env, 404);
    }
    if (new Date(candidate.expires_at).getTime() < Date.now()) {
      return errorResponse("Sign-in code has expired", env, 410);
    }
    if (candidate.code_hash !== codeHash) {
      return errorResponse("Incorrect code", env, 401);
    }

    await supabase.from("verifications").update({ verified_at: new Date().toISOString() }).eq("id", candidate.id);

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, email, is_admin")
      .eq("email", email)
      .maybeSingle();

    if (userError || !user) {
      return errorResponse("Could not complete sign-in", env, 500);
    }

    await supabase.from("users").update({ email_verified: true }).eq("id", user.id);

    const token = await createSession(user.id, env);

    return json(
      {
        token,
        user: { id: user.id, name: user.name, email: user.email, isAdmin: user.is_admin },
      },
      env,
    );
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}

// GET /auth/me
export async function getMe(request: Request, env: Env): Promise<Response> {
  const user = await getSessionUser(request, env);
  if (!user) {
    return errorResponse("Not signed in", env, 401);
  }
  return json({ user }, env);
}

// POST /auth/logout
export async function logout(request: Request, env: Env): Promise<Response> {
  await deleteSession(request, env);
  return json({ status: "signed_out" }, env);
}

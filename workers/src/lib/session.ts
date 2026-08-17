import { getSupabaseClient } from "./supabase";
import type { Env } from "./env";

const SESSION_TTL_DAYS = 30;

// Opaque bearer token, not a JWT (see docs/plan.md "Phase 6: Accounts And
// Sign-In" for why): only the sha256 hash is ever stored, same pattern as
// verification codes (lib/code.ts). The plaintext token is returned to the
// client exactly once, on login.
function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  isAdmin: boolean;
};

function bearerToken(request: Request): string | null {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice("Bearer ".length).trim();
  return token || null;
}

// Creates a session for a user and returns the plaintext token to send back
// to the client. Called after a login verification code is confirmed.
export async function createSession(userId: string, env: Env): Promise<string> {
  const token = generateToken();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const supabase = getSupabaseClient(env);
  await supabase.from("sessions").insert({ user_id: userId, token_hash: tokenHash, expires_at: expiresAt });

  return token;
}

// Resolves the signed-in user from the request's Authorization header, or
// null if there's no session (missing header, unknown/expired token, or the
// user record is gone). Callers decide whether a missing session is an
// error -- some routes work for both signed-in and guest requests.
export async function getSessionUser(request: Request, env: Env): Promise<SessionUser | null> {
  const token = bearerToken(request);
  if (!token) return null;

  const tokenHash = await hashToken(token);
  const supabase = getSupabaseClient(env);

  const { data: session } = await supabase
    .from("sessions")
    .select("user_id, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!session || new Date(session.expires_at).getTime() < Date.now()) return null;

  const { data: user } = await supabase
    .from("users")
    .select("id, name, email, is_admin")
    .eq("id", session.user_id)
    .maybeSingle();

  if (!user) return null;

  return { id: user.id, name: user.name, email: user.email, isAdmin: user.is_admin };
}

export async function deleteSession(request: Request, env: Env): Promise<void> {
  const token = bearerToken(request);
  if (!token) return;

  const tokenHash = await hashToken(token);
  const supabase = getSupabaseClient(env);
  await supabase.from("sessions").delete().eq("token_hash", tokenHash);
}

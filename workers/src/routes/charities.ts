import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import type { Env } from "../lib/env";

// GET /charities
// Public charity directory, reads from charities_public (see
// supabase/schema.sql) -- no auth required, same visibility as the
// /admin/charities data since charities_public doesn't redact anything, it
// just excludes internal-only columns that don't exist here anyway.
export async function listCharities(env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env);
  const { data, error } = await supabase.from("charities_public").select("*").order("name");

  if (error) {
    return errorResponse("Could not list charities", env, 500);
  }
  return json({ charities: data }, env);
}

// GET /charities/:slug
export async function getCharityBySlug(slug: string, env: Env): Promise<Response> {
  const supabase = getSupabaseClient(env);
  const { data, error } = await supabase.from("charities_public").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    return errorResponse("Could not read charity", env, 500);
  }
  if (!data) {
    return errorResponse("Charity not found", env, 404);
  }
  return json({ charity: data }, env);
}

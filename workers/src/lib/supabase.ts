import { createClient } from "@supabase/supabase-js";
import type { Env } from "./env";

// Always uses the service role key: every table has RLS enabled with no
// anon/authenticated policies (see supabase/schema.sql), so the Worker is the
// only writer/reader of the base tables. Never expose this client or its key
// to the browser.
export function getSupabaseClient(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

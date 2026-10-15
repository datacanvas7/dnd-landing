import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for the waitlist insert.
 *
 * The browser never talks to Supabase directly in this project: signups go
 * through POST /api/waitlist, which validates, rate-limits, then inserts
 * using the public anon key under restrictive RLS. The service-role key is
 * never used here and must never be added to any env var read by client code.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: { "x-application-name": "dnd-waitlist" },
    },
  });
}

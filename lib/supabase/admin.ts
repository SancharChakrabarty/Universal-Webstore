import "server-only";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./config";

/**
 * Uses SUPABASE_SERVICE_ROLE_KEY, which bypasses Row Level Security.
 * This file is marked `server-only` so any accidental import from a
 * client component fails the build loudly instead of leaking the key.
 *
 * Every admin mutation (create/update/delete on products, brands, orders,
 * etc.) should go through this client — the RLS policies in
 * 0001_init.sql intentionally do NOT grant authenticated users broad
 * write access, so the anon key cannot perform these writes even if a
 * session is signed in. The is_admin check happens in
 * lib/admin/auth.ts and in middleware.ts, *before* this client is ever
 * touched — this client itself trusts the caller completely.
 */
export function getSupabaseAdminClient() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

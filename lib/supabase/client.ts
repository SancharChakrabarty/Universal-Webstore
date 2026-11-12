"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { isSupabaseConfigured } from "./config";

/**
 * Lazily creates a Supabase client component client. Returns null when
 * NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY aren't set yet,
 * so auth UI can render a "connect Supabase" message instead of crashing.
 */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  return createClientComponentClient();
}

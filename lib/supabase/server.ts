import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { isSupabaseConfigured } from "./config";

/**
 * Returns null when Supabase env vars aren't set yet, so server components
 * (like /account) can render a setup notice instead of throwing.
 */
export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  return createServerComponentClient({ cookies });
}

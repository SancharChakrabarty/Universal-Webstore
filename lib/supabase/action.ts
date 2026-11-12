import "server-only";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { isSupabaseConfigured } from "./config";

/**
 * Supabase client for use inside Server Actions ("use server" functions).
 * Unlike getSupabaseServerClient (read-oriented, for Server Components),
 * this client is able to write auth cookies, which is required for any
 * action that mutates data on behalf of the signed-in customer.
 */
export function getSupabaseActionClient() {
  if (!isSupabaseConfigured()) return null;
  return createServerActionClient({ cookies });
}

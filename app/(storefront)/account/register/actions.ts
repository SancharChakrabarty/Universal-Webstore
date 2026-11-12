"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Returns the first active discount code tagged as a welcome/new-member code.
 * Falls back to null if none found.
 */
export async function getWelcomeCode(): Promise<{ code: string; discountValue: number } | null> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { code: "WELCOME10", discountValue: 10 };

  const { data } = await admin
    .from("discount_codes")
    .select("code, discount_value")
    .eq("is_active", true)
    .ilike("code", "WELCOME%")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (!data) return null;
  return { code: data.code, discountValue: data.discount_value };
}

"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type ValidateResult =
  | { ok: true; code: string; discountType: "percent" | "fixed"; discountValue: number }
  | { ok: false; error: string };

export async function validateDiscountCode(code: string): Promise<ValidateResult> {
  const admin = getSupabaseAdminClient();

  if (!admin) {
    if (code.trim().toUpperCase() === "WELCOME10") {
      return { ok: true, code: "WELCOME10", discountType: "percent", discountValue: 10 };
    }
    return { ok: false, error: "Invalid or expired code." };
  }

  const { data, error } = await admin
    .from("discount_codes")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !data) return { ok: false, error: "Invalid or expired code." };

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { ok: false, error: "This code has expired." };
  }

  if (data.usage_limit !== null && data.usage_count >= data.usage_limit) {
    return { ok: false, error: "This code has reached its usage limit." };
  }

  return {
    ok: true,
    code: data.code,
    discountType: data.discount_type as "percent" | "fixed",
    discountValue: data.discount_value,
  };
}

export async function incrementCodeUsage(code: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return;
  // Increment usage_count by 1
  const { data } = await admin
    .from("discount_codes")
    .select("usage_count")
    .eq("code", code)
    .single();
  if (data) {
    await admin
      .from("discount_codes")
      .update({ usage_count: data.usage_count + 1 })
      .eq("code", code);
  }
}

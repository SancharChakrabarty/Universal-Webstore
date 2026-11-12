"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type DiscountCodeInput = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  expires_at: string | null;
  usage_limit: number | null;
  is_active: boolean;
};

export async function createDiscountCode(input: DiscountCodeInput) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("discount_codes").insert({
    ...input,
    code: input.code.trim().toUpperCase(),
  });

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/discount-codes");
  return { ok: true as const };
}

export async function updateDiscountCode(id: string, input: Partial<DiscountCodeInput>) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("discount_codes").update(input).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/discount-codes");
  return { ok: true as const };
}

export async function deleteDiscountCode(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("discount_codes").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/discount-codes");
  return { ok: true as const };
}

export async function toggleDiscountCode(id: string, is_active: boolean) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("discount_codes").update({ is_active }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/discount-codes");
  return { ok: true as const };
}

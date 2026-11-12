"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type StrengthRangeInput = {
  label: string;
  min_mg: number;
  max_mg: number;
  tile_image_url: string | null;
};

export async function updateStrengthRange(id: string, input: StrengthRangeInput) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("strength_ranges").update(input).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/strength-ranges");
  return { ok: true as const };
}

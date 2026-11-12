"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createReview(input: {
  customer_name: string;
  rating: number;
  review_text: string;
  product_id: string | null;
  is_featured: boolean;
}) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("reviews").insert(input);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/reviews");
  return { ok: true as const };
}

export async function toggleReviewFeatured(id: string, value: boolean) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("reviews").update({ is_featured: value }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/reviews");
  return { ok: true as const };
}

export async function deleteReview(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("reviews").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/reviews");
  return { ok: true as const };
}

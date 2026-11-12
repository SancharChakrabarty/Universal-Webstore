"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function saveSettings(values: Record<string, unknown>) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
  const { error } = await admin.from("site_settings").upsert(rows);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/settings");
  return { ok: true as const };
}

export async function addHeroImage(image_url: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { data: existing } = await admin
    .from("hero_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  const { error } = await admin.from("hero_images").insert({ image_url, sort_order: nextOrder });
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/settings");
  return { ok: true as const };
}

export async function removeHeroImage(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("hero_images").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/settings");
  return { ok: true as const };
}

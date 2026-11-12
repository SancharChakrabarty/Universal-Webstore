"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export type BrandInput = {
  name: string;
  slug: string;
  description: string;
  logo_url: string;
};

export async function createBrand(input: BrandInput) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("brands").insert({
    ...input,
    slug: input.slug || slugify(input.name),
  });
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/brands");
  return { ok: true as const };
}

export async function updateBrand(id: string, input: BrandInput) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin
    .from("brands")
    .update({ ...input, slug: input.slug || slugify(input.name) })
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/brands");
  return { ok: true as const };
}

export async function deleteBrand(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { count } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", id);

  if (count && count > 0) {
    return {
      ok: false as const,
      error: `${count} product(s) still use this brand. Reassign or delete them first.`,
    };
  }

  const { error } = await admin.from("brands").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/brands");
  return { ok: true as const };
}

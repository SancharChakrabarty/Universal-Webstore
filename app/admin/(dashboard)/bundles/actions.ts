"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export type BundleInput = {
  name: string;
  description: string;
  image_url: string;
  bundle_price: number;
  is_active: boolean;
  product_ids: string[];
};

export async function createBundle(input: BundleInput) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { product_ids, ...bundle } = input;
  const { data, error } = await admin
    .from("bundles")
    .insert({ ...bundle, slug: slugify(bundle.name) })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };

  if (product_ids.length > 0) {
    await admin
      .from("bundle_products")
      .insert(product_ids.map((product_id) => ({ bundle_id: data.id, product_id })));
  }

  revalidatePath("/admin/bundles");
  return { ok: true as const };
}

export async function updateBundle(id: string, input: BundleInput) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { product_ids, ...bundle } = input;
  const { error } = await admin
    .from("bundles")
    .update({ ...bundle, slug: slugify(bundle.name) })
    .eq("id", id);

  if (error) return { ok: false as const, error: error.message };

  await admin.from("bundle_products").delete().eq("bundle_id", id);
  if (product_ids.length > 0) {
    await admin
      .from("bundle_products")
      .insert(product_ids.map((product_id) => ({ bundle_id: id, product_id })));
  }

  revalidatePath("/admin/bundles");
  return { ok: true as const };
}

export async function deleteBundle(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("bundles").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/bundles");
  return { ok: true as const };
}

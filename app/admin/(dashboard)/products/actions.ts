"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type ProductInput = {
  name: string;
  description: string;
  brand_id: string;
  flavor_id: string;
  strength_mg: number;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  status: "active" | "draft";
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  image_urls: string[];
  available_strengths: number[];
  available_flavors: string[];
  strength_images: Record<string, string>;
  price_3pack: number | null;
  price_5pack: number | null;
  price_10pack: number | null;
};

export async function createProduct(input: ProductInput) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("products").insert({
    ...input,
    slug: slugify(input.name),
  });

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/products");
  return { ok: true as const };
}

export async function updateProduct(id: string, input: ProductInput) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin
    .from("products")
    .update({ ...input, slug: slugify(input.name) })
    .eq("id", id);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/products");
  return { ok: true as const };
}

export async function deleteProduct(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/products");
  return { ok: true as const };
}

export async function toggleProductFlag(
  id: string,
  field: "is_featured" | "is_best_seller" | "is_new_arrival" | "is_on_sale",
  value: boolean
) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("products").update({ [field]: value }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/products");
  return { ok: true as const };
}

export async function bulkDeleteProducts(ids: string[]) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("products").delete().in("id", ids);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/products");
  return { ok: true as const };
}

export async function saveProductAndRedirect(
  input: ProductInput,
  id: string | null,
  addAnother: boolean
) {
  const result = id ? await updateProduct(id, input) : await createProduct(input);
  if (!result.ok) return result;

  if (addAnother) {
    redirect("/admin/products/new?saved=1");
  }
  redirect("/admin/products?saved=1");
}

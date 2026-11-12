"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function createFlavor(name: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("flavors").insert({ name, slug: slugify(name) });
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/flavors");
  return { ok: true as const };
}

export async function updateFlavor(id: string, name: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("flavors").update({ name, slug: slugify(name) }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/flavors");
  return { ok: true as const };
}

export async function deleteFlavor(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { count } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("flavor_id", id);

  if (count && count > 0) {
    return {
      ok: false as const,
      error: `${count} product(s) still use this flavor. Reassign or delete them first.`,
    };
  }

  const { error } = await admin.from("flavors").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/flavors");
  return { ok: true as const };
}

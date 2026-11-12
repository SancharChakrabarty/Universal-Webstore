"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const BUCKET = "product-images";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return { ok: false as const, error: "No file provided." };

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return { ok: false as const, error: "Supabase isn't configured yet." };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    cacheControl: "31536000",
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { ok: true as const, url: data.publicUrl };
}

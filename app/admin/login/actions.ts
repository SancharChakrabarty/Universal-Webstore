"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function verifyAdminLogin(userId: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return { ok: false, reason: "Service role key not configured." };
  }

  const { data: customer } = await admin
    .from("customers")
    .select("is_admin")
    .eq("id", userId)
    .single();

  if (!customer?.is_admin) {
    return { ok: false, reason: "This account doesn't have admin access." };
  }

  await admin.from("admin_activity_log").insert({
    admin_id: userId,
    action: "login",
  });

  return { ok: true };
}

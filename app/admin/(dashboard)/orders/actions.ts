"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Supabase isn't configured yet." };

  const { error } = await admin.from("orders").update({ status }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { ok: true as const };
}

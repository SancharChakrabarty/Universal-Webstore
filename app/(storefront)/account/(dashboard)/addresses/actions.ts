"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseActionClient } from "@/lib/supabase/action";

export type AddressInput = {
  id?: string;
  type: "billing" | "shipping";
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  phone?: string;
};

export async function saveAddress(input: AddressInput) {
  const supabase = getSupabaseActionClient();
  if (!supabase) return { ok: false, error: "Supabase isn't configured yet." };

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const payload = {
    customer_id: session.user.id,
    type: input.type,
    full_name: input.full_name,
    line1: input.line1,
    line2: input.line2 || null,
    city: input.city,
    state: input.state || null,
    postal_code: input.postal_code,
    country: input.country,
    phone: input.phone || null,
    is_default: true,
  };

  // One address per type per customer: replace the existing one (if any)
  // so "billing" and "shipping" always stay as exactly two separate entries.
  if (input.id) {
    const { error } = await supabase.from("addresses").update(payload).eq("id", input.id);
    if (error) return { ok: false, error: error.message };
  } else {
    await supabase
      .from("addresses")
      .delete()
      .eq("customer_id", session.user.id)
      .eq("type", input.type);
    const { error } = await supabase.from("addresses").insert(payload);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function deleteAddress(id: string) {
  const supabase = getSupabaseActionClient();
  if (!supabase) return { ok: false, error: "Supabase isn't configured yet." };

  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/account/addresses");
  return { ok: true };
}

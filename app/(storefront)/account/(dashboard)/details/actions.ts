"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseActionClient } from "@/lib/supabase/action";

export async function updateProfile(input: { full_name: string }) {
  const supabase = getSupabaseActionClient();
  if (!supabase) return { ok: false, error: "Supabase isn't configured yet." };

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: input.full_name },
  });
  if (authError) return { ok: false, error: authError.message };

  const { error: dbError } = await supabase
    .from("customers")
    .update({ full_name: input.full_name })
    .eq("id", session.user.id);
  if (dbError) return { ok: false, error: dbError.message };

  revalidatePath("/account/details");
  revalidatePath("/account");
  return { ok: true };
}

export async function updatePassword(newPassword: string) {
  const supabase = getSupabaseActionClient();
  if (!supabase) return { ok: false, error: "Supabase isn't configured yet." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

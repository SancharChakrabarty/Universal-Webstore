import "server-only";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseServerClient()!;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("full_name, email, is_admin")
    .eq("id", session.user.id)
    .single();

  if (!customer?.is_admin) {
    redirect("/admin/login?denied=1");
  }

  return {
    userId: session.user.id,
    email: customer.email ?? session.user.email ?? "",
    fullName: customer.full_name ?? "Admin",
  };
}

import { getSupabaseServerClient } from "@/lib/supabase/server";
import AccountDetailsForm from "@/components/account/AccountDetailsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account Details — My Account" };

export default async function AccountDetailsPage() {
  const supabase = getSupabaseServerClient()!;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let fullName = session!.user.user_metadata?.full_name ?? "";
  try {
    const { data } = await supabase
      .from("customers")
      .select("full_name")
      .eq("id", session!.user.id)
      .single();
    if (data?.full_name) fullName = data.full_name;
  } catch {
    // fall back to auth metadata above
  }

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-ink">Account Details</h2>
      <p className="mt-1 text-sm text-ink-soft">Update your profile and password.</p>
      <div className="mt-5 max-w-md">
        <AccountDetailsForm email={session!.user.email ?? ""} fullName={fullName} />
      </div>
    </div>
  );
}

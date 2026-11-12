import Link from "next/link";
import PageHeader from "@/components/shop/PageHeader";
import SupabaseSetupNotice from "@/components/account/SupabaseSetupNotice";
import AccountSidebar from "@/components/account/AccountSidebar";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AccountDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <PageHeader title="My Account" crumb="Account" />
        <div className="shell py-12">
          <SupabaseSetupNotice />
        </div>
      </>
    );
  }

  const supabase = getSupabaseServerClient()!;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <>
        <PageHeader title="My Account" crumb="Account" />
        <div className="shell flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm text-ink-soft">Sign in to view your account and order history.</p>
          <Link href="/account/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="My Account" crumb="Account" />
      <div className="shell flex flex-col gap-8 py-12 lg:flex-row">
        <AccountSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </>
  );
}

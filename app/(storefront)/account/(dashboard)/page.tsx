import Link from "next/link";
import { Package, MapPin, UserCog } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account — My Store" };

const quickLinks = [
  { label: "View Orders", href: "/account/orders", icon: Package },
  { label: "Manage Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Edit Account Details", href: "/account/details", icon: UserCog },
];

// Shown only when the signed-in customer has no real orders yet, so the
// dashboard never looks empty during a demo.
const sampleOrders = [
  { id: "demo-3a1f9c", status: "delivered", total: 34.97, created_at: "2026-06-12T00:00:00Z" },
  { id: "demo-7b2e41", status: "shipped", total: 19.98, created_at: "2026-06-22T00:00:00Z" },
];

export default async function AccountDashboardPage() {
  const supabase = getSupabaseServerClient()!;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let orders: { id: string; status: string; total: number; created_at: string }[] = [];
  try {
    const { data } = await supabase
      .from("orders")
      .select("id, status, total, created_at")
      .eq("customer_id", session!.user.id)
      .order("created_at", { ascending: false })
      .limit(3);
    orders = data ?? [];
  } catch {
    orders = [];
  }

  const isSample = orders.length === 0;
  const recentOrders = isSample ? sampleOrders : orders;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-lg font-bold text-ink">
          Welcome back{session!.user.user_metadata?.full_name ? `, ${session!.user.user_metadata.full_name}` : ""}
        </h2>
        <p className="text-sm text-ink-soft">{session!.user.email}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="card flex items-center gap-3 p-4 transition-colors hover:border-primary"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tint">
              <link.icon size={18} className="text-primary" />
            </span>
            <span className="text-sm font-semibold text-ink">{link.label}</span>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">Recent Orders</h3>
          <Link href="/account/orders" className="text-sm font-semibold text-primary">
            View all →
          </Link>
        </div>
        {isSample && (
          <p className="mt-1 text-xs text-ink-faint">
            Sample data shown — you haven&apos;t placed an order yet.
          </p>
        )}
        <div className="mt-4 overflow-x-auto rounded-card border border-line">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-xs uppercase text-ink-faint">
                <th className="px-4 py-2.5">Order</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3 font-medium text-ink">{o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-soft">{o.status}</td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">
                    ${o.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

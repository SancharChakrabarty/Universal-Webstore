import { Suspense } from "react";
import Link from "next/link";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import OrdersFilterBar from "@/components/admin/orders/OrdersFilterBar";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  pending: "bg-tint text-primary",
  processing: "bg-tint text-primary",
  shipped: "bg-line text-ink-soft",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-red-100 text-red-700",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to view orders.
      </div>
    );
  }

  let query = admin
    .from("orders")
    .select("id, status, total, created_at, customers(full_name, email)")
    .order("created_at", { ascending: false });

  if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  }

  const { data: orders } = await query;

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-ink">Orders</h1>

      <Suspense>
        <OrdersFilterBar />
      </Suspense>

      <div className="overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface text-xs uppercase text-ink-faint">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o: any) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-ink hover:text-primary">
                    #{o.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {o.customers?.full_name ?? o.customers?.email ?? "Guest"}
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-pill px-2 py-0.5 text-xs font-medium capitalize ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-ink">
                  ${o.total.toFixed(2)}
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-ink-faint">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

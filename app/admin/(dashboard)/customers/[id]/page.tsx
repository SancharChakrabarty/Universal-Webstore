import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to view this customer.
      </div>
    );
  }

  const [{ data: customer }, { data: orders }] = await Promise.all([
    admin.from("customers").select("*").eq("id", params.id).single(),
    admin
      .from("orders")
      .select("id, status, total, created_at")
      .eq("customer_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!customer) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-xl font-bold text-ink">{customer.full_name ?? customer.email}</h1>
      <p className="mt-1 text-sm text-ink-soft">{customer.email}</p>
      <p className="mt-1 text-xs text-ink-faint">
        Joined {new Date(customer.created_at).toLocaleDateString()}
      </p>

      <h3 className="mt-8 text-xs font-semibold uppercase text-ink-faint">Order History</h3>
      <div className="mt-3 overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface text-xs uppercase text-ink-faint">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-ink hover:text-primary">
                    #{o.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 capitalize text-ink-soft">{o.status}</td>
                <td className="px-4 py-3 text-right font-semibold text-ink">${o.total.toFixed(2)}</td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-ink-faint">
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

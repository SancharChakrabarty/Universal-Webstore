import Link from "next/link";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to view customers.
      </div>
    );
  }

  const { data: customers } = await admin
    .from("customers")
    .select("id, full_name, email, created_at")
    .order("created_at", { ascending: false });

  const { data: orders } = await admin.from("orders").select("customer_id, total");

  const stats = new Map<string, { count: number; spent: number }>();
  (orders ?? []).forEach((o) => {
    if (!o.customer_id) return;
    const prev = stats.get(o.customer_id) ?? { count: 0, spent: 0 };
    stats.set(o.customer_id, { count: prev.count + 1, spent: prev.spent + o.total });
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-ink">Customers</h1>

      <div className="overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface text-xs uppercase text-ink-faint">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Signed Up</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3 text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {(customers ?? []).map((c) => {
              const s = stats.get(c.id) ?? { count: 0, spent: 0 };
              return (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-medium text-ink hover:text-primary">
                      {c.full_name ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{c.email}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{s.count}</td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">
                    ${s.spent.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {(!customers || customers.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-ink-faint">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

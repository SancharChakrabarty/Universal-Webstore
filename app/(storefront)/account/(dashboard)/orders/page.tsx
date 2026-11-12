import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders — My Account" };

const sampleOrders = [
  { id: "demo-3a1f9c-aaaa", status: "delivered", total: 34.97, created_at: "2026-06-12T00:00:00Z" },
  { id: "demo-7b2e41-bbbb", status: "shipped", total: 19.98, created_at: "2026-06-22T00:00:00Z" },
  { id: "demo-9d4c20-cccc", status: "processing", total: 52.45, created_at: "2026-06-27T00:00:00Z" },
];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-slate-100 text-slate-600",
};

export default async function OrdersPage() {
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
      .order("created_at", { ascending: false });
    orders = data ?? [];
  } catch {
    orders = [];
  }

  const isSample = orders.length === 0;
  const list = isSample ? sampleOrders : orders;

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-ink">Order History</h2>
      {isSample && (
        <p className="mt-1 text-xs text-ink-faint">
          Sample data shown — you haven&apos;t placed an order yet.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {list.map((o) => (
          <div key={o.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-bold text-ink">#{o.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-ink-faint">{new Date(o.created_at).toLocaleDateString()}</p>
            </div>
            <span
              className={`rounded-pill px-3 py-1 text-xs font-semibold capitalize ${
                statusStyles[o.status] ?? "bg-tint text-ink-soft"
              }`}
            >
              {o.status}
            </span>
            <p className="text-sm font-semibold text-ink">${o.total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import DateRangeFilter from "@/components/admin/dashboard/DateRangeFilter";
import StatCard from "@/components/admin/dashboard/StatCard";
import { SalesLineChart, TopProductsBarChart } from "@/components/admin/dashboard/DashboardCharts";

export const dynamic = "force-dynamic";

function rangeStart(range: string): Date | null {
  const now = new Date();
  switch (range) {
    case "today": {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return null; // "all"
  }
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const range = searchParams.range ?? "30d";
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to see live dashboard data.
      </div>
    );
  }

  const start = rangeStart(range);

  let ordersQuery = admin
    .from("orders")
    .select("id, status, total, customer_id, created_at")
    .order("created_at", { ascending: true });
  if (start) ordersQuery = ordersQuery.gte("created_at", start.toISOString());

  const [{ data: orders }, { data: lowStockSetting }, { data: products }, { data: recentOrders }] =
    await Promise.all([
      ordersQuery,
      admin.from("site_settings").select("value").eq("key", "low_stock_threshold").single(),
      admin.from("products").select("id, name, stock_quantity, status"),
      admin
        .from("orders")
        .select("id, status, total, created_at, customers(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  const billableOrders = (orders ?? []).filter(
    (o) => o.status !== "cancelled" && o.status !== "refunded"
  );
  const totalSales = billableOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = billableOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Sales-over-time series (grouped by day)
  const byDay = new Map<string, number>();
  for (const o of billableOrders) {
    const day = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    byDay.set(day, (byDay.get(day) ?? 0) + o.total);
  }
  const salesSeries = Array.from(byDay.entries()).map(([date, revenue]) => ({ date, revenue }));

  // Top-selling products (by quantity) within the same order set
  const orderIds = billableOrders.map((o) => o.id);
  let topProducts: { name: string; quantity: number }[] = [];
  if (orderIds.length > 0) {
    const { data: items } = await admin
      .from("order_items")
      .select("quantity, products(name)")
      .in("order_id", orderIds);

    const qtyByProduct = new Map<string, number>();
    (items ?? []).forEach((item: any) => {
      const name = item.products?.name ?? "Deleted product";
      qtyByProduct.set(name, (qtyByProduct.get(name) ?? 0) + item.quantity);
    });
    topProducts = Array.from(qtyByProduct.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }

  const lowStockThreshold = lowStockSetting?.value ?? 20;
  const lowStockProducts = (products ?? []).filter(
    (p) => p.status === "active" && p.stock_quantity < lowStockThreshold
  );

  const statusColors: Record<string, string> = {
    pending: "bg-tint text-primary",
    processing: "bg-tint text-primary",
    shipped: "bg-line text-ink-soft",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold text-ink">Dashboard</h1>
        <Suspense>
          <DateRangeFilter />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Sales" value={`$${totalSales.toFixed(2)}`} />
        <StatCard label="Total Orders" value={String(totalOrders)} />
        <StatCard label="Average Order Value" value={`$${avgOrderValue.toFixed(2)}`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SalesLineChart data={salesSeries} />
        <TopProductsBarChart data={topProducts} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Low stock alerts */}
        <div className="card p-5">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
            <AlertTriangle size={15} className="text-red-500" /> Low Stock Alerts
          </h3>
          {lowStockProducts.length === 0 ? (
            <p className="mt-3 text-sm text-ink-faint">
              Nothing below the {lowStockThreshold}-unit threshold.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {lowStockProducts.slice(0, 8).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <Link href={`/admin/products/${p.id}`} className="text-ink hover:text-primary">
                    {p.name}
                  </Link>
                  <span className="font-semibold text-red-600">{p.stock_quantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent orders */}
        <div className="card p-5">
          <h3 className="font-display text-sm font-bold text-ink">Recent Orders</h3>
          <ul className="mt-3 divide-y divide-line">
            {(recentOrders ?? []).map((o: any) => (
              <li key={o.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-ink hover:text-primary">
                    #{o.id.slice(0, 8)}
                  </Link>
                  <p className="text-xs text-ink-faint">
                    {o.customers?.full_name ?? o.customers?.email ?? "Guest"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-pill px-2 py-0.5 text-xs font-medium capitalize ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                  <span className="font-semibold text-ink">${o.total.toFixed(2)}</span>
                </div>
              </li>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <li className="py-4 text-center text-sm text-ink-faint">No orders yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

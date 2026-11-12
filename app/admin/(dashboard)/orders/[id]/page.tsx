import { notFound } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import OrderStatusSelect from "@/components/admin/orders/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to view order details.
      </div>
    );
  }

  const [{ data: order }, { data: items }] = await Promise.all([
    admin
      .from("orders")
      .select("id, status, subtotal, shipping_cost, total, shipping_address, payment_status, created_at, customers(full_name, email)")
      .eq("id", params.id)
      .single(),
    admin
      .from("order_items")
      .select("id, quantity, unit_price, products(name)")
      .eq("order_id", params.id),
  ]);

  if (!order) notFound();
  const address = order.shipping_address as Record<string, string> | null;

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-ink">Order #{order.id.slice(0, 8)}</h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase text-ink-faint">Customer</p>
            <p className="mt-1 text-ink">
              {(order.customers as any)?.full_name ?? (order.customers as any)?.email ?? "Guest"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-ink-faint">Date</p>
            <p className="mt-1 text-ink">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-ink-faint">Payment Status</p>
            <p className="mt-1 capitalize text-ink">{order.payment_status}</p>
          </div>
          {address && (
            <div>
              <p className="text-xs uppercase text-ink-faint">Shipping Address</p>
              <p className="mt-1 text-ink">
                {address.address}, {address.city}, {address.state} {address.zip}
              </p>
            </div>
          )}
        </div>

        <h3 className="mt-6 text-xs font-semibold uppercase text-ink-faint">Items</h3>
        <ul className="mt-2 divide-y divide-line">
          {(items ?? []).map((item: any) => (
            <li key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-ink">
                {item.products?.name ?? "Deleted product"} × {item.quantity}
              </span>
              <span className="text-ink-soft">${(item.unit_price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col gap-1 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Shipping</span>
            <span>${order.shipping_cost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-display text-base font-bold text-ink">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

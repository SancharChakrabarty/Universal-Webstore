"use client";

import { useState, useTransition } from "react";
import { showToast } from "@/lib/admin/toast";
import { updateOrderStatus, OrderStatus } from "@/app/admin/(dashboard)/orders/actions";

const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  const handleChange = (next: OrderStatus) => {
    setValue(next);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, next);
      if (!result.ok) {
        setValue(status);
        showToast(result.error, "error");
      } else {
        showToast("Order status updated.");
      }
    });
  };

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className="rounded-pill border border-line px-3 py-2 text-sm capitalize outline-none focus:border-primary disabled:opacity-60"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

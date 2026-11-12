"use client";

import { useRouter, useSearchParams } from "next/navigation";

const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function OrdersFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status") ?? "all";

  const setStatus = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete("status");
    else next.set("status", value);
    router.push(`/admin/orders?${next.toString()}`);
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          className={`rounded-pill border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
            status === s
              ? "border-primary bg-primary text-white"
              : "border-line text-ink-soft hover:border-primary hover:text-primary"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

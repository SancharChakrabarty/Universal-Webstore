"use client";

import { useRouter, useSearchParams } from "next/navigation";

const ranges = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "all", label: "All Time" },
];

export default function DateRangeFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("range") ?? "30d";

  return (
    <div className="flex flex-wrap gap-2">
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => router.push(`/admin?range=${r.value}`)}
          className={`rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors ${
            current === r.value
              ? "border-primary bg-primary text-white"
              : "border-line text-ink-soft hover:border-primary hover:text-primary"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

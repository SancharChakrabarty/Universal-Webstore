"use client";

import { useState, useTransition } from "react";
import { showToast } from "@/lib/admin/toast";

export default function QuickToggle({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: (next: boolean) => Promise<{ ok: boolean; error?: string }>;
  label?: string;
}) {
  const [value, setValue] = useState(checked);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    const next = !value;
    setValue(next);
    startTransition(async () => {
      const result = await onToggle(next);
      if (!result.ok) {
        setValue(!next);
        showToast(result.error ?? "Failed to update.", "error");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={label}
      className={`relative inline-flex h-7 w-16 shrink-0 items-center rounded-full border-2 transition-colors duration-200 disabled:opacity-60 ${
        value ? "bg-[#015be8] border-[#015be8]" : "bg-gray-200 border-gray-200"
      }`}
    >
      <span
        className={`absolute text-[10px] font-bold select-none transition-opacity duration-200 ${
          value ? "left-2 text-white opacity-100" : "opacity-0"
        }`}
      >
        ON
      </span>
      <span
        className={`absolute text-[10px] font-bold select-none transition-opacity duration-200 ${
          !value ? "right-2 text-gray-400 opacity-100" : "opacity-0"
        }`}
      >
        OFF
      </span>
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
          value ? "translate-x-[34px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

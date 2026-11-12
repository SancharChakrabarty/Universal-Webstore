"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { showToast } from "@/lib/admin/toast";
import { updateStrengthRange } from "./actions";

type Range = { id: string; label: string; min_mg: number; max_mg: number; tile_image_url: string | null };

export default function StrengthRangesManager({ initial }: { initial: Range[] }) {
  const [ranges, setRanges] = useState(initial);

  return (
    <div className="flex flex-col gap-3">
      {ranges.map((r, idx) => (
        <RangeRow
          key={r.id}
          range={r}
          onChange={(updated) =>
            setRanges((rs) => rs.map((x, i) => (i === idx ? updated : x)))
          }
        />
      ))}
    </div>
  );
}

function RangeRow({ range, onChange }: { range: Range; onChange: (r: Range) => void }) {
  const [pending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      const result = await updateStrengthRange(range.id, {
        label: range.label,
        min_mg: range.min_mg,
        max_mg: range.max_mg,
        tile_image_url: range.tile_image_url,
      });
      if (!result.ok) return showToast(result.error, "error");
      showToast("Strength range updated.");
    });
  };

  return (
    <div className="card flex flex-wrap items-center gap-3 p-4">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-tint">
        {range.tile_image_url && (
          <Image src={range.tile_image_url} alt="" fill className="object-cover" />
        )}
      </div>
      <input
        value={range.label}
        onChange={(e) => onChange({ ...range, label: e.target.value })}
        className="w-28 rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary"
      />
      <input
        type="number"
        value={range.min_mg}
        onChange={(e) => onChange({ ...range, min_mg: Number(e.target.value) })}
        className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary"
      />
      <span className="text-ink-faint">to</span>
      <input
        type="number"
        value={range.max_mg}
        onChange={(e) => onChange({ ...range, max_mg: Number(e.target.value) })}
        className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary"
      />
      <button disabled={pending} onClick={save} className="btn-secondary ml-auto disabled:opacity-60">
        {pending ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

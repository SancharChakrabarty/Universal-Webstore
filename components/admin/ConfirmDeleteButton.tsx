"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { showToast } from "@/lib/admin/toast";

export default function ConfirmDeleteButton({
  itemLabel,
  onDelete,
}: {
  itemLabel: string;
  onDelete: () => Promise<{ ok: boolean; error?: string }>;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-ink-soft">Delete {itemLabel}?</span>
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await onDelete();
              if (result.ok) {
                showToast(`${itemLabel} deleted.`);
                router.refresh();
              } else {
                showToast(result.error ?? "Failed to delete.", "error");
                setConfirming(false);
              }
            })
          }
          className="font-semibold text-red-600 hover:underline disabled:opacity-60"
        >
          Yes
        </button>
        <button onClick={() => setConfirming(false)} className="text-ink-faint hover:underline">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={`Delete ${itemLabel}`}
      className="text-ink-faint hover:text-red-600"
    >
      <Trash2 size={15} />
    </button>
  );
}

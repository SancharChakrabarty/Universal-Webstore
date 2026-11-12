"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Check, X } from "lucide-react";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { showToast } from "@/lib/admin/toast";
import { createFlavor, updateFlavor, deleteFlavor } from "@/app/admin/(dashboard)/flavors/actions";

type Flavor = { id: string; name: string; count: number };

export default function FlavorsManager({ initial }: { initial: Flavor[] }) {
  const [flavors, setFlavors] = useState(initial);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [pending, startTransition] = useTransition();

  const handleAdd = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      const result = await createFlavor(newName.trim());
      if (!result.ok) return showToast(result.error, "error");
      showToast("Flavor added.");
      setFlavors((f) => [...f, { id: crypto.randomUUID(), name: newName.trim(), count: 0 }]);
      setNewName("");
    });
  };

  const handleRename = (id: string) => {
    startTransition(async () => {
      const result = await updateFlavor(id, editName.trim());
      if (!result.ok) return showToast(result.error, "error");
      showToast("Flavor updated.");
      setFlavors((f) => f.map((fl) => (fl.id === id ? { ...fl, name: editName.trim() } : fl)));
      setEditingId(null);
    });
  };

  return (
    <div>
      <div className="card mb-5 flex items-center gap-2 p-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New flavor name…"
          className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button disabled={pending} onClick={handleAdd} className="btn-primary disabled:opacity-60">
          <Plus size={15} /> Add
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {flavors.map((f) => (
          <div key={f.id} className="card flex items-center justify-between gap-2 px-4 py-3">
            {editingId === f.id ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename(f.id)}
                autoFocus
                className="flex-1 rounded border border-line px-2 py-1 text-sm outline-none focus:border-primary"
              />
            ) : (
              <div>
                <p className="text-sm font-medium text-ink">{f.name}</p>
                <p className="text-xs text-ink-faint">{f.count} products</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {editingId === f.id ? (
                <>
                  <button onClick={() => handleRename(f.id)} className="text-primary">
                    <Check size={15} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-ink-faint">
                    <X size={15} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(f.id);
                      setEditName(f.name);
                    }}
                    className="text-ink-faint hover:text-primary"
                  >
                    <Pencil size={14} />
                  </button>
                  <ConfirmDeleteButton
                    itemLabel={f.name}
                    onDelete={async () => {
                      const result = await deleteFlavor(f.id);
                      if (result.ok) setFlavors((fl) => fl.filter((x) => x.id !== f.id));
                      return result;
                    }}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

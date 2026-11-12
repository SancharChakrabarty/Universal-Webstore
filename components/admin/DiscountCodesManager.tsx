"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ToggleLeft, ToggleRight, Pencil, X, Check } from "lucide-react";
import { DiscountCode } from "@/lib/types";
import {
  createDiscountCode,
  deleteDiscountCode,
  toggleDiscountCode,
  updateDiscountCode,
  DiscountCodeInput,
} from "@/app/admin/(dashboard)/discount-codes/actions";
import { showToast } from "@/lib/admin/toast";

const emptyForm: DiscountCodeInput = {
  code: "",
  discount_type: "percent",
  discount_value: 10,
  expires_at: null,
  usage_limit: null,
  is_active: true,
};

export default function DiscountCodesManager({ initial }: { initial: DiscountCode[] }) {
  const [codes, setCodes] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DiscountCodeInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DiscountCodeInput>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const set = <K extends keyof DiscountCodeInput>(k: K, v: DiscountCodeInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setEdit = <K extends keyof DiscountCodeInput>(k: K, v: DiscountCodeInput[K]) =>
    setEditForm((f) => ({ ...f, [k]: v }));

  const handleCreate = () => {
    if (!form.code.trim()) return;
    startTransition(async () => {
      const res = await createDiscountCode(form);
      if (!res.ok) { showToast(res.error, "error"); return; }
      showToast("Code created.");
      setShowForm(false);
      setForm(emptyForm);
      router.refresh();
    });
  };

  const handleStartEdit = (c: DiscountCode) => {
    setEditingId(c.id);
    setEditForm({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      expires_at: c.expires_at,
      usage_limit: c.usage_limit,
      is_active: c.is_active,
    });
  };

  const handleSaveEdit = (id: string) => {
    startTransition(async () => {
      const res = await updateDiscountCode(id, editForm);
      if (!res.ok) { showToast(res.error, "error"); return; }
      setCodes((prev) => prev.map((c) => c.id === id ? { ...c, ...editForm } as DiscountCode : c));
      showToast("Code updated.");
      setEditingId(null);
    });
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleToggle = (code: DiscountCode) => {
    setCodes((prev) =>
      prev.map((c) => (c.id === code.id ? { ...c, is_active: !c.is_active } : c))
    );
    startTransition(async () => {
      const res = await toggleDiscountCode(code.id, !code.is_active);
      if (!res.ok) {
        setCodes((prev) =>
          prev.map((c) => (c.id === code.id ? { ...c, is_active: code.is_active } : c))
        );
        showToast(res.error ?? "Failed to update.", "error");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteDiscountCode(id);
      if (!res.ok) { showToast(res.error, "error"); return; }
      setCodes((prev) => prev.filter((c) => c.id !== id));
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Discount Codes</h2>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary gap-1.5">
          <Plus size={16} />
          New Code
        </button>
      </div>

      {showForm && (
        <div className="card flex flex-col gap-4 p-5">
          <h3 className="font-display text-sm font-bold text-ink">Create Code</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Code</label>
              <input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="e.g. WELCOME10" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm uppercase outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Type</label>
              <select value={form.discount_type} onChange={(e) => set("discount_type", e.target.value as "percent" | "fixed")} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Value ({form.discount_type === "percent" ? "%" : "$"})
              </label>
              <input type="number" step="0.01" value={form.discount_value} onChange={(e) => set("discount_value", Number(e.target.value))} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Expiry Date (optional)</label>
              <input type="date" value={form.expires_at?.slice(0, 10) ?? ""} onChange={(e) => set("expires_at", e.target.value ? `${e.target.value}T23:59:59Z` : null)} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Usage Limit (optional)</label>
              <input type="number" value={form.usage_limit ?? ""} onChange={(e) => set("usage_limit", e.target.value === "" ? null : Number(e.target.value))} placeholder="Unlimited" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
                Active immediately
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={isPending} className="btn-primary disabled:opacity-60">
              {isPending ? "Creating…" : "Create Code"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm font-semibold text-ink-soft hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface text-xs uppercase text-ink-faint">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-faint">
                  No discount codes yet. Create one above.
                </td>
              </tr>
            )}
            {codes.map((c) =>
              editingId === c.id ? (
                // ── Edit row ──
                <tr key={c.id} className="border-b border-line bg-[#f8faff] last:border-0">
                  <td className="px-4 py-2">
                    <input
                      value={editForm.code ?? ""}
                      onChange={(e) => setEdit("code", e.target.value.toUpperCase())}
                      className="w-full rounded-lg border border-primary px-2 py-1.5 text-sm font-bold uppercase outline-none"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      <select
                        value={editForm.discount_type ?? "percent"}
                        onChange={(e) => setEdit("discount_type", e.target.value as "percent" | "fixed")}
                        className="rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary"
                      >
                        <option value="percent">%</option>
                        <option value="fixed">$</option>
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.discount_value ?? ""}
                        onChange={(e) => setEdit("discount_value", Number(e.target.value))}
                        className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-ink-soft">{c.usage_count}</td>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      value={editForm.expires_at?.slice(0, 10) ?? ""}
                      onChange={(e) => setEdit("expires_at", e.target.value ? `${e.target.value}T23:59:59Z` : null)}
                      className="rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={editForm.usage_limit ?? ""}
                      onChange={(e) => setEdit("usage_limit", e.target.value === "" ? null : Number(e.target.value))}
                      placeholder="No limit"
                      className="w-24 rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveEdit(c.id)}
                        disabled={isPending}
                        className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                      >
                        <Check size={13} /> Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-ink"
                      >
                        <X size={13} /> Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                // ── Normal row ──
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-bold text-ink">{c.code}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {c.discount_type === "percent" ? `${c.discount_value}%` : `$${c.discount_value}`}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {c.usage_count}{c.usage_limit !== null ? `/${c.usage_limit}` : ""}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(c)} className={`flex items-center gap-1 text-xs font-semibold ${c.is_active ? "text-green-700" : "text-ink-faint"}`}>
                      {c.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      {c.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleStartEdit(c)} className="text-ink-faint hover:text-primary">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} disabled={isPending} className="text-ink-faint hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

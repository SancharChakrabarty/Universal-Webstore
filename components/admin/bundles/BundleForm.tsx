"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { showToast } from "@/lib/admin/toast";
import { createBundle, updateBundle, deleteBundle, BundleInput } from "@/app/admin/(dashboard)/bundles/actions";

type ProductOption = { id: string; name: string; price: number };

export default function BundleForm({
  products,
  bundleId,
  initial,
}: {
  products: ProductOption[];
  bundleId?: string;
  initial?: BundleInput;
}) {
  const router = useRouter();
  const [form, setForm] = useState<BundleInput>(
    initial ?? {
      name: "",
      description: "",
      image_url: "",
      bundle_price: 0,
      is_active: true,
      product_ids: [],
    }
  );
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const selectedProducts = products.filter((p) => form.product_ids.includes(p.id));
  const separateTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const savings = Math.max(0, separateTotal - form.bundle_price);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => !form.product_ids.includes(p.id) && p.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, products, form.product_ids]);

  const addProduct = (id: string) => {
    setForm((f) => ({ ...f, product_ids: [...f.product_ids, id] }));
    setQuery("");
  };

  const removeProduct = (id: string) => {
    setForm((f) => ({ ...f, product_ids: f.product_ids.filter((p) => p !== id) }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = bundleId ? await updateBundle(bundleId, form) : await createBundle(form);
      if (!result.ok) return showToast(result.error, "error");
      showToast(bundleId ? "Bundle updated." : "Bundle created.");
      router.push("/admin/bundles");
    });
  };

  return (
    <div className="card flex max-w-2xl flex-col gap-5 p-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Description
        </label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Bundle Image
        </label>
        <div className="mt-2">
          <ImageUploader
            images={form.image_url ? [form.image_url] : []}
            onChange={(imgs) => setForm((f) => ({ ...f, image_url: imgs[0] ?? "" }))}
            multiple={false}
          />
        </div>
      </div>

      {/* Product search */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Products in Bundle
        </label>
        <div className="relative mt-2">
          <div className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
            <Search size={15} className="text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products to add…"
              className="flex-1 text-sm outline-none"
            />
          </div>
          {results.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-line bg-white shadow-lg">
              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addProduct(p.id)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-tint"
                >
                  {p.name}
                  <span className="text-ink-faint">${p.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <ul className="mt-3 flex flex-col gap-1.5">
          {selectedProducts.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-lg bg-tint px-3 py-2 text-sm"
            >
              {p.name}
              <div className="flex items-center gap-3">
                <span className="text-ink-faint">${p.price.toFixed(2)}</span>
                <button onClick={() => removeProduct(p.id)} aria-label="Remove">
                  <X size={14} className="text-ink-faint hover:text-red-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Bundle Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={form.bundle_price}
            onChange={(e) => setForm((f) => ({ ...f, bundle_price: Number(e.target.value) }))}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-end">
          <p className="text-sm text-ink-soft">
            Separate total: <strong>${separateTotal.toFixed(2)}</strong>
            <br />
            Customer saves: <strong className="text-primary">${savings.toFixed(2)}</strong>
          </p>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
        />
        Active (visible on storefront)
      </label>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <button disabled={pending} onClick={handleSave} className="btn-primary disabled:opacity-60">
          {pending ? "Saving…" : "Save"}
        </button>
        {bundleId && (
          <ConfirmDeleteButton
            itemLabel="this bundle"
            onDelete={async () => {
              const result = await deleteBundle(bundleId);
              if (result.ok) router.push("/admin/bundles");
              return result;
            }}
          />
        )}
      </div>
    </div>
  );
}

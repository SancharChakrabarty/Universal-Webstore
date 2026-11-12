"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import TagInput from "@/components/admin/TagInput";
import { showToast } from "@/lib/admin/toast";
import { createProduct, updateProduct, deleteProduct, ProductInput } from "@/app/admin/(dashboard)/products/actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { Trash2, ImagePlus, X } from "lucide-react";

type Option = { id: string; name: string };

const emptyInput: ProductInput = {
  name: "",
  description: "",
  brand_id: "",
  flavor_id: "",
  strength_mg: 6,
  price: 0,
  compare_at_price: null,
  stock_quantity: 0,
  status: "active",
  is_featured: false,
  is_best_seller: false,
  is_new_arrival: false,
  is_on_sale: false,
  image_urls: [],
  available_strengths: [],
  available_flavors: [],
  strength_images: {},
  price_3pack: null,
  price_5pack: null,
  price_10pack: null,
};

export default function ProductForm({
  brands,
  flavors,
  productId,
  initial,
}: {
  brands: Option[];
  flavors: Option[];
  productId?: string;
  initial?: ProductInput;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>(initial ?? emptyInput);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Strength rows: each row = { mg: number, imageUrl: string }
  const strengthRows = form.available_strengths.length > 0
    ? form.available_strengths.map((mg) => ({
        mg,
        imageUrl: form.strength_images[String(mg)] ?? "",
      }))
    : [{ mg: form.strength_mg, imageUrl: form.strength_images[String(form.strength_mg)] ?? "" }];

  const updateStrengthRow = (index: number, mg: number, imageUrl: string) => {
    const newStrengths = [...strengthRows];
    const oldMg = newStrengths[index].mg;
    newStrengths[index] = { mg, imageUrl };

    const updatedStrengths = newStrengths.map((r) => r.mg);
    const updatedImages: Record<string, string> = {};
    newStrengths.forEach((r) => {
      if (r.imageUrl) updatedImages[String(r.mg)] = r.imageUrl;
    });

    // Remove old key if mg changed
    if (oldMg !== mg) {
      delete updatedImages[String(oldMg)];
    }

    setForm((f) => ({
      ...f,
      available_strengths: updatedStrengths,
      strength_images: updatedImages,
    }));
  };

  const addStrengthRow = () => {
    const newMg = (strengthRows[strengthRows.length - 1]?.mg ?? form.strength_mg) + 2;
    setForm((f) => ({
      ...f,
      available_strengths: [...f.available_strengths, newMg],
    }));
  };

  const removeStrengthRow = (index: number) => {
    const mg = strengthRows[index].mg;
    const updatedImages = { ...form.strength_images };
    delete updatedImages[String(mg)];
    setForm((f) => ({
      ...f,
      available_strengths: f.available_strengths.filter((_, i) => i !== index),
      strength_images: updatedImages,
    }));
  };

  const handleSave = (addAnother: boolean) => {
    startTransition(async () => {
      const result = productId
        ? await updateProduct(productId, form)
        : await createProduct(form);
      if (!result.ok) { showToast(result.error, "error"); return; }
      showToast(productId ? "Product updated." : "Product created.");
      if (addAnother) setForm(emptyInput);
      else router.push("/admin/products");
    });
  };

  return (
    <div className="card flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Product Name</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Brand</label>
          <select value={form.brand_id} onChange={(e) => set("brand_id", e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary">
            <option value="">Select a brand</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Flavor</label>
          <select value={form.flavor_id} onChange={(e) => set("flavor_id", e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary">
            <option value="">Select a flavor</option>
            {flavors.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Base Strength (mg)</label>
          <input type="number" value={form.strength_mg} onChange={(e) => set("strength_mg", Number(e.target.value))} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Status</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value as "active" | "draft")} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Compare-at Price ($)</label>
          <input type="number" step="0.01" value={form.compare_at_price ?? ""} onChange={(e) => set("compare_at_price", e.target.value === "" ? null : Number(e.target.value))} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Stock Quantity</label>
          <input type="number" value={form.stock_quantity} onChange={(e) => set("stock_quantity", Number(e.target.value))} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
      </div>

      {/* Flags */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["is_featured", "is_best_seller", "is_new_arrival", "is_on_sale"] as const).map((key) => (
          <label key={key} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2.5 text-sm">
            <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} />
            {key.replace("is_", "").replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </label>
        ))}
      </div>

      {/* Cover images */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Product Images (default / fallback)</label>
        <div className="mt-2">
          <ImageUploader images={form.image_urls} onChange={(imgs) => set("image_urls", imgs)} />
        </div>
      </div>

      {/* Pack pricing */}
      <div className="border-t border-line pt-5">
        <h3 className="font-display text-sm font-bold text-ink">Pack Size Pricing</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Enter the <strong>total price</strong> for each pack size. Leave blank to auto-calculate at the 1-pack price × quantity (no discount).
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">1-Pack ($)</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => set("price", Number(e.target.value))} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          {(["price_3pack", "price_5pack", "price_10pack"] as const).map((field) => {
            const label = field.replace("price_", "").replace("pack", "-Pack");
            const size = parseInt(field.replace("price_", "").replace("pack", ""));
            return (
              <div key={field}>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label} ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form[field] ?? ""}
                  onChange={(e) => set(field, e.target.value === "" ? null : Number(e.target.value))}
                  placeholder={`Auto: $${(form.price * size).toFixed(2)}`}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Variant controls */}
      <div className="border-t border-line pt-5">
        <h3 className="font-display text-sm font-bold text-ink">Strength Variants & Images</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Add one row per strength option. Each strength can have its own product image — customers see it swap instantly when they click a different strength. Leave the image blank to fall back to the default cover image above.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {strengthRows.map((row, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-line p-3">
              {/* Strength mg input */}
              <div className="w-24 shrink-0">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Strength (mg)</label>
                <input
                  type="number"
                  value={row.mg}
                  onChange={(e) => updateStrengthRow(i, Number(e.target.value), row.imageUrl)}
                  className="mt-1 w-full rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Image preview thumbnail */}
              {row.imageUrl && (
                <div className="relative mt-5 h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-tint">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={row.imageUrl}
                    alt={`${row.mg}mg`}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}

              {/* Image URL + upload */}
              <div className="flex-1">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
                  Image for {row.mg}mg
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={row.imageUrl}
                    onChange={(e) => updateStrengthRow(i, row.mg, e.target.value)}
                    placeholder="Paste URL or upload →"
                    className="flex-1 rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                  <ImageUploader
                    images={row.imageUrl ? [row.imageUrl] : []}
                    onChange={(imgs) => updateStrengthRow(i, row.mg, imgs[0] ?? "")}
                    compact
                  />
                  {row.imageUrl && (
                    <button
                      type="button"
                      onClick={() => updateStrengthRow(i, row.mg, "")}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink-faint hover:border-red-300 hover:text-red-500"
                      title="Clear image"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {!row.imageUrl && (
                  <p className="mt-1 text-[10px] text-ink-faint">
                    Falls back to the default cover image if left blank.
                  </p>
                )}
              </div>

              {/* Remove row */}
              {strengthRows.length > 1 && (
                <button type="button" onClick={() => removeStrengthRow(i)} className="mt-5 text-ink-faint hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addStrengthRow} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            <ImagePlus size={14} /> Add strength variant
          </button>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Available Flavors</label>
          <div className="mt-1">
            <TagInput tags={form.available_flavors} onChange={(tags) => set("available_flavors", tags as string[])} placeholder="Type a flavor, press Enter…" />
          </div>
          <p className="mt-1 text-xs text-ink-faint">Leave empty for no flavor selector. Add 2+ to show flavor pills.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <div className="flex gap-3">
          <button disabled={pending} onClick={() => handleSave(false)} className="btn-primary disabled:opacity-60">
            {pending ? "Saving…" : "Save"}
          </button>
          {!productId && (
            <button disabled={pending} onClick={() => handleSave(true)} className="btn-secondary disabled:opacity-60">
              Save & Add Another
            </button>
          )}
        </div>
        {productId && (
          <ConfirmDeleteButton
            itemLabel="this product"
            onDelete={async () => {
              const result = await deleteProduct(productId);
              if (result.ok) router.push("/admin/products");
              return result;
            }}
          />
        )}
      </div>
    </div>
  );
}

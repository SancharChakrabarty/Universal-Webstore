"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { showToast } from "@/lib/admin/toast";
import { createBrand, updateBrand, deleteBrand, BrandInput } from "@/app/admin/(dashboard)/brands/actions";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BrandForm({
  brandId,
  initial,
}: {
  brandId?: string;
  initial?: BrandInput;
}) {
  const router = useRouter();
  const [form, setForm] = useState<BrandInput>(
    initial ?? { name: "", slug: "", description: "", logo_url: "" }
  );
  const [pending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = brandId ? await updateBrand(brandId, form) : await createBrand(form);
      if (!result.ok) {
        showToast(result.error, "error");
        return;
      }
      showToast(brandId ? "Brand updated." : "Brand created.");
      router.push("/admin/brands");
    });
  };

  return (
    <div className="card flex max-w-lg flex-col gap-4 p-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Name</label>
        <input
          value={form.name}
          onChange={(e) =>
            setForm((f) => ({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) }))
          }
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Slug</label>
        <input
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Description
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Logo</label>
        <div className="mt-2">
          <ImageUploader
            images={form.logo_url ? [form.logo_url] : []}
            onChange={(imgs) => setForm((f) => ({ ...f, logo_url: imgs[0] ?? "" }))}
            multiple={false}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <button disabled={pending} onClick={handleSave} className="btn-primary disabled:opacity-60">
          {pending ? "Saving…" : "Save"}
        </button>

        {brandId && (
          <ConfirmDeleteButton
            itemLabel="this brand"
            onDelete={async () => {
              const result = await deleteBrand(brandId);
              if (result.ok) router.push("/admin/brands");
              return result;
            }}
          />
        )}
      </div>
    </div>
  );
}

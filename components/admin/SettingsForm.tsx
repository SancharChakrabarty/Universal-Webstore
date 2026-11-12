"use client";

import { useState, useTransition } from "react";
import { showToast } from "@/lib/admin/toast";
import { saveSettings } from "@/app/admin/(dashboard)/settings/actions";

type SettingsValues = {
  announcement_text: string;
  free_shipping_threshold: number;
  hero_heading: string;
  hero_subheading: string;
  low_stock_threshold: number;
  contact_email: string;
  social_links: { instagram: string; tiktok: string };
};

export default function SettingsForm({ initial }: { initial: SettingsValues }) {
  const [form, setForm] = useState(initial);
  const [pending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSettings({
        announcement_text: form.announcement_text,
        free_shipping_threshold: form.free_shipping_threshold,
        hero_heading: form.hero_heading,
        hero_subheading: form.hero_subheading,
        low_stock_threshold: form.low_stock_threshold,
        contact_email: form.contact_email,
        social_links: form.social_links,
      });
      if (!result.ok) return showToast(result.error, "error");
      showToast("Settings saved.");
    });
  };

  return (
    <div className="card flex max-w-2xl flex-col gap-5 p-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Announcement Bar Text
        </label>
        <input
          value={form.announcement_text}
          onChange={(e) => setForm((f) => ({ ...f, announcement_text: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Free Shipping Threshold ($)
          </label>
          <input
            type="number"
            value={form.free_shipping_threshold}
            onChange={(e) => setForm((f) => ({ ...f, free_shipping_threshold: Number(e.target.value) }))}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Low Stock Threshold
          </label>
          <input
            type="number"
            value={form.low_stock_threshold}
            onChange={(e) => setForm((f) => ({ ...f, low_stock_threshold: Number(e.target.value) }))}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Hero Heading
        </label>
        <input
          value={form.hero_heading}
          onChange={(e) => setForm((f) => ({ ...f, hero_heading: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Hero Subheading
        </label>
        <input
          value={form.hero_subheading}
          onChange={(e) => setForm((f) => ({ ...f, hero_subheading: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Contact Email
        </label>
        <input
          value={form.contact_email}
          onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Instagram URL
          </label>
          <input
            value={form.social_links.instagram}
            onChange={(e) =>
              setForm((f) => ({ ...f, social_links: { ...f.social_links, instagram: e.target.value } }))
            }
            className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            TikTok URL
          </label>
          <input
            value={form.social_links.tiktok}
            onChange={(e) =>
              setForm((f) => ({ ...f, social_links: { ...f.social_links, tiktok: e.target.value } }))
            }
            className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <button disabled={pending} onClick={handleSave} className="btn-primary self-start disabled:opacity-60">
        {pending ? "Saving…" : "Save Settings"}
      </button>
    </div>
  );
}

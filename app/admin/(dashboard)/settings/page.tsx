import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import SettingsForm from "@/components/admin/SettingsForm";
import HeroImagesManager from "./HeroImagesManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to manage settings.
      </div>
    );
  }

  const [{ data: settingsRows }, { data: heroImages }] = await Promise.all([
    admin.from("site_settings").select("key, value"),
    admin.from("hero_images").select("id, image_url").order("sort_order"),
  ]);

  const settings: Record<string, any> = {};
  (settingsRows ?? []).forEach((row) => {
    settings[row.key] = row.value;
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-6 font-display text-xl font-bold text-ink">Settings</h1>
        <SettingsForm
          initial={{
            announcement_text: settings.announcement_text ?? "",
            free_shipping_threshold: settings.free_shipping_threshold ?? 100,
            hero_heading: settings.hero_heading ?? "",
            hero_subheading: settings.hero_subheading ?? "",
            low_stock_threshold: settings.low_stock_threshold ?? 20,
            contact_email: settings.contact_email ?? "",
            social_links: settings.social_links ?? { instagram: "", tiktok: "" },
          }}
        />
      </div>

      <HeroImagesManager initial={heroImages ?? []} />
    </div>
  );
}

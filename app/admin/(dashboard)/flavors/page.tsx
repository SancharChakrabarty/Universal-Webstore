import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import FlavorsManager from "@/components/admin/FlavorsManager";

export const dynamic = "force-dynamic";

export default async function AdminFlavorsPage() {
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to manage flavors.
      </div>
    );
  }

  const { data: flavors } = await admin.from("flavors").select("id, name").order("name");
  const { data: products } = await admin.from("products").select("flavor_id");

  const counts = new Map<string, number>();
  (products ?? []).forEach((p) => {
    if (p.flavor_id) counts.set(p.flavor_id, (counts.get(p.flavor_id) ?? 0) + 1);
  });

  const initial = (flavors ?? []).map((f) => ({ id: f.id, name: f.name, count: counts.get(f.id) ?? 0 }));

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-ink">Flavors</h1>
      <FlavorsManager initial={initial} />
    </div>
  );
}

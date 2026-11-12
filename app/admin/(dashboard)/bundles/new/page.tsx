import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import BundleForm from "@/components/admin/bundles/BundleForm";

export const dynamic = "force-dynamic";

export default async function NewBundlePage() {
  const admin = getSupabaseAdminClient();
  let products: { id: string; name: string; price: number }[] = [];

  if (admin) {
    const { data } = await admin.from("products").select("id, name, price").order("name");
    products = data ?? [];
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-ink">Add Bundle</h1>
      {!admin ? (
        <div className="card p-6 text-sm text-ink-soft">
          Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to
          your environment variables to add bundles.
        </div>
      ) : (
        <BundleForm products={products} />
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import BundleForm from "@/components/admin/bundles/BundleForm";

export const dynamic = "force-dynamic";

export default async function EditBundlePage({ params }: { params: { id: string } }) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to edit bundles.
      </div>
    );
  }

  const [{ data: bundle }, { data: products }, { data: bundleProducts }] = await Promise.all([
    admin.from("bundles").select("*").eq("id", params.id).single(),
    admin.from("products").select("id, name, price").order("name"),
    admin.from("bundle_products").select("product_id").eq("bundle_id", params.id),
  ]);

  if (!bundle) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-ink">Edit Bundle</h1>
      <BundleForm
        products={products ?? []}
        bundleId={bundle.id}
        initial={{
          name: bundle.name,
          description: bundle.description ?? "",
          image_url: bundle.image_url ?? "",
          bundle_price: bundle.bundle_price,
          is_active: bundle.is_active,
          product_ids: (bundleProducts ?? []).map((bp) => bp.product_id),
        }}
      />
    </div>
  );
}

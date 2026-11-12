import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import ProductForm from "@/components/admin/products/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const admin = getSupabaseAdminClient();

  let brands: { id: string; name: string }[] = [];
  let flavors: { id: string; name: string }[] = [];

  if (admin) {
    const [{ data: b }, { data: f }] = await Promise.all([
      admin.from("brands").select("id, name").order("name"),
      admin.from("flavors").select("id, name").order("name"),
    ]);
    brands = b ?? [];
    flavors = f ?? [];
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-ink">Add Product</h1>
      {!admin ? (
        <div className="card p-6 text-sm text-ink-soft">
          Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to
          your environment variables to add products.
        </div>
      ) : (
        <ProductForm brands={brands} flavors={flavors} />
      )}
    </div>
  );
}

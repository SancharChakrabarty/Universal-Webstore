import Link from "next/link";
import { Plus } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import ProductsTable from "@/components/admin/products/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to manage products.
      </div>
    );
  }

  const { data, error } = await admin
    .from("products")
    .select(
      "id, name, slug, price, stock_quantity, status, strength_mg, is_featured, is_best_seller, is_new_arrival, is_on_sale, image_urls, brands(name), flavors(name)"
    )
    .order("created_at", { ascending: false });

  const rows = (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    stock_quantity: p.stock_quantity,
    status: p.status,
    strength_mg: p.strength_mg,
    is_featured: p.is_featured,
    is_best_seller: p.is_best_seller,
    is_new_arrival: p.is_new_arrival,
    is_on_sale: p.is_on_sale,
    image_urls: p.image_urls ?? [],
    brand_name: p.brands?.name ?? "—",
    flavor_name: p.flavors?.name ?? "—",
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-ink">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error.message}</p>}

      <ProductsTable rows={rows} />
    </div>
  );
}

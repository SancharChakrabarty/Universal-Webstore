import { notFound } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import ProductForm from "@/components/admin/products/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to edit products.
      </div>
    );
  }

  const [{ data: product }, { data: brands }, { data: flavors }] = await Promise.all([
    admin.from("products").select("*").eq("id", params.id).single(),
    admin.from("brands").select("id, name").order("name"),
    admin.from("flavors").select("id, name").order("name"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-ink">Edit Product</h1>
      <ProductForm
        brands={brands ?? []}
        flavors={flavors ?? []}
        productId={product.id}
        initial={{
          name: product.name,
          description: product.description ?? "",
          brand_id: product.brand_id ?? "",
          flavor_id: product.flavor_id ?? "",
          strength_mg: product.strength_mg,
          price: product.price,
          compare_at_price: product.compare_at_price,
          stock_quantity: product.stock_quantity,
          status: product.status,
          is_featured: product.is_featured,
          is_best_seller: product.is_best_seller,
          is_new_arrival: product.is_new_arrival,
          is_on_sale: product.is_on_sale,
          image_urls: product.image_urls ?? [],
          available_strengths: product.available_strengths ?? [],
          available_flavors: product.available_flavors ?? [],
          strength_images: product.strength_images ?? {},
          price_3pack: product.price_3pack ?? null,
          price_5pack: product.price_5pack ?? null,
          price_10pack: product.price_10pack ?? null,
        }}
      />
    </div>
  );
}

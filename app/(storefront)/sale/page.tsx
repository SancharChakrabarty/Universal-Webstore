import PageHeader from "@/components/shop/PageHeader";
import ProductFilterGrid from "@/components/shop/ProductFilterGrid";
import { getProductsDB, getBrandsDB, getFlavorsDB } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "On Sale — My Store" };

export default async function SalePage() {
  const [products, brands, flavors] = await Promise.all([getProductsDB(), getBrandsDB(), getFlavorsDB()]);
  const list = products.filter((p) => p.is_on_sale);
  const brandIds = new Set(list.map((p) => p.brand_id));
  const flavorIds = new Set(list.map((p) => p.flavor_id));
  return (
    <>
      <PageHeader title="On Sale" description="Limited-time deals on premium pouches." />
      <div className="shell py-12">
        <ProductFilterGrid products={list} brandOptions={brands.filter((b) => brandIds.has(b.id))} flavorOptions={flavors.filter((f) => flavorIds.has(f.id))} />
      </div>
    </>
  );
}

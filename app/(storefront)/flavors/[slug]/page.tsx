import { notFound } from "next/navigation";
import PageHeader from "@/components/shop/PageHeader";
import ProductFilterGrid from "@/components/shop/ProductFilterGrid";
import { getFlavorsDB, getProductsDB, getBrandsDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FlavorPage({ params }: { params: { slug: string } }) {
  const [flavors, products, brands] = await Promise.all([getFlavorsDB(), getProductsDB(), getBrandsDB()]);
  const flavor = flavors.find((f) => f.slug === params.slug);
  if (!flavor) notFound();
  const list = products.filter((p) => p.flavor_id === flavor.id);
  const brandIds = new Set(list.map((p) => p.brand_id));
  return (
    <>
      <PageHeader title={flavor.name} crumb={flavor.name} />
      <div className="shell py-12">
        <ProductFilterGrid products={list} brandOptions={brands.filter((b) => brandIds.has(b.id))} />
      </div>
    </>
  );
}

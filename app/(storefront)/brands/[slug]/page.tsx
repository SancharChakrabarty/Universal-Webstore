import { notFound } from "next/navigation";
import Image from "next/image";
import PageHeader from "@/components/shop/PageHeader";
import ProductFilterGrid from "@/components/shop/ProductFilterGrid";
import { getBrandsDB, getProductsDB, getFlavorsDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const [brands, products, flavors] = await Promise.all([
    getBrandsDB(),
    getProductsDB(),
    getFlavorsDB(),
  ]);

  const brand = brands.find((b) => b.slug === params.slug);
  if (!brand) notFound();

  const brandProducts = products.filter((p) => p.brand_id === brand.id);
  const flavorIds = new Set(brandProducts.map((p) => p.flavor_id));
  const brandFlavors = flavors.filter((f) => flavorIds.has(f.id));

  return (
    <>
      <PageHeader title={brand.name} description={brand.description} crumb={brand.name} />
      <div className="shell flex items-center gap-4 py-8">
        <Image src={brand.logo_url} alt={brand.name} width={64} height={64} className="h-14 w-14 object-contain" />
        <p className="max-w-xl text-sm text-ink-soft">{brand.description}</p>
      </div>
      <div className="shell pb-16">
        <ProductFilterGrid products={brandProducts} flavorOptions={brandFlavors} />
      </div>
    </>
  );
}

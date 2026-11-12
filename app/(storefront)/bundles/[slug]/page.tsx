import { notFound } from "next/navigation";
import Image from "next/image";
import PageHeader from "@/components/shop/PageHeader";
import ProductCard from "@/components/home/ProductCard";
import BundleAddToCart from "@/components/shop/BundleAddToCart";
import { getBundlesDB, getBundleBySlugDB, getProductsDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BundleDetailPage({ params }: { params: { slug: string } }) {
  const [bundle, products] = await Promise.all([getBundleBySlugDB(params.slug), getProductsDB()]);
  if (!bundle) notFound();
  const items = products.filter((p) => bundle.product_ids.includes(p.id));
  const separateTotal = items.reduce((sum, p) => sum + p.price, 0);
  const savings = Math.max(0, separateTotal - bundle.bundle_price);
  return (
    <>
      <PageHeader title={bundle.name} crumb={bundle.name} />
      <div className="shell grid gap-10 py-12 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-card bg-tint">
          {bundle.image_url && <Image src={bundle.image_url} alt={bundle.name} fill className="object-cover" />}
        </div>
        <div>
          <p className="text-sm text-ink-soft">{bundle.description}</p>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-ink">${bundle.bundle_price.toFixed(2)}</span>
            {savings > 0 && (
              <>
                <span className="text-base text-ink-faint line-through">${separateTotal.toFixed(2)}</span>
                <span className="rounded-pill bg-tint px-2.5 py-1 text-xs font-bold text-primary">Save ${savings.toFixed(2)}</span>
              </>
            )}
          </div>
          <BundleAddToCart productIds={bundle.product_ids} />
          <div className="mt-8">
            <h3 className="font-display text-sm font-bold text-ink">What&apos;s included</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {items.map((p) => (
                <li key={p.id} className="flex justify-between border-b border-line pb-2">
                  <span>{p.name}</span>
                  <span className="text-ink-faint">${p.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="shell pb-16">
        <h2 className="section-heading">Included Products</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </>
  );
}

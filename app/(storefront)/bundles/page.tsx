import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/shop/PageHeader";
import { getBundlesDB, getProductsDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BundlesPage() {
  const [bundles, products] = await Promise.all([getBundlesDB(), getProductsDB()]);
  return (
    <>
      <PageHeader title="Bundles" description="Save more when you mix and match your favorites." />
      <div className="shell py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => {
            const items = products.filter((p) => bundle.product_ids.includes(p.id));
            const total = items.reduce((s, p) => s + p.price, 0);
            const savings = Math.max(0, total - bundle.bundle_price);
            return (
              <Link key={bundle.id} href={`/bundles/${bundle.slug}`} className="card group overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-video w-full bg-tint">
                  {bundle.image_url && <Image src={bundle.image_url} alt={bundle.name} fill className="object-cover" />}
                </div>
                <div className="p-5">
                  <p className="font-display text-base font-bold text-ink group-hover:text-primary">{bundle.name}</p>
                  <p className="mt-1 text-xs text-ink-soft line-clamp-2">{bundle.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-bold text-ink">${bundle.bundle_price.toFixed(2)}</span>
                    {savings > 0 && <span className="rounded-pill bg-tint px-2 py-0.5 text-xs font-bold text-primary">Save ${savings.toFixed(2)}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

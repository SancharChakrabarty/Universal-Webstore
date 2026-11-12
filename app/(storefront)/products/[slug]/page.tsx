import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import ProductCard from "@/components/home/ProductCard";
import ProductPageClient from "@/components/shop/ProductPageClient";
import { getProductsDB, getProductBySlugDB, getBrandsDB, getFlavorsDB, getReviewsDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, brands, flavors, allProducts, reviews] = await Promise.all([
    getProductBySlugDB(params.slug),
    getBrandsDB(),
    getFlavorsDB(),
    getProductsDB(),
    getReviewsDB(),
  ]);

  if (!product) notFound();

  const brand = brands.find((b) => b.id === product.brand_id);
  const flavor = flavors.find((f) => f.id === product.flavor_id);
  const sameBrandProducts = allProducts.filter((p) => p.brand_id === product.brand_id && p.id !== product.id);
  const related = sameBrandProducts.slice(0, 4);
  const productReviews = reviews.filter((r) => r.product_id === product.id);

  return (
    <div className="shell py-10">
      <div className="flex items-center gap-1.5 text-xs text-ink-faint">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={12} />
        <Link href={`/brands/${brand?.slug}`} className="hover:text-primary">{brand?.name}</Link>
        <ChevronRight size={12} />
        <span className="text-ink-soft">{product.name}</span>
      </div>

      <div className="mt-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{brand?.name}</span>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">{product.name}</h1>
        {product.available_flavors.length <= 1 && (
          <span className="mt-1 block text-sm text-ink-soft">
            {(product.available_flavors[0] ?? flavor?.name)} flavor
          </span>
        )}
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{product.description}</p>
      </div>

      <ProductPageClient product={product} fallbackFlavorName={flavor?.name} brandName={brand?.name} />

      {productReviews.length > 0 && (
        <div className="mt-16 max-w-2xl">
          <h2 className="font-display text-xl font-bold text-ink">Customer Reviews</h2>
          <div className="mt-4 space-y-4">
            {productReviews.map((r) => (
              <div key={r.id} className="border-b border-line pb-4">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                  ))}
                </div>
                <p className="mt-1 text-sm text-ink-soft">&ldquo;{r.review_text}&rdquo;</p>
                <span className="mt-1 block text-xs font-semibold text-ink">{r.customer_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="section-heading">You May Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

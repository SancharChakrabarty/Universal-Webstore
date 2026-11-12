import PageHeader from "@/components/shop/PageHeader";
import ProductCard from "@/components/home/ProductCard";
import { getProductsDB, getBrandsDB, getFlavorsDB } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Search — My Store" };

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = (searchParams.q ?? "").trim();
  const q = query.toLowerCase();
  const [products, brands, flavors] = await Promise.all([getProductsDB(), getBrandsDB(), getFlavorsDB()]);

  const results = q
    ? products.filter((p) => {
        const brand = brands.find((b) => b.id === p.brand_id)?.name.toLowerCase() ?? "";
        const flavor = flavors.find((f) => f.id === p.flavor_id)?.name.toLowerCase() ?? "";
        return p.name.toLowerCase().includes(q) || brand.includes(q) || flavor.includes(q) || p.description.toLowerCase().includes(q);
      })
    : [];

  return (
    <>
      <PageHeader title={query ? `Results for "${query}"` : "Search"} description={`${results.length} product${results.length === 1 ? "" : "s"} found`} crumb="Search" />
      <div className="shell py-12">
        {results.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-soft">
            {query ? "No products matched your search. Try a different brand, flavor, or product name." : "Start typing in the search bar to find products."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
}

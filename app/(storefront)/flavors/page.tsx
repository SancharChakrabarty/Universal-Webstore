import Link from "next/link";
import PageHeader from "@/components/shop/PageHeader";
import { getFlavorsDB, getProductsDB } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Flavors — My Store" };

export default async function FlavorsPage() {
  const [flavors, products] = await Promise.all([getFlavorsDB(), getProductsDB()]);
  const usedFlavorIds = new Set(products.map((p) => p.flavor_id));
  const activeFlavors = flavors.filter((f) => usedFlavorIds.has(f.id));
  return (
    <>
      <PageHeader title="Shop by Flavor" description="Find your favorite flavor across every brand we carry." />
      <div className="shell py-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {activeFlavors.map((f) => (
            <Link key={f.id} href={`/flavors/${f.slug}`}
              className="card flex items-center justify-center p-4 text-center text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors">
              {f.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

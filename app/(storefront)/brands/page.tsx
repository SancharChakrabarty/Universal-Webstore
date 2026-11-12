import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/shop/PageHeader";
import { getBrandsDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await getBrandsDB();
  return (
    <>
      <PageHeader title="All Brands" crumb="Brands" />
      <div className="shell py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="card group flex items-center gap-4 p-5 transition-shadow hover:shadow-md"
            >
              <div className="relative h-14 w-14 shrink-0">
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-display text-base font-bold text-ink group-hover:text-primary">
                  {brand.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft line-clamp-2">{brand.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

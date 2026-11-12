import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductRow({
  heading,
  products,
  viewAllHref,
  bgColor,
}: {
  heading: string;
  products: Product[];
  viewAllHref?: string;
  bgColor?: string;
}) {
  return (
    <section className="py-12" style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <div className="shell flex items-end justify-between">
        <h2 className="section-heading">{heading}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden items-center gap-1 text-sm font-semibold text-primary sm:flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <div className="shell mt-6 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
        {products.map((p) => (
          <div key={p.id} className="w-[200px] shrink-0 sm:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {viewAllHref && (
        <div className="shell mt-6 sm:hidden">
          <Link href={viewAllHref} className="btn-secondary w-full">
            View all
          </Link>
        </div>
      )}
    </section>
  );
}

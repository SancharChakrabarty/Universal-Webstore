import Link from "next/link";
import Image from "next/image";
import { LayoutGrid } from "lucide-react";
import { brands } from "@/lib/data";

export default function BrandsMenu() {
  return (
    <div className="absolute left-0 top-full z-50 w-[460px] max-w-[48vw] pt-3">
      <div className="rounded-card border border-line bg-white p-5 shadow-xl">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          All Brands
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Link
            href="/brands"
            className="flex flex-col items-center gap-2 rounded-xl bg-[#f0f4f9] px-3 py-4 text-center transition-colors hover:bg-line/60"
          >
            <span className="flex h-14 w-14 items-center justify-center">
              <LayoutGrid size={30} className="text-ink-soft" />
            </span>
            <span className="text-xs font-medium leading-tight text-ink-soft">All Brands</span>
          </Link>

          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/brands/${b.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl bg-[#f0f4f9] px-3 py-4 text-center transition-colors hover:bg-line/60"
            >
              <span className="flex h-14 w-14 items-center justify-center">
                <Image
                  src={b.logo_url}
                  alt={b.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </span>
              <span className="text-xs font-medium leading-tight text-ink-soft">{b.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

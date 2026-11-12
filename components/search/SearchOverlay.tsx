"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import { products, getBrand, getFlavor } from "@/lib/data";

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => {
        const brand = getBrand(p.brand_id)?.name.toLowerCase() ?? "";
        const flavor = getFlavor(p.flavor_id)?.name.toLowerCase() ?? "";
        return (
          p.name.toLowerCase().includes(q) ||
          brand.includes(q) ||
          flavor.includes(q)
        );
      })
      .slice(0, 6);
  }, [query]);

  if (!isOpen) return null;

  const goToFullResults = () => {
    if (query.trim().length === 0) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-20 w-full max-w-xl -translate-x-1/2 rounded-card bg-white p-5 shadow-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToFullResults();
          }}
          className="flex items-center gap-3 border-b border-line pb-3"
        >
          <Search size={18} className="text-ink-faint" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brands, flavors, products…"
            className="flex-1 text-sm outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Close search">
            <X size={18} className="text-ink-faint" />
          </button>
        </form>

        {results.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1">
            {results.map((p) => {
              const brand = getBrand(p.brand_id);
              const image = p.image_urls[0];
              return (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-tint"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-tint">
                      {image && <Image src={image} alt={p.name} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-ink">{p.name}</p>
                      <p className="text-xs text-ink-faint">{brand?.name}</p>
                    </div>
                    <span className="text-sm font-semibold text-ink">${p.price.toFixed(2)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {query.trim().length >= 2 && (
          <button
            onClick={goToFullResults}
            className="mt-3 w-full rounded-pill border border-line py-2 text-sm font-medium text-primary hover:bg-tint"
          >
            View all results for &ldquo;{query}&rdquo;
          </button>
        )}
      </div>
    </div>
  );
}

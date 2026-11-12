"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Product, Brand, Flavor } from "@/lib/types";
import ProductCard from "@/components/home/ProductCard";

type SortKey = "default" | "price-asc" | "price-desc" | "strength-asc" | "strength-desc";

export default function ProductFilterGrid({
  products,
  brandOptions,
  flavorOptions,
}: {
  products: Product[];
  /** Pass when the page should offer a brand filter (e.g. flavor pages, sale, new arrivals) */
  brandOptions?: Brand[];
  /** Pass when the page should offer a flavor filter (e.g. brand pages, sale, new arrivals) */
  flavorOptions?: Flavor[];
}) {
  const [sort, setSort] = useState<SortKey>("default");
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [flavorFilter, setFlavorFilter] = useState<string | null>(null);
  const [strengthFilter, setStrengthFilter] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const strengthBuckets = [
    { label: "3–6mg", test: (mg: number) => mg >= 3 && mg <= 6 },
    { label: "8–11mg", test: (mg: number) => mg >= 8 && mg <= 11 },
    { label: "12–15mg", test: (mg: number) => mg >= 12 && mg <= 15 },
    { label: "15–20mg", test: (mg: number) => mg >= 15 && mg <= 20 },
    { label: "20mg+", test: (mg: number) => mg >= 20 },
  ];

  const filtered = useMemo(() => {
    let list = [...products];
    if (brandFilter) list = list.filter((p) => p.brand_id === brandFilter);
    if (flavorFilter) list = list.filter((p) => p.flavor_id === flavorFilter);
    if (strengthFilter) {
      const bucket = strengthBuckets.find((b) => b.label === strengthFilter);
      if (bucket) list = list.filter((p) => bucket.test(p.strength_mg));
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "strength-asc":
        list.sort((a, b) => a.strength_mg - b.strength_mg);
        break;
      case "strength-desc":
        list.sort((a, b) => b.strength_mg - a.strength_mg);
        break;
    }
    return list;
  }, [products, brandFilter, flavorFilter, strengthFilter, sort]);

  const FilterControls = () => (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Strength
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {strengthBuckets.map((b) => (
            <button
              key={b.label}
              onClick={() => setStrengthFilter(strengthFilter === b.label ? null : b.label)}
              className={`rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors ${
                strengthFilter === b.label
                  ? "border-primary bg-primary text-white"
                  : "border-line text-ink-soft hover:border-primary hover:text-primary"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {brandOptions && brandOptions.length > 0 && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Brand
          </span>
          <div className="mt-2 flex flex-col gap-1">
            <button
              onClick={() => setBrandFilter(null)}
              className={`text-left text-sm ${!brandFilter ? "font-semibold text-primary" : "text-ink-soft"}`}
            >
              All brands
            </button>
            {brandOptions.map((b) => (
              <button
                key={b.id}
                onClick={() => setBrandFilter(b.id)}
                className={`text-left text-sm ${
                  brandFilter === b.id ? "font-semibold text-primary" : "text-ink-soft"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {flavorOptions && flavorOptions.length > 0 && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Flavor
          </span>
          <div className="mt-2 flex flex-col gap-1">
            <button
              onClick={() => setFlavorFilter(null)}
              className={`text-left text-sm ${!flavorFilter ? "font-semibold text-primary" : "text-ink-soft"}`}
            >
              All flavors
            </button>
            {flavorOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setFlavorFilter(f.id)}
                className={`text-left text-sm ${
                  flavorFilter === f.id ? "font-semibold text-primary" : "text-ink-soft"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
      {/* Desktop filters */}
      <aside className="hidden lg:block">
        <FilterControls />
      </aside>

      <div>
        {/* Toolbar */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-pill border border-line px-4 py-2 text-sm font-medium text-ink-soft lg:hidden"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          <span className="text-sm text-ink-faint">{filtered.length} products</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="ml-auto rounded-pill border border-line bg-white px-3 py-2 text-sm text-ink-soft outline-none focus:border-primary"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="strength-asc">Strength: Low to High</option>
            <option value="strength-desc">Strength: High to Low</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-soft">
            No products match those filters yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-card bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-base font-bold">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-sm text-primary">
                Done
              </button>
            </div>
            <FilterControls />
          </div>
        </div>
      )}
    </div>
  );
}

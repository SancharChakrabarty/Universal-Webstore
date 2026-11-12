"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown } from "lucide-react";
import QuickToggle from "@/components/admin/QuickToggle";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { toggleProductFlag, deleteProduct } from "@/app/admin/(dashboard)/products/actions";

type Row = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock_quantity: number;
  status: string;
  strength_mg: number;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  image_urls: string[];
  brand_name: string;
  flavor_name: string;
};

type SortKey = "is_featured" | "is_best_seller" | "is_new_arrival" | "is_on_sale" | null;

export default function ProductsTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);

  const toggleSort = (key: Exclude<SortKey, null>) => {
    setSortKey((prev) => (prev === key ? null : key));
  };

  const filtered = useMemo(() => {
    let result = rows;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.brand_name.toLowerCase().includes(q) ||
          r.flavor_name.toLowerCase().includes(q)
      );
    }
    if (sortKey) {
      result = [...result].sort((a, b) => (b[sortKey] ? 1 : 0) - (a[sortKey] ? 1 : 0));
    }
    return result;
  }, [rows, query, sortKey]);

  const sortableHeaders: { label: string; key: Exclude<SortKey, null> }[] = [
    { label: "Featured", key: "is_featured" },
    { label: "Best Seller", key: "is_best_seller" },
    { label: "New", key: "is_new_arrival" },
    { label: "Sale", key: "is_on_sale" },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 rounded-pill border border-line bg-white px-4 py-2">
        <Search size={15} className="text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="flex-1 text-sm outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface text-xs uppercase text-ink-faint">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Strength</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              {sortableHeaders.map(({ label, key }) => (
                <th key={key} className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort(key)}
                    className={`flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-primary ${
                      sortKey === key ? "text-primary" : ""
                    }`}
                  >
                    {label}
                    <ChevronDown
                      size={12}
                      className={`transition-transform ${sortKey === key ? "rotate-180 text-primary" : ""}`}
                    />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-tint">
                      {r.image_urls[0] && (
                        <Image src={r.image_urls[0]} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/admin/products/${r.id}`}
                        className="font-medium text-ink hover:text-primary"
                      >
                        {r.name}
                      </Link>
                      <p className="text-xs text-ink-faint">{r.flavor_name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{r.brand_name}</td>
                <td className="px-4 py-3 text-ink-soft">{r.strength_mg}mg</td>
                <td className="px-4 py-3 text-ink-soft">${r.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={r.stock_quantity < 20 ? "font-semibold text-red-600" : "text-ink-soft"}>
                    {r.stock_quantity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-pill px-2 py-0.5 text-xs font-medium ${
                      r.status === "active" ? "bg-tint text-primary" : "bg-line text-ink-faint"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                {(["is_featured", "is_best_seller", "is_new_arrival", "is_on_sale"] as const).map(
                  (field) => (
                    <td key={field} className="px-4 py-3">
                      <QuickToggle
                        checked={r[field]}
                        onToggle={(next) => toggleProductFlag(r.id, field, next)}
                      />
                    </td>
                  )
                )}
                <td className="px-4 py-3">
                  <ConfirmDeleteButton
                    itemLabel={r.name}
                    onDelete={() => deleteProduct(r.id)}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-sm text-ink-faint">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

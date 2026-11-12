"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";
import { getPackPrice, getPackSavings } from "@/lib/data";

const PACK_SIZES = [1, 3, 5, 10] as const;
type PackSize = (typeof PACK_SIZES)[number];

export default function ProductVariantSelector({
  product,
  fallbackFlavorName,
  brandName,
  onStrengthChange,
}: {
  product: Product;
  fallbackFlavorName?: string;
  brandName?: string;
  onStrengthChange?: (mg: number) => void;
}) {
  const { addItem } = useCart();

  const strengthOptions =
    product.available_strengths.length > 0 ? product.available_strengths : [product.strength_mg];
  const flavorOptions = product.available_flavors;
  const showFlavorSelector = flavorOptions.length > 1;

  const [strength, setStrength] = useState(strengthOptions[0]);
  const [flavor, setFlavor] = useState<string | null>(flavorOptions[0] ?? null);
  const [pack, setPack] = useState<PackSize>(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleStrengthChange = (mg: number) => {
    setStrength(mg);
    onStrengthChange?.(mg);
  };

  const displayedPrice = getPackPrice(product, pack);
  const savings = pack > 1 ? getPackSavings(product, pack as 3 | 5 | 10) : 0;

  const flavorLabel = showFlavorSelector ? flavor : (flavorOptions[0] ?? fallbackFlavorName);

  const handleAddToCart = () => {
    const variantKey = `${strength}|${flavor ?? "none"}|${pack}`;
    const variantLabel = [`${strength}mg`, flavorLabel, `${pack}-Pack`].filter(Boolean).join(" · ");
    const image =
      product.strength_images[String(strength)] || product.image_urls[0] || "";
    addItem(product.id, 1, {
      unitPrice: displayedPrice,
      variantLabel,
      variantKey,
      selectedStrength: strength,
      snapshot: {
        name: product.name,
        image,
        brandName: brandName ?? "",
        flavorName: flavorLabel ?? fallbackFlavorName ?? "",
      },
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div>
      {/* Live price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl font-bold text-ink">
          ${displayedPrice.toFixed(2)}
        </span>
        {pack === 1 && product.compare_at_price && (
          <span className="text-base text-ink-faint line-through">
            ${product.compare_at_price.toFixed(2)}
          </span>
        )}
        {savings > 0 && (
          <span className="rounded-pill bg-tint px-2.5 py-1 text-xs font-bold text-primary">
            Save {savings}% vs. single
          </span>
        )}
      </div>

      {/* Strength selector */}
      {strengthOptions.length > 1 && (
        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Strength
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {strengthOptions.map((mg) => (
              <button
                key={mg}
                onClick={() => handleStrengthChange(mg)}
                className={`rounded-pill border px-3 py-1.5 text-xs font-bold transition-colors ${
                  strength === mg
                    ? "border-primary bg-primary text-white"
                    : "border-line text-ink-soft hover:border-primary hover:text-primary"
                }`}
              >
                {mg}mg
              </button>
            ))}
          </div>
        </div>
      )}
      {strengthOptions.length === 1 && (
        <span className="mt-4 inline-block rounded-pill bg-tint px-3 py-1 text-xs font-bold text-primary">
          {strengthOptions[0]}mg
        </span>
      )}

      {/* Flavor selector */}
      {showFlavorSelector && (
        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Flavor
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {flavorOptions.map((f) => (
              <button
                key={f}
                onClick={() => setFlavor(f)}
                className={`rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors ${
                  flavor === f
                    ? "border-primary bg-primary text-white"
                    : "border-line text-ink-soft hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pack size selector */}
      <div className="mt-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Pack Size
        </span>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {PACK_SIZES.map((size) => {
            const price = getPackPrice(product, size);
            const hardcodedBadge: Record<number, string> = { 3: "-3%", 5: "-5%", 10: "-10%" };
            const badge = hardcodedBadge[size] ?? null;
            return (
              <button
                key={size}
                onClick={() => setPack(size)}
                className={`rounded-lg border px-2 py-3 text-center transition-colors ${
                  pack === size
                    ? "border-primary bg-tint"
                    : "border-line hover:border-primary"
                }`}
              >
                <span className="block text-sm font-bold text-ink">{size}-Pack</span>
                <span className="block text-xs text-ink-faint">${price.toFixed(2)}</span>
                {badge && (
                  <span className="mt-0.5 inline-block rounded bg-primary px-1 py-0.5 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={handleAddToCart} className="btn-primary mt-6 w-full">
        {justAdded ? "Added ✓" : `Add to Cart — $${displayedPrice.toFixed(2)}`}
      </button>

      <p className="mt-4 text-xs text-ink-faint">
        {product.stock_quantity > 0
          ? `In stock — ${product.stock_quantity} available`
          : "Currently out of stock"}
      </p>
    </div>
  );
}

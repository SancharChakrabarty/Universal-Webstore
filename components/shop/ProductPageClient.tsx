"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import ProductVariantSelector from "@/components/shop/ProductVariantSelector";

export default function ProductPageClient({
  product,
  fallbackFlavorName,
  brandName,
}: {
  product: Product;
  fallbackFlavorName?: string;
  brandName?: string;
}) {
  const initialStrength =
    product.available_strengths.length > 0
      ? product.available_strengths[0]
      : product.strength_mg;

  const [displayImage, setDisplayImage] = useState<string>(() => {
    const img = product.strength_images[String(initialStrength)];
    return img || product.image_urls[0] || "";
  });

  const [activeStrength, setActiveStrength] = useState(initialStrength);
  const [imageKey, setImageKey] = useState(0); // forces re-render for fade animation

  const handleStrengthChange = (mg: number) => {
    setActiveStrength(mg);
    const img = product.strength_images[String(mg)];
    const next = img || product.image_urls[0] || "";
    setDisplayImage(next);
    setImageKey((k) => k + 1);
  };

  // Build thumbnail list: strengths that have their own unique image
  const strengthsWithImages = product.available_strengths.filter(
    (mg) => product.strength_images[String(mg)]
  );
  const showThumbnails = strengthsWithImages.length > 1;

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-2">
      {/* Gallery — swaps based on selected strength */}
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-card bg-tint">
          {displayImage ? (
            <Image
              key={imageKey}
              src={displayImage}
              alt={`${product.name} — ${activeStrength}mg`}
              fill
              className="object-cover animate-fadeIn"
              priority
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-tint to-primary/20">
              <span className="font-display text-xl font-bold text-primary">{brandName}</span>
              <span className="text-sm text-ink-soft">{fallbackFlavorName}</span>
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-pill bg-primary px-3 py-1 text-xs font-bold text-white">
            {activeStrength}mg
          </span>
        </div>

        {/* Strength image thumbnails — only shown when multiple strengths have distinct images */}
        {showThumbnails && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.available_strengths.map((mg) => {
              const img = product.strength_images[String(mg)] || product.image_urls[0];
              if (!img) return null;
              const isActive = mg === activeStrength;
              return (
                <button
                  key={mg}
                  type="button"
                  onClick={() => handleStrengthChange(mg)}
                  className={`relative shrink-0 h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
                    isActive
                      ? "border-primary shadow-md"
                      : "border-line hover:border-primary/50"
                  }`}
                  aria-label={`View ${mg}mg`}
                  title={`${mg}mg`}
                >
                  <Image src={img} alt={`${mg}mg`} fill className="object-cover" />
                  <span
                    className={`absolute bottom-0 left-0 right-0 py-0.5 text-center text-[9px] font-bold ${
                      isActive ? "bg-primary text-white" : "bg-black/40 text-white"
                    }`}
                  >
                    {mg}mg
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Info + Variant selector */}
      <div>
        <ProductVariantSelector
          product={product}
          fallbackFlavorName={fallbackFlavorName}
          brandName={brandName}
          onStrengthChange={handleStrengthChange}
        />
      </div>
    </div>
  );
}

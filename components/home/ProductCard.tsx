"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Product } from "@/lib/types";
import { getBrand, getFlavor } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PACK_OPTIONS = [
  { qty: 1,  label: "1 Pack",  discount: null,   display: "1 Pack" },
  { qty: 3,  label: "3 Pack",  discount: "-3%",  display: "3 Pack  −3%" },
  { qty: 5,  label: "5 Pack",  discount: "-5%",  display: "5 Pack  −5%" },
  { qty: 10, label: "10 Pack", discount: "-10%", display: "10 Pack  −10%" },
];

export default function ProductCard({ product }: { product: Product }) {
  const brand   = getBrand(product.brand_id);
  const flavor  = getFlavor(product.flavor_id);
  const { addItem } = useCart();
  const image   = product.image_urls[0];
  const [selectedQty, setSelectedQty] = useState(1);

  const selectedOption = PACK_OPTIONS.find((o) => o.qty === selectedQty)!;

  const pctOff =
    product.is_on_sale && product.compare_at_price
      ? Math.round(100 - (product.price / product.compare_at_price) * 100)
      : null;

  // ── GSAP refs ──
  const cardRef    = useRef<HTMLDivElement>(null);
  const addBtnRef  = useRef<HTMLButtonElement>(null);

  // ── Scroll-triggered fade-up (mobile only, fires once) ──
  useEffect(() => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!cardRef.current) return;

    /*
     * Card enters from opacity:0, scale:0.98, y:18px.
     * "once: true" ensures the animation only fires the first time the card
     * enters the viewport — no re-replay on scroll-back.
     */
    const trigger = ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 92%",  // fire when top of card is 92% down viewport
      once: true,
      onEnter: () => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 18, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out" }
        );
      },
    });

    return () => {
      // Kill ScrollTrigger on unmount to prevent memory leaks
      trigger.kill();
    };
  }, []);

  // ── Touch/press scale feedback on "Add to Cart" (mobile only) ──
  const handleAddTouchStart = () => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!addBtnRef.current) return;
    /*
     * Quick scale-down on press — tactile feedback without visual noise.
     * 0.97 scale is subtle; anything below 0.95 feels cartoonish.
     */
    gsap.to(addBtnRef.current, { scale: 0.97, duration: 0.12, ease: "power2.in" });
  };

  const handleAddTouchEnd = () => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (!addBtnRef.current) return;
    // Spring back to 1 — slightly bouncy ease makes it feel alive
    gsap.to(addBtnRef.current, { scale: 1, duration: 0.28, ease: "back.out(2)" });
  };

  return (
    <div
      ref={cardRef}
      /*
       * opacity:0 initial state is set here only on mobile via JS in useEffect.
       * The inline style here is intentionally absent — GSAP sets it from 0 in
       * the ScrollTrigger callback so SSR/desktop sees opacity:1 by default.
       */
      className="card group flex w-full shrink-0 flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >

      {/* ── Product image ── */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative w-full bg-tint" style={{ aspectRatio: "1 / 1" }}>
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 280px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-tint to-primary/20 p-4 text-center">
              <span className="font-display text-sm font-bold text-primary">{brand?.name}</span>
              <span className="text-xs text-ink-soft">{flavor?.name}</span>
            </div>
          )}

          {/* Strength badge — top left */}
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white">
            {product.strength_mg}mg
          </span>

          {/* Sale badge — top right */}
          {pctOff && (
            <span className="absolute right-2 top-2 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">
              -{pctOff}%
            </span>
          )}
        </div>

        {/* ── Name + price block ── */}
        <div className="flex flex-col gap-0.5 px-3 pt-3 pb-1">
          <h3 className="font-display text-sm font-bold leading-snug text-ink line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-display text-base font-bold text-ink">
              ${product.price.toFixed(2)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-ink-faint line-through">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
            {selectedOption.discount && (
              <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                {selectedOption.discount}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ── Pack selector + Add to Cart ── */}
      <div className="flex flex-col gap-2 px-3 pb-3 pt-1 sm:flex-row sm:items-center sm:gap-2">

        {/* Dropdown */}
        <div className="relative w-full sm:flex-1">
          <select
            value={selectedQty}
            onChange={(e) => setSelectedQty(Number(e.target.value))}
            className="w-full appearance-none rounded-lg border border-line bg-white py-2.5 pl-3 pr-8 text-xs font-semibold text-ink outline-none focus:border-primary cursor-pointer"
          >
            {PACK_OPTIONS.map((opt) => (
              <option key={opt.qty} value={opt.qty}>
                {opt.display}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>

        {/*
         * Add to Cart button.
         * onTouchStart / onTouchEnd provide mobile press feedback.
         * This does NOT affect the desktop hover state at all.
         */}
        <button
          ref={addBtnRef}
          className="btn-primary w-full sm:w-auto sm:shrink-0 sm:px-3 sm:py-2 sm:text-xs"
          onTouchStart={handleAddTouchStart}
          onTouchEnd={handleAddTouchEnd}
          onClick={() =>
            addItem(product.id, selectedQty, {
              unitPrice: product.price,
              variantLabel: `${product.strength_mg}mg · ${flavor?.name ?? ""}`,
              snapshot: {
                name: product.name,
                image: image ?? "",
                brandName: brand?.name ?? "",
                flavorName: flavor?.name ?? "",
              },
            })
          }
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

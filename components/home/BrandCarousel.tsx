"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brands } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PER_PAGE = 4;

export default function BrandCarousel() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(brands.length / PER_PAGE);
  const visible = brands.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  // ── GSAP refs ──
  const sectionRef    = useRef<HTMLElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);
  const mobileGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Section header fades up
      if (headingRef.current) {
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              headingRef.current,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
          },
        });
      }

      /*
       * Mobile brand grid: all brand circles stagger in on scroll.
       * They start slightly scaled down (0.96) for a soft "pop" feel.
       * stagger: 0.06 s — tight enough to feel cohesive, spaced enough
       * to read as individual items.
       */
      if (mobileGridRef.current) {
        const tiles = mobileGridRef.current.querySelectorAll<HTMLElement>(".brand-tile");
        ScrollTrigger.create({
          trigger: mobileGridRef.current,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              tiles,
              { opacity: 0, y: 16, scale: 0.96 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.48,
                ease: "power2.out",
                stagger: 0.06,
              }
            );
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Touch press feedback for brand tiles (mobile only) ──
  const handleTilePress = (e: React.TouchEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /*
     * Gentle scale-down on press — 0.97 is the sweet spot:
     * visible enough to confirm the touch, subtle enough to feel premium.
     */
    gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1, ease: "power2.in" });
  };

  const handleTileRelease = (e: React.TouchEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "back.out(2)" });
  };

  return (
    <section ref={sectionRef} className="bg-[#f0f4f9] py-16">
      <div className="shell">
        {/* Header */}
        <div ref={headingRef} className="flex items-center justify-between mb-10">
          <h2 className="section-heading">Shop by Brand</h2>
          <Link
            href="/brands"
            className="text-xs font-semibold uppercase tracking-widest text-ink-soft hover:text-[#015be8] transition-colors"
          >
            All Brands →
          </Link>
        </div>

        {/* Desktop: arrow nav + grid (untouched) */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={prev}
            disabled={page === 0}
            aria-label="Previous brands"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white shadow-sm text-ink-soft transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex flex-1 justify-start gap-2">
            {visible.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group flex flex-col items-center gap-3"
                style={{ width: `calc(25% - 6px)` }}
              >
                <div
                  className="relative w-full rounded-2xl border border-[#e8ecf0] bg-white overflow-hidden shadow-sm transition-all group-hover:border-[#015be8] group-hover:shadow-md"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)", aspectRatio: "1 / 1" }}
                >
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    fill
                    className="object-contain p-5"
                    sizes="(min-width: 1024px) 22vw, 40vw"
                  />
                </div>
                <span className="text-center text-sm font-bold text-ink group-hover:text-[#015be8] transition-colors leading-tight">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={next}
            disabled={page >= totalPages - 1}
            aria-label="Next brands"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white shadow-sm text-ink-soft transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/*
         * Mobile: 2-column circle grid.
         * ref={mobileGridRef} so GSAP can stagger the tiles.
         * Each link gets "brand-tile" class (GSAP selector) and touch handlers.
         */}
        <div ref={mobileGridRef} className="sm:hidden grid grid-cols-2 gap-x-4 gap-y-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="brand-tile group flex flex-col items-center gap-2"
              onTouchStart={handleTilePress}
              onTouchEnd={handleTileRelease}
            >
              <div
                className="relative overflow-hidden rounded-full border border-[#e8ecf0] bg-white shadow-sm transition-all group-hover:border-[#015be8] group-hover:shadow-md"
                style={{
                  width: "148px",
                  height: "148px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}
              >
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  fill
                  className="object-contain p-4"
                  sizes="148px"
                />
              </div>
              <span className="text-center text-xs font-bold text-ink group-hover:text-[#015be8] transition-colors leading-tight">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Page dots (desktop only) */}
        {totalPages > 1 && (
          <div className="hidden sm:flex justify-center gap-1.5 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === page ? "w-5 bg-primary" : "w-1.5 bg-line"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

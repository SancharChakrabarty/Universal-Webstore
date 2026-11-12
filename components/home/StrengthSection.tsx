"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const tiles = [
  { id: "sr-1", label: "3–6 mg",   min: 3,  max: 6,  bg: "bg-strength-1", dark: false },
  { id: "sr-2", label: "8–11 mg",  min: 8,  max: 11, bg: "bg-strength-4", dark: true  },
  { id: "sr-3", label: "12–15 mg", min: 12, max: 15, bg: "bg-strength-5", dark: true  },
  { id: "sr-4", label: "15–20 mg", min: 15, max: 20, bg: "bg-strength-5", dark: true  },
  { id: "sr-5", label: "20–30 mg", min: 20, max: 30, bg: "bg-strength-6", dark: true  },
  { id: "sr-6", label: "30–50 mg", min: 30, max: 50, bg: "bg-strength-6", dark: true  },
];

export default function StrengthSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Heading fades up
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
       * Strength tiles stagger in.
       * 2-column grid, so pairs arrive together visually when stagger is tight.
       * scale: 0.97 → 1 gives the tiles a gentle "pop" on entry.
       */
      if (gridRef.current) {
        const tileEls = gridRef.current.querySelectorAll<HTMLElement>(".strength-tile");
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              tileEls,
              { opacity: 0, y: 14, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                ease: "power2.out",
                stagger: 0.07,
              }
            );
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Touch press feedback (mobile)
  const handleTilePress = (e: React.TouchEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1, ease: "power2.in" });
  };

  const handleTileRelease = (e: React.TouchEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    gsap.to(e.currentTarget, { scale: 1, duration: 0.28, ease: "back.out(2)" });
  };

  return (
    <section ref={sectionRef} className="py-16">
      <div className="shell">
        <h2 ref={headingRef} className="section-heading">Shop by Strength</h2>
        <p className="mt-2 text-ink-soft">
          Darker tones mean a stronger product hit — pick what fits your tolerance.
        </p>

        <div ref={gridRef} className="mt-8 grid grid-cols-2 gap-3">
          {tiles.map((s) => (
            <Link
              key={s.id}
              href={`/sale?strength=${s.min}-${s.max}`}
              className={`strength-tile flex aspect-[2/1] flex-col items-center justify-center rounded-card transition-transform hover:-translate-y-1 ${s.bg}`}
              onTouchStart={handleTilePress}
              onTouchEnd={handleTileRelease}
            >
              <span
                className={`font-display text-2xl font-bold sm:text-3xl ${
                  s.dark ? "text-white" : "text-ink"
                }`}
              >
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { siteSettings } from "@/lib/data";

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const bgImageRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const paraRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (bgImageRef.current) {
        gsap.fromTo(bgImageRef.current, { scale: 1.03 }, { scale: 1, duration: 1.4, ease: "power2.out" });
      }
      if (headingRef.current) {
        tl.fromTo(headingRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65 }, 0.1);
      }
      if (paraRef.current) {
        tl.fromTo(paraRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 }, "-=0.3");
      }
      if (ctaRef.current) {
        const btns = ctaRef.current.querySelectorAll("a");
        tl.fromTo(btns, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, "-=0.25");
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink py-14 lg:min-h-[640px] lg:py-20"
    >
      {/* Static image background — no video */}
      <div
        ref={bgImageRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/homepage/hero-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10,10,20,0.55)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div className="shell relative flex flex-col items-center text-center" style={{ zIndex: 3 }}>
        <h1
          ref={headingRef}
          className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {siteSettings.hero_heading}
        </h1>
        <p ref={paraRef} className="mt-5 max-w-md text-base text-white/70 sm:text-lg">
          {siteSettings.hero_subheading}
        </p>
        <div ref={ctaRef} className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/brands" className="btn-primary">
            Shop Now
          </Link>
          <Link
            href="/account/register"
            className="inline-flex items-center justify-center gap-2 rounded-pill border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}

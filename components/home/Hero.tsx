"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { siteSettings } from "@/lib/data";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── GSAP refs (mobile animations only) ──
  const sectionRef  = useRef<HTMLElement>(null);
  const bgImageRef  = useRef<HTMLDivElement>(null);  // poster background
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const paraRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);  // wrapper around both CTA buttons

  // ── iOS video autoplay (unchanged from original) ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      video.play().catch(() => {
        const onTouch = () => {
          video.play().catch(() => {});
          document.removeEventListener("touchstart", onTouch);
          document.removeEventListener("click", onTouch);
        };
        document.addEventListener("touchstart", onTouch, { once: true });
        document.addEventListener("click", onTouch, { once: true });
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("loadeddata", tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, []);

  // ── GSAP mobile entrance animations ──
  useEffect(() => {
    // Guard: only run on mobile breakpoints
    if (!window.matchMedia("(max-width: 768px)").matches) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /*
       * Background image scales from 1.03 → 1 over 1.2 s.
       * This gives a very subtle "zoom settle" effect as the hero loads.
       * Only transform (scale) is animated — no layout properties.
       */
      if (bgImageRef.current) {
        gsap.fromTo(
          bgImageRef.current,
          { scale: 1.03 },
          { scale: 1, duration: 1.4, ease: "power2.out" }
        );
      }

      /*
       * Heading: fades in and rises 20 px.
       * Duration 0.65 s — long enough to feel premium, short enough to feel snappy.
       */
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65 },
          0.1  // tiny delay so background has a head start
        );
      }

      /*
       * Paragraph fades in after heading, slightly shorter travel.
       */
      if (paraRef.current) {
        tl.fromTo(
          paraRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.3"  // overlaps heading by 0.3 s for a fluid sequence
        );
      }

      /*
       * CTA buttons stagger in. We target the two <a> children inside ctaRef.
       * stagger: 0.09 s — subtle, not mechanical.
       */
      if (ctaRef.current) {
        const btns = ctaRef.current.querySelectorAll("a");
        tl.fromTo(
          btns,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 },
          "-=0.25"
        );
      }
    }, sectionRef);

    // Cleanup: revert all tweens when component unmounts
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink py-14 lg:min-h-[640px] lg:py-20"
    >

      {/* Poster image — GSAP scales this on mobile for a subtle settle effect */}
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

      {/* Video background (desktop dominates; mobile gets the scale effect above) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/homepage/hero-banner.jpg"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
        }}
      >
        <source src="/videos/hero-bg.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

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
        {/*
         * headingRef, paraRef, ctaRef are GSAP animation targets.
         * Each starts with opacity:0 only on mobile (GSAP sets it in the animation).
         * On desktop these are never touched — no style override.
         */}
        <h1
          ref={headingRef}
          className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {siteSettings.hero_heading}
        </h1>
        <p
          ref={paraRef}
          className="mt-5 max-w-md text-base text-white/70 sm:text-lg"
        >
          {siteSettings.hero_subheading}
        </p>

        {/* ctaRef wraps both buttons so the stagger targets .querySelectorAll("a") */}
        <div
          ref={ctaRef}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href="/brands" className="btn-primary">
            Shop Now
          </Link>
          <Link
            href="/account/register"
            className="inline-flex items-center justify-center gap-2 rounded-pill border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
          >
            Join the Club
          </Link>
        </div>
      </div>
    </section>
  );
}

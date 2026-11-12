/**
 * useMobileGsap — shared GSAP context hook for mobile-only animations.
 *
 * Returns a { contextRef, isMobile } tuple.
 * - contextRef: attach to the root element of a component so gsap.context() can
 *   scope all selector-based tweens and auto-revert them on unmount.
 * - isMobile: true when viewport width ≤ 768 px at mount time.
 *
 * All animations in this project are guarded by `if (!isMobile) return;` so the
 * desktop experience is never touched.
 */
"use client";

import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useMobileGsap() {
  const contextRef = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    // Only activate on mobile breakpoints (≤ 768 px)
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(mobile);
  }, []);

  return { contextRef, isMobile };
}

export { gsap, ScrollTrigger };

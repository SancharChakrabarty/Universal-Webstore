"use client";

import { useRef, useEffect } from "react";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reviews } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Reviews() {
  const featured = reviews.filter((r) => r.is_featured);

  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Heading
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

      // Review cards stagger in — 0.1 s apart, noticeable but not mechanical
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>(".review-card");
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 18, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.52,
                ease: "power2.out",
                stagger: 0.1,
              }
            );
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#f0f4f9] py-16">
      <div className="shell">
        <h2 ref={headingRef} className="section-heading text-center">What Our Customers Say</h2>

        <div ref={gridRef} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => (
            <div key={r.id} className="review-card card flex flex-col gap-3 p-6">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < r.rating ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="text-sm text-ink-soft">&ldquo;{r.review_text}&rdquo;</p>
              <span className="text-xs font-semibold text-ink">{r.customer_name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

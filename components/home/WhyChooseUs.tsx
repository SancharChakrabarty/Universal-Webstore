"use client";

import { useRef, useEffect } from "react";
import { ShieldCheck, Truck, Layers, Lock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const items = [
  { icon: ShieldCheck, title: "Authentic European Brands", text: "Sourced directly from official distributors — never gray-market." },
  { icon: Truck, title: "Fast, Discreet Shipping", text: "Plain packaging, tracked door-to-door delivery." },
  { icon: Layers, title: "Wide Selection", text: "Dozens of flavors and strengths across 10+ brands." },
  { icon: Lock, title: "Secure Checkout & Easy Returns", text: "Encrypted payments and a no-hassle returns policy." },
];

export default function WhyChooseUs() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mobile-only + respect prefers-reduced-motion
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Section heading fades + slides up once
      if (headingRef.current) {
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              headingRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }
            );
          },
        });
      }

      // Cards stagger in as the grid enters the viewport
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll<HTMLElement>(".why-card");
        ScrollTrigger.create({
          trigger: cardsRef.current,
          start: "top 88%",
          once: true,
          onEnter: () => {
            /*
             * Each card fades up from opacity:0 scale:0.98 y:18px.
             * stagger: 0.1 s — slightly slower than product cards since these
             * are larger, more prominent blocks.
             */
            gsap.fromTo(
              cards,
              { opacity: 0, y: 18, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
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
        <h2 ref={headingRef} className="section-heading text-center">Why Choose Us?</h2>
        <div ref={cardsRef} className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            /*
             * "why-card" class is only used as a GSAP selector target.
             * It carries no styles — layout is still entirely Tailwind.
             */
            <div key={title} className="why-card card flex flex-col gap-3 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tint text-primary">
                <Icon size={20} />
              </div>
              <h3 className="font-display text-base font-bold text-ink">{title}</h3>
              <p className="text-sm text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

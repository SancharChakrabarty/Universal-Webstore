"use client";

import { useRef, useEffect } from "react";
import { PackageCheck, Warehouse, BadgeCheck, Home } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteSettings } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  { icon: PackageCheck, title: "Order placed", note: "Confirmed within minutes" },
  { icon: Warehouse, title: "Ships from EU warehouse", note: "Packed within 24 hours" },
  { icon: BadgeCheck, title: "Customs cleared", note: "Duties handled for you" },
  { icon: Home, title: "Delivered to your door", note: "3–4 business days" },
];

export default function ShippingSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const stepsRef    = useRef<HTMLDivElement>(null);
  const infoBarRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Heading fade-up
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

      /*
       * Step icons and text stagger in sequentially.
       * We target ".shipping-step" elements — 4 of them.
       * stagger: 0.08 s so they feel like a connected sequence, not isolated pops.
       */
      if (stepsRef.current) {
        const stepEls = stepsRef.current.querySelectorAll<HTMLElement>(".shipping-step");
        ScrollTrigger.create({
          trigger: stepsRef.current,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              stepEls,
              { opacity: 0, y: 16 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.08,
              }
            );
          },
        });
      }

      // Info bar at the bottom fades up after steps
      if (infoBarRef.current) {
        ScrollTrigger.create({
          trigger: infoBarRef.current,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              infoBarRef.current,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
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
        <span className="eyebrow">How it ships</span>
        <h2 ref={headingRef} className="mt-2 font-display text-3xl font-bold sm:text-4xl text-[#0d1526]">
          Sourced in Europe. Delivered to the USA.
        </h2>
        <p className="mt-3 max-w-xl text-[#555555]">
          We work directly with Europe&apos;s top product brands and ship
          every order fast and discreetly to your door.
        </p>

        {/* Route */}
        <div ref={stepsRef} className="relative mt-14">
          <div
            className="absolute left-0 right-0 top-7 hidden h-px sm:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(0,0,0,0.15) 0, rgba(0,0,0,0.15) 6px, transparent 6px, transparent 14px)",
            }}
          />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                /*
                 * "shipping-step" class is the GSAP selector target.
                 * It adds no styling — Tailwind handles layout.
                 */
                <div key={s.title} className="shipping-step relative flex flex-col items-center gap-3 text-center sm:items-center sm:text-center">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold text-[#0d1526]/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold sm:text-base text-[#0d1526]">{s.title}</h3>
                    <p className="mt-1 text-xs text-[#555555] sm:text-sm">{s.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          ref={infoBarRef}
          className="mt-12 flex flex-col gap-3 rounded-card border border-[#e8ecf0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-[#555555]">
            Estimated delivery: <strong className="text-[#0d1526]">3–4 business days</strong>
          </p>
          <p className="text-sm text-[#555555]">
            Free shipping on orders over{" "}
            <strong className="text-[#0d1526]">${siteSettings.free_shipping_threshold}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const faqs = [
  { q: "How long does shipping take?", a: "Most orders ship from our EU warehouse within 24 hours and arrive in the USA within 3–4 business days." },
  { q: "How much does shipping cost?", a: "Shipping is a flat rate, and free on all orders over $100." },
  { q: "How do you verify my age?", a: "We use third-party age verification at checkout. You must be 21 or older to purchase, and ID may be checked on delivery." },
  { q: "What's your returns policy?", a: "Unopened products can be returned within 14 days of delivery. See our Returns page for full details." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, Apple Pay, and Google Pay." },
  { q: "Are products legal in the USA?", a: "Yes — products are legal for sale to adults 21+ in the United States." },
  { q: "How do I use a product?", a: "Place one pouch between your gum and upper lip. Avoid swallowing product juices, and discard after use." },
  { q: "Do you ship internationally outside the USA?", a: "Currently we ship exclusively from top brands to addresses within the United States." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const listRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
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
       * FAQ rows stagger in from the bottom.
       * stagger: 0.06 s — tighter than cards since these are narrow list rows.
       */
      if (listRef.current) {
        const rows = listRef.current.querySelectorAll<HTMLElement>(".faq-row");
        ScrollTrigger.create({
          trigger: listRef.current,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              rows,
              { opacity: 0, y: 12 },
              {
                opacity: 1,
                y: 0,
                duration: 0.42,
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

  return (
    <section ref={sectionRef} className="py-16">
      <div className="shell max-w-3xl">
        <h2 ref={headingRef} className="section-heading text-center">Frequently Asked Questions</h2>

        <div ref={listRef} className="mt-8 divide-y divide-line border-t border-b border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              /* "faq-row" is the GSAP stagger target — no layout impact */
              <div key={f.q} className="faq-row">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-sm font-bold text-ink sm:text-base">{f.q}</span>
                  {isOpen ? (
                    <Minus size={18} className="shrink-0 text-primary" />
                  ) : (
                    <Plus size={18} className="shrink-0 text-primary" />
                  )}
                </button>
                {isOpen && <p className="pb-4 text-sm text-ink-soft">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

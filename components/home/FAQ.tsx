"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Most orders are processed within 1–2 business days. Standard delivery typically takes 3–7 business days depending on your location. Expedited options are available at checkout.",
  },
  {
    q: "How much does shipping cost?",
    a: "Shipping is calculated at checkout based on your location and chosen delivery method. Orders above the free shipping threshold qualify for complimentary standard delivery.",
  },
  {
    q: "What is your returns policy?",
    a: "Unopened and unused items can be returned within 14 days of delivery for a full refund. Please visit our Returns page for instructions on how to start a return.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards including Visa, Mastercard, and American Express.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships you will receive a confirmation email with a tracking number. You can also track your order anytime from the Track Order page.",
  },
  {
    q: "Can I modify or cancel my order?",
    a: "Orders can be modified or cancelled within 1 hour of placement. After that, they may already be in processing. Please contact us as soon as possible if you need to make a change.",
  },
  {
    q: "Are my payment details secure?",
    a: "Yes. All transactions are encrypted and processed securely. We do not store your full card details on our servers.",
  },
  {
    q: "How do I contact customer support?",
    a: "You can reach us through the Contact Us page. We aim to respond to all enquiries within 1 business day.",
  },
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
            gsap.fromTo(headingRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
          },
        });
      }
      if (listRef.current) {
        const rows = listRef.current.querySelectorAll<HTMLElement>(".faq-row");
        ScrollTrigger.create({
          trigger: listRef.current,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(rows, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.42, ease: "power2.out", stagger: 0.06 });
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
              <div key={f.q} className="faq-row">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-sm font-bold text-ink sm:text-base">{f.q}</span>
                  {isOpen ? <Minus size={18} className="shrink-0 text-primary" /> : <Plus size={18} className="shrink-0 text-primary" />}
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

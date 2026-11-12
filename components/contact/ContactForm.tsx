"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  // ── GSAP refs ──
  const formRef       = useRef<HTMLFormElement>(null);
  const submitBtnRef  = useRef<HTMLButtonElement>(null);
  const successRef    = useRef<HTMLDivElement>(null);

  // Guard: only animate on mobile
  const isMobileRef = useRef(false);
  useEffect(() => {
    isMobileRef.current = window.matchMedia("(max-width: 768px)").matches;
  }, []);

  // ── Success state entrance animation ──
  useEffect(() => {
    if (status !== "sent") return;
    if (!isMobileRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!successRef.current) return;

    /*
     * Success card scales in from 0.95 + fades.
     * Feels like a satisfying confirmation — not just a text swap.
     */
    gsap.fromTo(
      successRef.current,
      { opacity: 0, scale: 0.95, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" }
    );
  }, [status]);

  // ── Input focus: soft border highlight via GSAP (mobile only) ──
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isMobileRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /*
     * We animate a subtle translateY(-1px) — just enough to indicate focus
     * without touching any layout-breaking properties.
     * The CSS already handles border-color on focus; this adds a physical lift.
     */
    gsap.to(e.currentTarget, { y: -1, duration: 0.2, ease: "power2.out" });
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isMobileRef.current) return;
    gsap.to(e.currentTarget, { y: 0, duration: 0.2, ease: "power2.in" });
  }, []);

  // ── Submit button press feedback (mobile) ──
  const handleSubmitPress = () => {
    if (!isMobileRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!submitBtnRef.current) return;
    gsap.to(submitBtnRef.current, { scale: 0.97, duration: 0.1, ease: "power2.in" });
  };

  const handleSubmitRelease = () => {
    if (!isMobileRef.current) return;
    if (!submitBtnRef.current) return;
    gsap.to(submitBtnRef.current, { scale: 1, duration: 0.28, ease: "back.out(2)" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      /*
       * successRef is the GSAP target for the entrance animation.
       * The inline opacity:0 is the initial state before GSAP fires.
       */
      <div ref={successRef} className="card p-6 text-center" style={{ opacity: 0 }}>
        <h3 className="font-display text-base font-bold text-ink">Message sent</h3>
        <p className="mt-2 text-sm text-ink-soft">
          Thanks for reaching out — we&apos;ll get back to you within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
      {/*
       * Focus/blur handlers fire a 1px translateY shift on mobile — a minimal
       * micro-interaction that confirms focus without distracting the user.
       * Desktop relies solely on the CSS border-color transition (unchanged).
       */}
      <input
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
      <input
        required
        type="email"
        placeholder="Your email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
      <textarea
        required
        rows={5}
        placeholder="How can we help?"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong — please try again.</p>
      )}
      {/*
       * Submit button: press scale feedback (mobile) + loading state (unchanged).
       */}
      <button
        ref={submitBtnRef}
        type="submit"
        disabled={status === "loading"}
        className="btn-primary disabled:opacity-60"
        onTouchStart={handleSubmitPress}
        onTouchEnd={handleSubmitRelease}
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

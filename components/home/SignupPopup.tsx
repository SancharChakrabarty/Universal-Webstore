"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "pc_signup_popup_dismissed";

export default function SignupPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // Track whether this component is truly mounted and active
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      if (isMounted.current) setVisible(true);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem(STORAGE_KEY, "1");
    setSubmitted(true);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop — stopPropagation prevents click events leaking to elements beneath */}
      <div
        className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm"
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        aria-hidden="true"
      />

      {/* Modal — stopPropagation prevents clicks inside the modal from reaching the backdrop or anything below */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-heading"
        className="fixed left-1/2 top-1/2 z-[301] w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close popup"
          className="absolute right-4 top-4 rounded-full p-1 text-ink-faint hover:bg-tint hover:text-ink"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <span className="block text-4xl">🎉</span>
            <h2 className="mt-3 font-display text-xl font-bold text-ink">
              You&apos;re in!
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Check your inbox — your 10% discount code is on its way.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-ink-soft">Subscribe to our newsletter</p>
            <h2
              id="popup-heading"
              className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-[28px]"
            >
              GET <span className="font-extrabold text-primary">10% DISCOUNT</span> NOW
            </h2>

            <form onSubmit={handleSubmit} className="mt-6">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                aria-label="Email address"
                className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-sm text-ink outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="btn-primary mt-4 w-full uppercase tracking-wide"
              >
                Subscribe
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}



"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "my-store-age-verified";

export default function AgeGate() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setShow(false);
      return;
    }
    if (localStorage.getItem(STORAGE_KEY) !== "1") {
      setShow(true);
    }
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  const handleConfirm = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">

      {/* Card — white, rounded, centered, no logo, matches reference image exactly */}
      <div
        className="w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-2xl"
        style={{ textAlign: "center" }}
      >

        {/* Main message — same wording style as reference image */}
        <p className="text-base leading-relaxed text-ink" style={{ fontWeight: 400 }}>
          Are you 21+? All purchasers before order placement are digitally
          age-verified. In certain states, adult signature upon delivery will
          be required.
        </p>

        {/* Yes / No buttons side-by-side — outlined style like reference image */}
        <div className="mt-7 flex gap-4">
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg border border-line bg-white py-3 text-sm font-semibold text-ink transition-colors hover:bg-tint hover:border-primary"
          >
            Yes
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 rounded-lg border border-line bg-white py-3 text-sm font-semibold text-ink transition-colors hover:bg-tint hover:border-primary"
          >
            No
          </button>
        </div>

        {/* Legal footnote — small, centered, like reference image */}
        <p className="mt-5 text-xs leading-relaxed text-ink-faint">
          By entering this site you are agreeing to the{" "}
          <a href="/terms" className="underline hover:text-primary">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

const messages = [
  "🚚 Free shipping on all orders over $99",
  "⚡ Delivery within 3 days anywhere in US",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#015be8] py-2 text-center text-xs font-semibold tracking-wide text-white sm:text-sm overflow-hidden">
      <span
        style={{
          display: "inline-block",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {messages[index]}
      </span>
    </div>
  );
}

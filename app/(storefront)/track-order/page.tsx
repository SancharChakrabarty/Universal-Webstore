"use client";

import { useState } from "react";
import PageHeader from "@/components/shop/PageHeader";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <PageHeader title="Track Order" crumb="Track Order" />
      <div className="shell max-w-md py-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="card flex flex-col gap-4 p-6"
        >
          <input
            required
            placeholder="Order number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            required
            type="email"
            placeholder="Email used at checkout"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button type="submit" className="btn-primary">
            Track Order
          </button>
        </form>

        {submitted && (
          <p className="mt-4 text-center text-sm text-ink-soft">
            If <strong>{orderId}</strong> matches an order on <strong>{email}</strong>, tracking
            details will be sent to your inbox shortly.
          </p>
        )}
      </div>
    </>
  );
}

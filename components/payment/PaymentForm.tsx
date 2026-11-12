"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Lock, ShieldCheck } from "lucide-react";

interface Props {
  total: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
  returnUrl: string;
}

export default function PaymentForm({ total, onSuccess, returnUrl }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    // confirmPayment only reaches here on error
    // (on success Stripe redirects to return_url)
    if (error) {
      setErrorMsg(
        error.type === "card_error" || error.type === "validation_error"
          ? (error.message ?? "Payment failed.")
          : "An unexpected error occurred. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Stripe PaymentElement — auto-shows Apple Pay, Google Pay, card, etc. */}
      <PaymentElement
        options={{
          layout: {
            type: "accordion",
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: false,
          },
          wallets: {
            applePay: "never",
            googlePay: "never",
          },
          fields: {
            billingDetails: {
              name: "auto",
              email: "never",
            },
          },
        }}
      />

      {errorMsg && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="btn-primary w-full disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <Lock size={15} />
        {loading ? "Processing…" : `Pay $${total.toFixed(2)}`}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-ink-faint">
        <ShieldCheck size={14} />
        <span>Secured by Stripe · SSL encrypted</span>
      </div>
    </form>
  );
}


"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tag, CheckCircle, X, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { validateDiscountCode } from "./actions";
import { Product, Brand, SiteSettings } from "@/lib/types";
import dynamic from "next/dynamic";

// Dynamically import Stripe components (client-only)
const StripeProvider = dynamic(() => import("@/components/payment/StripeProvider"), {
  ssr: false,
});
const PaymentForm = dynamic(() => import("@/components/payment/PaymentForm"), {
  ssr: false,
});

type AppliedCode = {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
};

const PENDING_CODE_KEY = "pc_pending_promo";

export default function CheckoutClient({
  products,
  brands,
  siteSettings,
}: {
  products: Product[];
  brands: Brand[];
  siteSettings: SiteSettings;
}) {
  const router = useRouter();
  const { lines, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  // Promo code state
  const [codeInput, setCodeInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<AppliedCode | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isPendingCode, startCodeTransition] = useTransition();
  const [pendingBanner, setPendingBanner] = useState<string | null>(null);

  // Payment step state
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Auto-apply pending promo code
  useEffect(() => {
    const pending = localStorage.getItem(PENDING_CODE_KEY);
    if (pending && !appliedCode) {
      setPendingBanner(pending);
    }
  }, [appliedCode]);

  const applyPendingCode = () => {
    if (!pendingBanner) return;
    startCodeTransition(async () => {
      const result = await validateDiscountCode(pendingBanner);
      if (result.ok) {
        setAppliedCode({
          code: result.code,
          discountType: result.discountType,
          discountValue: result.discountValue,
        });
        localStorage.removeItem(PENDING_CODE_KEY);
        setPendingBanner(null);
      }
    });
  };

  const dismissBanner = () => {
    localStorage.removeItem(PENDING_CODE_KEY);
    setPendingBanner(null);
  };

  const freeShipping = subtotal >= siteSettings.free_shipping_threshold;
  const shippingCost = freeShipping ? 0 : 6.99;

  const discountAmount = appliedCode
    ? appliedCode.discountType === "percent"
      ? Math.round(subtotal * (appliedCode.discountValue / 100) * 100) / 100
      : Math.min(appliedCode.discountValue, subtotal)
    : 0;

  const total = subtotal - discountAmount + shippingCost;

  const handleApplyCode = () => {
    if (!codeInput.trim()) return;
    setCodeError(null);
    startCodeTransition(async () => {
      const result = await validateDiscountCode(codeInput);
      if (!result.ok) {
        setCodeError(result.error);
        return;
      }
      setAppliedCode({
        code: result.code,
        discountType: result.discountType,
        discountValue: result.discountValue,
      });
      setCodeInput("");
    });
  };

  const removeCode = () => {
    setAppliedCode(null);
    setCodeError(null);
  };

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  // Step 1: Collect shipping → create PaymentIntent → show payment step
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            variantLabel: l.variantLabel,
            name: products.find((p) => p.id === l.productId)?.name,
          })),
          shipping: form,
          discountCode: appliedCode?.code ?? null,
          discountAmount,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCheckoutError(data.error ?? "Something went wrong. Please try again.");
        setCheckoutLoading(false);
        return;
      }

      // Mock path (no Stripe key)
      if (data.mock) {
        clearCart();
        router.push(`/order-confirmation?order=${data.orderId}&total=${total.toFixed(2)}`);
        return;
      }

      // Real path — move to payment step
      setClientSecret(data.clientSecret);
      setStep("payment");
    } catch {
      setCheckoutError("Network error. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Called by PaymentForm on success (Stripe redirects to return_url)
  const handlePaymentSuccess = () => {
    clearCart();
  };

  const returnUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/order-confirmation`
      : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/order-confirmation`;

  if (lines.length === 0) {
    return (
      <div className="shell flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">
          Your cart is empty
        </h1>
        <p className="text-sm text-ink-soft">
          Add something to your cart before checking out.
        </p>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Checkout
      </h1>

      {/* Step indicator */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span
          className={
            step === "shipping"
              ? "font-semibold text-primary"
              : "text-ink-soft"
          }
        >
          1. Shipping
        </span>
        <span className="text-ink-faint">›</span>
        <span
          className={
            step === "payment"
              ? "font-semibold text-primary"
              : "text-ink-soft"
          }
        >
          2. Payment
        </span>
      </div>

      {/* Pending promo code banner */}
      {pendingBanner && !appliedCode && step === "shipping" && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
          <Sparkles size={18} className="shrink-0 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">
              You have a promo code:{" "}
              <span className="tracking-widest">{pendingBanner}</span>
            </p>
            <p className="text-xs text-ink-soft">
              Apply it now to save{" "}
              {pendingBanner === "WELCOME10" ? "10%" : "on"} this order.
            </p>
          </div>
          <button
            onClick={applyPendingCode}
            disabled={isPendingCode}
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {isPendingCode ? "Applying…" : "Apply"}
          </button>
          <button
            onClick={dismissBanner}
            className="text-ink-faint hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* ── Left column ── */}
        <div>
          {/* ── STEP 1: Shipping ── */}
          {step === "shipping" && (
            <form
              onSubmit={handleProceedToPayment}
              className="flex flex-col gap-5"
            >
              <h2 className="font-display text-base font-bold text-ink">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2"
                />
                <input
                  required
                  placeholder="Street address"
                  value={form.address}
                  onChange={handleChange("address")}
                  className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2"
                />
                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange("city")}
                  className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                <input
                  required
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange("state")}
                  className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                <input
                  required
                  placeholder="ZIP code"
                  value={form.zip}
                  onChange={handleChange("zip")}
                  className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2"
                />
              </div>

              {/* Promo code */}
              <div className="rounded-lg border border-line p-4">
                <p className="text-sm font-semibold text-ink">
                  Have a promo code?
                </p>
                {appliedCode ? (
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-green-600 shrink-0"
                    />
                    <span className="flex-1 font-semibold text-green-800">
                      {appliedCode.code} —{" "}
                      {appliedCode.discountType === "percent"
                        ? `${appliedCode.discountValue}% off`
                        : `$${appliedCode.discountValue} off`}{" "}
                      applied!
                    </span>
                    <button
                      type="button"
                      onClick={removeCode}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <input
                      value={codeInput}
                      onChange={(e) =>
                        setCodeInput(e.target.value.toUpperCase())
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleApplyCode())
                      }
                      placeholder="Enter promo code"
                      className="flex-1 rounded-lg border border-line px-3 py-2 text-sm uppercase outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCode}
                      disabled={isPendingCode || !codeInput.trim()}
                      className="flex items-center gap-1.5 rounded-lg bg-tint px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white disabled:opacity-50 transition-colors"
                    >
                      <Tag size={14} />
                      {isPendingCode ? "Checking…" : "Apply"}
                    </button>
                  </div>
                )}
                {codeError && (
                  <p className="mt-2 text-xs text-red-600">{codeError}</p>
                )}
              </div>

              {checkoutError && (
                <p className="text-sm text-red-600">{checkoutError}</p>
              )}

              <button
                type="submit"
                disabled={checkoutLoading}
                className="btn-primary mt-2 w-full disabled:opacity-60"
              >
                {checkoutLoading
                  ? "Preparing payment…"
                  : `Continue to Payment — $${total.toFixed(2)}`}
              </button>
            </form>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === "payment" && clientSecret && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep("shipping")}
                  className="text-sm text-primary hover:underline"
                >
                  ← Edit shipping
                </button>
              </div>

              {/* Shipping summary */}
              <div className="rounded-lg border border-line bg-surface p-4 text-sm text-ink-soft">
                <p className="font-semibold text-ink">{form.name}</p>
                <p>{form.address}, {form.city}, {form.state} {form.zip}</p>
                <p>{form.email}</p>
              </div>

              <h2 className="font-display text-base font-bold text-ink">
                Payment
              </h2>
<StripeProvider clientSecret={clientSecret}>
                <PaymentForm
                  total={total}
                  returnUrl={returnUrl}
                  onSuccess={handlePaymentSuccess}
                  onError={(msg) => setCheckoutError(msg)}
                />
              </StripeProvider>
            </div>
          )}
        </div>

        {/* ── Order summary sidebar ── */}
        <div className="h-fit rounded-card border border-line p-6">
          <h2 className="font-display text-base font-bold text-ink">
            Order Summary
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {lines.map((line) => {
              const product = products.find((p) => p.id === line.productId);
              if (!product) return null;
              const brand = brands.find((b) => b.id === product.brand_id);
              const image =
                product.strength_images[
                  String(line.selectedStrength ?? product.strength_mg)
                ] || product.image_urls[0];
              return (
                <li key={line.lineId} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-tint">
                    {image && (
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-ink">{product.name}</p>
                    <p className="text-xs text-ink-faint">
                      {brand?.name} · Qty {line.quantity}
                    </p>
                    {line.variantLabel && (
                      <p className="text-xs text-ink-faint">
                        {line.variantLabel}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-ink">
                    ${((line.unitPrice ?? product.price) * line.quantity).toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 space-y-2 border-t border-line pt-4">
            <div className="flex justify-between text-sm text-ink-soft">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedCode && (
              <div className="flex justify-between text-sm font-semibold text-green-700">
                <span>Promo {appliedCode.code}</span>
                <span>−${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-ink-soft">
              <span>Shipping</span>
              <span>{freeShipping ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-3 font-display text-base font-bold text-ink">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


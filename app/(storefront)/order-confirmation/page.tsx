import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: {
    order?: string;
    total?: string;
    session_id?: string;
    payment_intent?: string;
    payment_intent_client_secret?: string;
    redirect_status?: string;
  };
}) {
  const redirectStatus = searchParams.redirect_status;
  const paymentFailed = redirectStatus && redirectStatus !== "succeeded";

  // Reference: prefer order param (mock), then payment_intent, then session_id
  const orderRef =
    searchParams.order ??
    searchParams.payment_intent ??
    searchParams.session_id ??
    "—";

  if (paymentFailed) {
    return (
      <div className="shell flex flex-col items-center gap-4 py-24 text-center">
        <XCircle size={48} className="text-red-500" />
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Payment unsuccessful
        </h1>
        <p className="max-w-md text-sm text-ink-soft">
          Your payment could not be processed. No charge was made. Please try
          again or use a different payment method.
        </p>
        <Link href="/checkout" className="btn-primary mt-2">
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="shell flex flex-col items-center gap-4 py-24 text-center">
      <CheckCircle2 size={48} className="text-primary" />
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Thank you for your order!
      </h1>
      <p className="max-w-md text-sm text-ink-soft">
        A confirmation email is on its way. Your order will ship from our EU
        warehouse within 24 hours.
      </p>

      <div className="card mt-4 w-full max-w-sm p-5 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Order reference</span>
          <span className="font-semibold text-ink font-mono text-xs">
            {orderRef.slice(0, 20)}
          </span>
        </div>
        {searchParams.total && (
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-ink-soft">Total charged</span>
            <span className="font-semibold text-ink">
              ${searchParams.total}
            </span>
          </div>
        )}
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-ink-soft">Status</span>
          <span className="font-semibold text-green-700">Confirmed ✓</span>
        </div>
      </div>

      <Link href="/" className="btn-primary mt-2">
        Continue Shopping
      </Link>
    </div>
  );
}

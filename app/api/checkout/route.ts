import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

type CheckoutBody = {
  lines: {
    productId: string;
    quantity: number;
    unitPrice: number;
    variantLabel?: string;
    name?: string;
  }[];
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  discountCode?: string | null;
  discountAmount?: number;
  total: number;
};

export async function POST(req: NextRequest) {
  const body: CheckoutBody = await req.json();

  if (!body.lines || body.lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  if (!body.total || body.total <= 0) {
    return NextResponse.json({ error: "Invalid total." }, { status: 400 });
  }

  // ── Real Stripe path ─────────────────────────────────────────────────────
  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Build line items summary for metadata
    const itemsSummary = body.lines
      .map((l) => `${l.name ?? l.productId} x${l.quantity}`)
      .join(", ")
      .slice(0, 500);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(body.total * 100), // cents
      currency: "usd",
      // Card and debit only — no Apple Pay / Google Pay
      payment_method_types: ["card"],
      receipt_email: body.shipping.email,
      metadata: {
        customer_name: body.shipping.name,
        customer_email: body.shipping.email,
        shipping_address: [
          body.shipping.address,
          body.shipping.city,
          body.shipping.state,
          body.shipping.zip,
        ].join(", "),
        items: itemsSummary,
        discount_code: body.discountCode ?? "",
        discount_amount: String(body.discountAmount ?? 0),
      },
      shipping: {
        name: body.shipping.name,
        address: {
          line1: body.shipping.address,
          city: body.shipping.city,
          state: body.shipping.state,
          postal_code: body.shipping.zip,
          country: "US",
        },
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  }

  // ── Mock path (no Stripe key configured) ─────────────────────────────────
  const mockOrderId = `mock_${Date.now()}`;
  return NextResponse.json({
    mock: true,
    orderId: mockOrderId,
    total: body.total,
  });
}

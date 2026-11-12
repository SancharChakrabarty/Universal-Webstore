import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Required so Next.js doesn't parse the body — Stripe needs the raw bytes
//export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Service-role client (bypasses RLS so webhook can write orders)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const meta = pi.metadata ?? {};

    try {
      // Parse totals from the PaymentIntent amount (cents → dollars)
      const total = pi.amount / 100;

      // Insert order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          status: "processing",
          subtotal: total, // we store total as subtotal for simplicity — you can refine
          shipping_cost: 0,
          total,
          payment_status: "paid",
          stripe_payment_intent_id: pi.id,
          shipping_address: {
            name: meta.customer_name ?? "",
            email: meta.customer_email ?? "",
            address: meta.shipping_address ?? "",
          },
        })
        .select("id")
        .single();

      if (orderErr) {
        console.error("Failed to insert order:", orderErr);
        // Return 200 anyway so Stripe doesn't retry — log and investigate separately
        return NextResponse.json({ received: true, warning: "Order insert failed" });
      }

      console.log("Order created:", order?.id, "for PaymentIntent:", pi.id);
    } catch (err) {
      console.error("Webhook handler error:", err);
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.log("Payment failed for PaymentIntent:", pi.id);
    // Could update order status here if you'd stored a pending order
  }

  return NextResponse.json({ received: true });
}

import { NextRequest, NextResponse } from "next/server";

// Demo stub — Stripe webhook disabled.
// In production, replace this with a real Stripe + Supabase implementation.
export async function POST(_req: NextRequest) {
  return NextResponse.json({ received: true, demo: true });
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { siteSettings } from "@/lib/data";

export default function CartPage() {
  const { lines, updateQuantity, removeItem, subtotal, amountToFreeShipping, freeShippingProgress } =
    useCart();

  if (lines.length === 0) {
    return (
      <div className="shell flex flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Your cart is empty</h1>
        <p className="text-sm text-ink-soft">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/brands" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="rounded-card border border-line bg-tint px-5 py-4">
            {amountToFreeShipping > 0 ? (
              <p className="text-sm text-ink">
                Add <strong>${amountToFreeShipping.toFixed(2)}</strong> more for free shipping!
              </p>
            ) : (
              <p className="text-sm font-semibold text-primary">You&apos;ve unlocked free shipping 🎉</p>
            )}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-pill bg-white">
              <div
                className="h-full rounded-pill bg-primary transition-all"
                style={{ width: `${freeShippingProgress * 100}%` }}
              />
            </div>
          </div>

          <ul className="mt-6 divide-y divide-line">
            {lines.map((line) => {
              const snap = line.snapshot;
              return (
                <li key={line.lineId} className="flex gap-4 py-5">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card bg-tint">
                    {snap?.image && (
                      <Image src={snap.image} alt={snap.name ?? ""} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold uppercase text-ink-faint">
                          {snap?.brandName}
                        </span>
                        <p className="block font-display text-sm font-bold text-ink">
                          {snap?.name ?? line.productId}
                        </p>
                        <span className="text-xs text-ink-soft">
                          {line.variantLabel ?? snap?.flavorName}
                        </span>
                      </div>
                      <button onClick={() => removeItem(line.lineId)} aria-label="Remove item">
                        <Trash2 size={16} className="text-ink-faint hover:text-red-500" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-pill border border-line px-2 py-1">
                        <button onClick={() => updateQuantity(line.lineId, line.quantity - 1)} aria-label="Decrease quantity">
                          <Minus size={14} className="text-ink-soft" />
                        </button>
                        <span className="w-5 text-center text-sm font-medium">{line.quantity}</span>
                        <button onClick={() => updateQuantity(line.lineId, line.quantity + 1)} aria-label="Increase quantity">
                          <Plus size={14} className="text-ink-soft" />
                        </button>
                      </div>
                      <span className="font-display text-sm font-bold text-ink">
                        ${(line.unitPrice * line.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-card border border-line p-6">
          <h2 className="font-display text-base font-bold text-ink">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-ink-soft">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-ink-soft">
            <span>Shipping</span>
            <span>{subtotal >= siteSettings.free_shipping_threshold ? "Free" : "Calculated at checkout"}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-base font-bold text-ink">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-5 w-full">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

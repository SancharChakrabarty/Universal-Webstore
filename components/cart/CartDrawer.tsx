"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { siteSettings } from "@/lib/data";

export default function CartDrawer() {
  const {
    lines,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    amountToFreeShipping,
    freeShippingProgress,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />

      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="font-display text-lg font-bold text-ink">
            Your Cart {lines.length > 0 && `(${lines.length})`}
          </h2>
          <button onClick={closeCart} aria-label="Close cart">
            <X size={22} className="text-ink-soft" />
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="border-b border-line bg-[#f0f4f9] px-5 py-4">
          {amountToFreeShipping > 0 ? (
            <p className="text-sm text-ink">
              Add <strong>${amountToFreeShipping.toFixed(2)}</strong> more for free shipping!
            </p>
          ) : (
            <p className="text-sm font-semibold text-primary">
              You&apos;ve unlocked free shipping 🎉
            </p>
          )}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-pill bg-white">
            <div
              className="h-full rounded-pill bg-primary transition-all"
              style={{ width: `${freeShippingProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Lines */}
        <div className="flex-1 overflow-y-auto p-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag size={40} className="text-ink-faint" />
              <p className="text-sm text-ink-soft">Your cart is empty.</p>
              <Link href="/brands" onClick={closeCart} className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {lines.map((line) => {
                const snap = line.snapshot;
                const lineTotal = (line.unitPrice * line.quantity).toFixed(2);

                return (
                  <li key={line.lineId} className="flex gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-tint">
                      {snap?.image && (
                        <Image src={snap.image} alt={snap.name ?? ""} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-xs font-semibold uppercase text-ink-faint">
                        {snap?.brandName}
                      </span>
                      <span className="font-display text-sm font-bold text-ink">
                        {snap?.name ?? line.productId}
                      </span>
                      <span className="text-xs text-ink-soft">
                        {line.variantLabel ?? snap?.flavorName}
                      </span>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-pill border border-line px-2 py-1">
                          <button
                            onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} className="text-ink-soft" />
                          </button>
                          <span className="w-5 text-center text-sm font-medium">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} className="text-ink-soft" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-display text-sm font-bold">
                            ${lineTotal}
                          </span>
                          <button
                            onClick={() => removeItem(line.lineId)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} className="text-ink-faint hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="border-t border-line p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-display text-lg font-bold text-ink">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              Shipping & taxes calculated at checkout. Free shipping over $
              {siteSettings.free_shipping_threshold}.
            </p>
            <Link href="/cart" onClick={closeCart} className="btn-primary mt-4 w-full">
              View Cart & Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

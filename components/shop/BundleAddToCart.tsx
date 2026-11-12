"use client";

import { useCart } from "@/lib/cart-context";

export default function BundleAddToCart({ productIds }: { productIds: string[] }) {
  const { addItem } = useCart();

  return (
    <button
      className="btn-primary mt-6 w-full"
      onClick={() => productIds.forEach((id) => addItem(id, 1))}
    >
      Add Bundle to Cart
    </button>
  );
}

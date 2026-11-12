"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { siteSettings } from "@/lib/data";

export type CartLine = {
  lineId: string;
  productId: string;
  quantity: number;
  /** Always set at add-time — the per-unit price paid (pack price / pack size, or product.price). */
  unitPrice: number;
  /** Display label for the chosen variant, e.g. "16mg · Grape Ice · 20-Pack". */
  variantLabel?: string;
  /** Strength (mg) selected for this line. */
  selectedStrength?: number;
  /** Snapshot fields stored at add-time so the drawer never needs a product lookup. */
  snapshot?: {
    name: string;
    image: string;
    brandName: string;
    flavorName: string;
  };
};

type AddItemOptions = {
  unitPrice: number;
  variantLabel?: string;
  variantKey?: string;
  selectedStrength?: number;
  snapshot?: CartLine["snapshot"];
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, quantity?: number, options?: AddItemOptions) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  amountToFreeShipping: number;
  freeShippingProgress: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "pouch-club-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CartLine[] = JSON.parse(raw);
        // Purge lines missing a unitPrice (old format lines that would show $0)
        const valid = parsed.filter((l) => typeof l.unitPrice === "number" && l.unitPrice > 0);
        setLines(valid);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = (productId: string, quantity = 1, options?: AddItemOptions) => {
    const lineId = options?.variantKey ? `${productId}::${options.variantKey}` : productId;
    const unitPrice = options?.unitPrice ?? 0;

    setLines((prev) => {
      const existing = prev.find((l) => l.lineId === lineId);
      if (existing) {
        return prev.map((l) =>
          l.lineId === lineId ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [
        ...prev,
        {
          lineId,
          productId,
          quantity,
          unitPrice,
          variantLabel: options?.variantLabel,
          selectedStrength: options?.selectedStrength,
          snapshot: options?.snapshot,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) { removeItem(lineId); return; }
    setLines((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l))
    );
  };

  const clearCart = () => setLines([]);

  const { totalCount, subtotal } = useMemo(() => {
    let totalCount = 0;
    let subtotal = 0;
    for (const line of lines) {
      totalCount += line.quantity;
      subtotal += line.unitPrice * line.quantity;
    }
    return { totalCount, subtotal };
  }, [lines]);

  const amountToFreeShipping = Math.max(0, siteSettings.free_shipping_threshold - subtotal);
  const freeShippingProgress = Math.min(1, subtotal / siteSettings.free_shipping_threshold);

  return (
    <CartContext.Provider
      value={{
        lines,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        amountToFreeShipping,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

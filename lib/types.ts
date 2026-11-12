export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
};

export type Flavor = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  flavor_id: string;
  strength_mg: number;
  /** Base 1-pack price. */
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  is_on_sale: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  image_urls: string[];
  description: string;
  /** Strength options (mg) this product can be ordered in. */
  available_strengths: number[];
  /** Flavor options. Empty = no flavor selector shown. */
  available_flavors: string[];
  /** Per-strength images: key = strength_mg as string, value = image URL.
   *  Falls back to image_urls[0] when not set for a given strength. */
  strength_images: Record<string, string>;
  /** Explicit 3-pack total price. Null → price * 3 (no discount). */
  price_3pack: number | null;
  /** Explicit 5-pack total price. Null → price * 5. */
  price_5pack: number | null;
  /** Explicit 10-pack total price. Null → price * 10. */
  price_10pack: number | null;
};

export type Bundle = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  bundle_price: number;
  product_ids: string[];
};

export type Review = {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  product_id: string | null;
  is_featured: boolean;
};

export type Address = {
  id: string;
  customer_id: string;
  type: "billing" | "shipping";
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
};

export type SiteSettings = {
  announcement_text: string;
  free_shipping_threshold: number;
  hero_heading: string;
  hero_subheading: string;
};

export type DiscountCode = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  expires_at: string | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
};

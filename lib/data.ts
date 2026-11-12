import { Brand, Flavor, Product, Bundle, Review, SiteSettings } from "./types";

export const siteSettings: SiteSettings = {
  announcement_text: "Free shipping on all orders over $100",
  free_shipping_threshold: 100,
  hero_heading: "Premium Products. Delivered to You.",
  hero_subheading: "Your home for premium products from the world's best brands.",
};

export const heroImages: string[] = [
  "/images/homepage/hero-banner.jpg",
  "/images/homepage/banner-2.jpg",
  "/images/homepage/banner-3.jpg",
  "/images/homepage/banner-4.jpg",
];

export const brands: Brand[] = [
  { id: "b-brand-a", name: "Brand A", slug: "brand-a", logo_url: "/images/logos/brand-a.png", description: "Premium quality products from Brand A." },
  { id: "b-brand-b", name: "Brand B", slug: "brand-b", logo_url: "/images/logos/brand-b.png", description: "Innovative flavors and consistent quality from Brand B." },
  { id: "b-brand-c", name: "Brand C", slug: "brand-c", logo_url: "/images/logos/brand-c.png", description: "Bold and distinctive products from Brand C." },
  { id: "b-brand-d", name: "Brand D", slug: "brand-d", logo_url: "/images/logos/brand-d.png", description: "Trusted and reliable products from Brand D." },
  { id: "b-brand-e", name: "Brand E", slug: "brand-e", logo_url: "/images/logos/brand-e.png", description: "Exclusive offerings and unique profiles from Brand E." },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const flavorNames = [
  "Flavor One", "Flavor Two", "Flavor Three", "Flavor Four", "Flavor Five",
  "Flavor Six", "Flavor Seven", "Flavor Eight", "Flavor Nine", "Flavor Ten",
  "Flavor Eleven", "Flavor Twelve", "Flavor Thirteen",
  "Flavor Fourteen", "Flavor Fifteen", "Flavor Sixteen", "Flavor Seventeen",
  "Flavor Eighteen", "Flavor Nineteen", "Flavor Twenty",
  "Flavor Twenty-One", "Flavor Twenty-Two", "Flavor Twenty-Three",
  "Flavor Twenty-Four", "Flavor Twenty-Five", "Flavor Twenty-Six",
  "Flavor Twenty-Seven", "Flavor Twenty-Eight", "Flavor Twenty-Nine",
  "Flavor Thirty", "Flavor Thirty-One", "Flavor Thirty-Two",
  "Flavor Thirty-Three", "Flavor Thirty-Four", "Flavor Thirty-Five",
];

export const flavors: Flavor[] = flavorNames.map((name, i) => ({
  id: `f-${i}`, name, slug: slugify(name),
}));

const flavorId = (name: string) => flavors.find((f) => f.name === name)?.id ?? flavors[0].id;
const IMG = (brandDir: string, file: string) => `/images/brands/${brandDir}/${file}`;

type BaseProduct = Omit<Product, "available_strengths" | "available_flavors" | "strength_images" | "price_3pack" | "price_5pack" | "price_10pack">;

export const rawProducts: BaseProduct[] = [
  // Brand A
  { id: "p-brand-a-1", name: "Brand A Product 1", slug: "brand-a-product-1", brand_id: "b-brand-a", flavor_id: flavorId("Flavor One"), strength_mg: 6, price: 6.99, compare_at_price: null, stock_quantity: 140, is_on_sale: false, is_featured: true, is_best_seller: false, is_new_arrival: false, image_urls: [IMG("brand-a", "product-1.jpg")], description: "A premium product with a smooth and refreshing profile." },
  { id: "p-brand-a-2", name: "Brand A Product 2", slug: "brand-a-product-2", brand_id: "b-brand-a", flavor_id: flavorId("Flavor Two"), strength_mg: 6, price: 6.99, compare_at_price: null, stock_quantity: 95, is_on_sale: false, is_featured: false, is_best_seller: false, is_new_arrival: false, image_urls: [IMG("brand-a", "product-2.jpg")], description: "A delightful product with a unique blend of flavors." },
  { id: "p-brand-a-3", name: "Brand A Product 3", slug: "brand-a-product-3", brand_id: "b-brand-a", flavor_id: flavorId("Flavor Three"), strength_mg: 6, price: 5.99, compare_at_price: 6.99, stock_quantity: 60, is_on_sale: true, is_featured: false, is_best_seller: false, is_new_arrival: false, image_urls: [IMG("brand-a", "product-3.jpg")], description: "A crisp and invigorating option with a bright character." },
  { id: "p-brand-a-4", name: "Brand A Product 4", slug: "brand-a-product-4", brand_id: "b-brand-a", flavor_id: flavorId("Flavor Four"), strength_mg: 6, price: 6.99, compare_at_price: null, stock_quantity: 210, is_on_sale: false, is_featured: false, is_best_seller: true, is_new_arrival: false, image_urls: [IMG("brand-a", "product-4.jpg")], description: "A tropical product with a cool and frosty finish." },
  { id: "p-brand-a-5", name: "Brand A Product 5", slug: "brand-a-product-5", brand_id: "b-brand-a", flavor_id: flavorId("Flavor Five"), strength_mg: 6, price: 6.99, compare_at_price: null, stock_quantity: 130, is_on_sale: false, is_featured: false, is_best_seller: false, is_new_arrival: true, image_urls: [IMG("brand-a", "product-5.jpg")], description: "A fresh and fruity blend, perfect for any occasion." },
  // Brand B
  { id: "p-brand-b-1", name: "Brand B Product 1", slug: "brand-b-product-1", brand_id: "b-brand-b", flavor_id: flavorId("Flavor Six"), strength_mg: 8, price: 5.99, compare_at_price: null, stock_quantity: 180, is_on_sale: false, is_featured: false, is_best_seller: false, is_new_arrival: false, image_urls: [IMG("brand-b", "product-1.jpg")], description: "A light and crisp product for everyday enjoyment." },
  { id: "p-brand-b-2", name: "Brand B Product 2", slug: "brand-b-product-2", brand_id: "b-brand-b", flavor_id: flavorId("Flavor Seven"), strength_mg: 8, price: 5.99, compare_at_price: null, stock_quantity: 90, is_on_sale: false, is_featured: true, is_best_seller: false, is_new_arrival: false, image_urls: [IMG("brand-b", "product-2.jpg")], description: "A creamy and indulgent flavor exclusive to Brand B." },
  { id: "p-brand-b-3", name: "Brand B Product 3", slug: "brand-b-product-3", brand_id: "b-brand-b", flavor_id: flavorId("Flavor Eight"), strength_mg: 8, price: 5.99, compare_at_price: null, stock_quantity: 220, is_on_sale: false, is_featured: false, is_best_seller: true, is_new_arrival: false, image_urls: [IMG("brand-b", "product-3.jpg")], description: "A deep and complex profile with a sharp, cool finish." },
  { id: "p-brand-b-4", name: "Brand B Product 4", slug: "brand-b-product-4", brand_id: "b-brand-b", flavor_id: flavorId("Flavor Nine"), strength_mg: 8, price: 5.49, compare_at_price: 5.99, stock_quantity: 75, is_on_sale: true, is_featured: false, is_best_seller: false, is_new_arrival: false, image_urls: [IMG("brand-b", "product-4.jpg")], description: "A classic profile, refreshed with a modern twist." },
  { id: "p-brand-b-5", name: "Brand B Product 5", slug: "brand-b-product-5", brand_id: "b-brand-b", flavor_id: flavorId("Flavor Ten"), strength_mg: 8, price: 5.99, compare_at_price: null, stock_quantity: 110, is_on_sale: false, is_featured: false, is_best_seller: false, is_new_arrival: true, image_urls: [IMG("brand-b", "product-5.jpg")], description: "A sweet and smooth product with a cooling edge." },
  // Brand C
  { id: "p-brand-c-1", name: "Brand C Product 1", slug: "brand-c-product-1", brand_id: "b-brand-c", flavor_id: flavorId("Flavor Eleven"), strength_mg: 10, price: 5.49, compare_at_price: null, stock_quantity: 140, is_on_sale: false, is_featured: false, is_best_seller: false, is_new_arrival: false, image_urls: [IMG("brand-c", "product-1.jpg")], description: "A balanced, all-purpose product for everyday use." },
  { id: "p-brand-c-2", name: "Brand C Product 2", slug: "brand-c-product-2", brand_id: "b-brand-c", flavor_id: flavorId("Flavor Twelve"), strength_mg: 10, price: 5.49, compare_at_price: null, stock_quantity: 80, is_on_sale: false, is_featured: false, is_best_seller: false, is_new_arrival: true, image_urls: [IMG("brand-c", "product-2.jpg")], description: "A warm and spiced product at moderate strength." },
  { id: "p-brand-c-3", name: "Brand C Product 3", slug: "brand-c-product-3", brand_id: "b-brand-c", flavor_id: flavorId("Flavor Thirteen"), strength_mg: 10, price: 5.49, compare_at_price: null, stock_quantity: 92, is_on_sale: false, is_featured: false, is_best_seller: false, is_new_arrival: false, image_urls: [IMG("brand-c", "product-3.jpg")], description: "A crisp product with a cool and refreshing finish." },
  { id: "p-brand-c-4", name: "Brand C Product 4", slug: "brand-c-product-4", brand_id: "b-brand-c", flavor_id: flavorId("Flavor Fourteen"), strength_mg: 10, price: 5.49, compare_at_price: null, stock_quantity: 200, is_on_sale: false, is_featured: false, is_best_seller: true, is_new_arrival: false, image_urls: [IMG("brand-c", "product-4.jpg")], description: "A smooth and everyday product at a moderate strength." },
  { id: "p-brand-c-5", name: "Brand C Product 5", slug: "brand-c-product-5", brand_id: "b-brand-c", flavor_id: flavorId("Flavor Fifteen"), strength_mg: 10, price: 4.99, compare_at_price: 5.49, stock_quantity: 64, is_on_sale: true, is_featured: false, is_best_seller: false, is_new_arrival: false, image_urls: [IMG("brand-c", "product-5.jpg")], description: "A bright and lively product, sharper than the original." },
  // Brand D
  { id: "p-brand-d-1", name: "Brand D Product 1", slug: "brand-d-product-1", brand_id: "b-brand-d", flavor_id: flavorId("Flavor Sixteen"), strength_mg: 12, price: 6.49, compare_at_price: null, stock_quantity: 70, is_on_sale: false, is_featured: true, is_best_seller: false, is_new_arrival: false, image_urls: [IMG("brand-d", "product-1.jpg")], description: "An extra-strong product with a bold and icy character." },
  { id: "p-brand-d-2", name: "Brand D Product 2", slug: "brand-d-product-2", brand_id: "b-brand-d", flavor_id: flavorId("Flavor Seventeen"), strength_mg: 12, price: 6.49, compare_at_price: null, stock_quantity: 55, is_on_sale: false, is_featured: false, is_best_seller: true, is_new_arrival: false, image_urls: [IMG("brand-d", "product-2.jpg")], description: "An ice-cold product at extra strength for experienced users." },
  { id: "p-brand-d-3", name: "Brand D Product 3", slug: "brand-d-product-3", brand_id: "b-brand-d", flavor_id: flavorId("Flavor Eighteen"), strength_mg: 12, price: 5.99, compare_at_price: 6.49, stock_quantity: 40, is_on_sale: true, is_featured: false, is_best_seller: false, is_new_arrival: true, image_urls: [IMG("brand-d", "product-3.jpg")], description: "An exclusive extra-strong blend, new to the lineup." },
  // Brand E
  { id: "p-brand-e-1", name: "Brand E Product 1", slug: "brand-e-product-1", brand_id: "b-brand-e", flavor_id: flavorId("Flavor Nineteen"), strength_mg: 14, price: 5.99, compare_at_price: null, stock_quantity: 140, is_on_sale: false, is_featured: false, is_best_seller: false, is_new_arrival: false, image_urls: [], description: "A heritage product, reimagined for the modern market." },
  { id: "p-brand-e-2", name: "Brand E Product 2", slug: "brand-e-product-2", brand_id: "b-brand-e", flavor_id: flavorId("Flavor Twenty"), strength_mg: 14, price: 5.99, compare_at_price: null, stock_quantity: 35, is_on_sale: false, is_featured: false, is_best_seller: false, is_new_arrival: true, image_urls: [], description: "A warm and aromatic product with a rich base note." },
  { id: "p-brand-e-3", name: "Brand E Product 3", slug: "brand-e-product-3", brand_id: "b-brand-e", flavor_id: flavorId("Flavor Twenty-One"), strength_mg: 14, price: 5.99, compare_at_price: null, stock_quantity: 38, is_on_sale: false, is_featured: false, is_best_seller: false, is_new_arrival: true, image_urls: [], description: "A pure and long-lasting product with an icy finish." },
];

type VariantConfig = Pick<Product, "available_strengths" | "available_flavors" | "strength_images" | "price_3pack" | "price_5pack" | "price_10pack">;

function defaultVariantConfig(strengthMg: number): VariantConfig {
  return {
    available_strengths: [strengthMg],
    available_flavors: [],
    strength_images: {},
    price_3pack: null,
    price_5pack: null,
    price_10pack: null,
  };
}

const variantOverrides: Record<string, Partial<VariantConfig>> = {
  "p-brand-a-4": {
    available_strengths: [3, 6, 12],
    available_flavors: ["Flavor Four", "Flavor Four Light", "Flavor Four Strong"],
    strength_images: {
      "3": IMG("brand-a", "product-4.jpg"),
      "6": IMG("brand-a", "product-4.jpg"),
      "12": IMG("brand-a", "product-5.jpg"),
    },
    price_3pack: 19.49,
    price_5pack: 29.99,
    price_10pack: 54.99,
  },
  "p-brand-b-3": {
    available_strengths: [6, 9, 11],
    available_flavors: ["Flavor Eight", "Flavor Eight Light", "Flavor Eight Mint"],
    strength_images: {
      "6": IMG("brand-b", "product-3.jpg"),
      "9": IMG("brand-b", "product-3.jpg"),
      "11": IMG("brand-b", "product-3.jpg"),
    },
    price_5pack: 27.49,
    price_10pack: 51.99,
  },
  "p-brand-c-1": {
    available_strengths: [3, 6],
    strength_images: {
      "3": IMG("brand-c", "product-1.jpg"),
      "6": IMG("brand-c", "product-1.jpg"),
    },
    price_3pack: 13.99,
    price_5pack: 21.99,
    price_10pack: 41.99,
  },
  "p-brand-c-4": {
    available_flavors: ["Flavor Fourteen", "Flavor Fourteen Spearmint", "Flavor Fourteen Wintergreen"],
    price_5pack: 24.99,
    price_10pack: 46.99,
  },
  "p-brand-d-1": {
    available_strengths: [12, 16],
    strength_images: {
      "12": IMG("brand-d", "product-1.jpg"),
      "16": IMG("brand-d", "product-2.jpg"),
    },
    price_3pack: 17.99,
    price_5pack: 27.99,
    price_10pack: 51.99,
  },
};

export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  ...defaultVariantConfig(p.strength_mg),
  ...(variantOverrides[p.id] ?? {}),
}));

export function getPackPrice(product: Product, packSize: 1 | 3 | 5 | 10): number {
  if (packSize === 1) return product.price;
  if (packSize === 3) return product.price_3pack ?? Math.round(product.price * 3 * 100) / 100;
  if (packSize === 5) return product.price_5pack ?? Math.round(product.price * 5 * 100) / 100;
  return product.price_10pack ?? Math.round(product.price * 10 * 100) / 100;
}

export function getPackSavings(product: Product, packSize: 3 | 5 | 10): number {
  const packTotal = getPackPrice(product, packSize);
  const fullPrice = product.price * packSize;
  return Math.max(0, Math.round((1 - packTotal / fullPrice) * 100));
}

export const bundles: Bundle[] = [
  { id: "bn-1", name: "Starter Pack", slug: "starter-pack", description: "Five favorite products to find your perfect match.", image_url: "/images/brands/brand-c/product-1.jpg", bundle_price: 22.99, product_ids: ["p-brand-c-1", "p-brand-c-4", "p-brand-b-1", "p-brand-a-4"] },
  { id: "bn-2", name: "Explorer Bundle", slug: "explorer-bundle", description: "A sampler pulling from four different brands.", image_url: "/images/brands/brand-a/product-4.jpg", bundle_price: 26.99, product_ids: ["p-brand-a-4", "p-brand-b-2", "p-brand-c-5", "p-brand-d-1"] },
  { id: "bn-3", name: "Premium Sampler", slug: "premium-sampler", description: "For experienced users — three of our strongest products in one box.", image_url: "/images/brands/brand-d/product-2.jpg", bundle_price: 18.99, product_ids: ["p-brand-d-1", "p-brand-d-2", "p-brand-e-3"] },
];

export const reviews: Review[] = [
  { id: "r-1", customer_name: "Jordan T.", rating: 5, review_text: "Order arrived faster than expected. Product quality is excellent.", product_id: "p-brand-c-1", is_featured: true },
  { id: "r-2", customer_name: "Maya R.", rating: 5, review_text: "These products aren't available anywhere near me, so this is the only way I get them. Worth it.", product_id: "p-brand-b-2", is_featured: true },
  { id: "r-3", customer_name: "Chris D.", rating: 4, review_text: "Brand D lives up to its reputation. Packaging was discreet, which I appreciated.", product_id: "p-brand-d-2", is_featured: true },
  { id: "r-4", customer_name: "Priya S.", rating: 5, review_text: "Site is fast, checkout was painless, and the free shipping threshold is easy to hit if you grab a bundle.", product_id: null, is_featured: true },
  { id: "r-5", customer_name: "Alex M.", rating: 5, review_text: "Brand C Product 4 is now my daily go-to. Subtle, not overpowering, lasts a good while.", product_id: "p-brand-c-4", is_featured: true },
  { id: "r-6", customer_name: "Sam K.", rating: 4, review_text: "Good selection of strengths. Wish Brand A had more products in stock but everything ships quick.", product_id: "p-brand-a-4", is_featured: true },
];

export const strengthRanges = [
  { id: "sr-1", label: "3–6 mg", min: 3, max: 6, tone: "strength-1" },
  { id: "sr-2", label: "8–11 mg", min: 8, max: 11, tone: "strength-2" },
  { id: "sr-3", label: "12–15 mg", min: 12, max: 15, tone: "strength-3" },
  { id: "sr-4", label: "15–20 mg", min: 15, max: 20, tone: "strength-4" },
  { id: "sr-5", label: "20–30 mg", min: 20, max: 30, tone: "strength-5" },
  { id: "sr-6", label: "30–50 mg", min: 30, max: 50, tone: "strength-6" },
] as const;

export function getBrand(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}
export function getFlavor(id: string): Flavor | undefined {
  return flavors.find((f) => f.id === id);
}

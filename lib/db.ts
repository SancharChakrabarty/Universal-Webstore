/**
 * lib/db.ts
 * Server-side data fetching. Tries Supabase first; falls back to static
 * data.ts so the site still works without a DB connection (local dev).
 */
import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  brands as staticBrands,
  flavors as staticFlavors,
  products as staticProducts,
  bundles as staticBundles,
  reviews as staticReviews,
  siteSettings as staticSiteSettings,
  heroImages as staticHeroImages,
} from "@/lib/data";
import { Brand, Flavor, Product, Bundle, Review, SiteSettings } from "@/lib/types";

// ─── helpers ────────────────────────────────────────────────────────────────

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    brand_id: row.brand_id as string,
    flavor_id: row.flavor_id as string,
    strength_mg: row.strength_mg as number,
    price: Number(row.price),
    compare_at_price: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    stock_quantity: row.stock_quantity as number,
    is_on_sale: row.is_on_sale as boolean,
    is_featured: row.is_featured as boolean,
    is_best_seller: row.is_best_seller as boolean,
    is_new_arrival: row.is_new_arrival as boolean,
    image_urls: (row.image_urls as string[]) ?? [],
    description: (row.description as string) ?? "",
    available_strengths: (row.available_strengths as number[]) ?? [row.strength_mg as number],
    available_flavors: (row.available_flavors as string[]) ?? [],
    strength_images: (row.strength_images as Record<string, string>) ?? {},
    price_3pack: row.price_3pack != null ? Number(row.price_3pack) : null,
    price_5pack: row.price_5pack != null ? Number(row.price_5pack) : null,
    price_10pack: row.price_10pack != null ? Number(row.price_10pack) : null,
  };
}

// ─── brands ─────────────────────────────────────────────────────────────────

export async function getBrandsDB(): Promise<Brand[]> {
  const db = getSupabaseAdminClient();
  if (!db) return staticBrands;
  const { data, error } = await db.from("brands").select("*").order("name");
  if (error || !data?.length) return staticBrands;
  return data as Brand[];
}

// ─── flavors ────────────────────────────────────────────────────────────────

export async function getFlavorsDB(): Promise<Flavor[]> {
  const db = getSupabaseAdminClient();
  if (!db) return staticFlavors;
  const { data, error } = await db.from("flavors").select("*").order("name");
  if (error || !data?.length) return staticFlavors;
  return data as Flavor[];
}

// ─── products ───────────────────────────────────────────────────────────────

export async function getProductsDB(): Promise<Product[]> {
  const db = getSupabaseAdminClient();
  // Only fall back to static data if Supabase is not configured at all
  if (!db) return staticProducts;
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("name");
  // If Supabase is configured but errors, return empty rather than stale static data
  if (error) return [];
  // If Supabase returns data, always use it — never mix with static
  if (data?.length) return data.map(rowToProduct);
  // Supabase returned zero rows — only fall back if this looks like an unconfigured DB
  return [];
}

export async function getProductBySlugDB(slug: string): Promise<Product | null> {
  const db = getSupabaseAdminClient();
  if (!db) return staticProducts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  // Only fall back to static if Supabase is not configured
  if (error || !data) return null;
  return rowToProduct(data);
}

// ─── bundles ────────────────────────────────────────────────────────────────

export async function getBundlesDB(): Promise<Bundle[]> {
  const db = getSupabaseAdminClient();
  if (!db) return staticBundles;
  const { data, error } = await db
    .from("bundles")
    .select("*, bundle_products(product_id)")
    .eq("is_active", true)
    .order("name");
  if (error || !data?.length) return staticBundles;
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    image_url: row.image_url ?? "",
    bundle_price: Number(row.bundle_price),
    product_ids: (row.bundle_products as { product_id: string }[]).map((bp) => bp.product_id),
  }));
}

export async function getBundleBySlugDB(slug: string): Promise<Bundle | null> {
  const db = getSupabaseAdminClient();
  if (!db) return staticBundles.find((b) => b.slug === slug) ?? null;
  const { data, error } = await db
    .from("bundles")
    .select("*, bundle_products(product_id)")
    .eq("slug", slug)
    .single();
  if (error || !data) return staticBundles.find((b) => b.slug === slug) ?? null;
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description ?? "",
    image_url: data.image_url ?? "",
    bundle_price: Number(data.bundle_price),
    product_ids: (data.bundle_products as { product_id: string }[]).map((bp) => bp.product_id),
  };
}

// ─── reviews ────────────────────────────────────────────────────────────────

export async function getReviewsDB(): Promise<Review[]> {
  const db = getSupabaseAdminClient();
  if (!db) return staticReviews;
  const { data, error } = await db
    .from("reviews")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });
  if (error || !data?.length) return staticReviews;
  return data as Review[];
}

// ─── site settings ──────────────────────────────────────────────────────────

export async function getSiteSettingsDB(): Promise<SiteSettings> {
  const db = getSupabaseAdminClient();
  if (!db) return staticSiteSettings;
  const { data } = await db.from("site_settings").select("*").limit(1).single();
  if (!data) return staticSiteSettings;
  return {
    announcement_text: data.announcement_text ?? staticSiteSettings.announcement_text,
    free_shipping_threshold: data.free_shipping_threshold ?? staticSiteSettings.free_shipping_threshold,
    hero_heading: data.hero_heading ?? staticSiteSettings.hero_heading,
    hero_subheading: data.hero_subheading ?? staticSiteSettings.hero_subheading,
  };
}

export { staticHeroImages as heroImages };

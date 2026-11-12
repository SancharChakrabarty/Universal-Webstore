import { getProductsDB, getBrandsDB, getSiteSettingsDB } from "@/lib/db";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const [products, brands, siteSettings] = await Promise.all([
    getProductsDB(),
    getBrandsDB(),
    getSiteSettingsDB(),
  ]);
  return <CheckoutClient products={products} brands={brands} siteSettings={siteSettings} />;
}

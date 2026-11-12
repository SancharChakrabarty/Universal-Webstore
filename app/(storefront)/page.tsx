import Hero from "@/components/home/Hero";
import BrandCarousel from "@/components/home/BrandCarousel";
import ProductRow from "@/components/home/ProductRow";
import ShippingSection from "@/components/home/ShippingSection";
import StrengthSection from "@/components/home/StrengthSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Reviews from "@/components/home/Reviews";
import FollowClub from "@/components/home/FollowClub";
import FAQ from "@/components/home/FAQ";
import { getProductsDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProductsDB();
  const bestSellers = products.filter((p) => p.is_best_seller);
  const featured = products.filter((p) => p.is_featured);
  const onSale = products.filter((p) => p.is_on_sale);

  return (
    <>
      <Hero />
      <BrandCarousel />
      <ProductRow heading="Best Sellers" products={bestSellers} />
      <ProductRow heading="Featured Products" products={featured} bgColor="#eef4ff" />
      <ProductRow heading="On Sale" products={onSale} viewAllHref="/sale" />
      <ShippingSection />
      <StrengthSection />
      <WhyChooseUs />
      <Reviews />
      <FollowClub />
      <FAQ />
    </>
  );
}

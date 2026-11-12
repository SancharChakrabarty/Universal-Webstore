import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/cart/CartDrawer";
import SignupPopup from "@/components/home/SignupPopup";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only show the signup popup to guests
  let isGuest = true;
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient()!;
    const { data: { session } } = await supabase.auth.getSession();
    isGuest = !session;
  }

  return (
    <CartProvider>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      {isGuest && <SignupPopup />}
    </CartProvider>
  );
}

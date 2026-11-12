import PageHeader from "@/components/shop/PageHeader";
import { siteSettings } from "@/lib/data";

export const metadata = { title: "Shipping Info — My Store" };

export default function ShippingInfoPage() {
  return (
    <>
      <PageHeader title="Shipping Info" crumb="Shipping Info" />
      <div className="shell max-w-2xl py-12 text-sm leading-relaxed text-ink-soft">
        <h2 className="font-display text-base font-bold text-ink">Where we ship from</h2>
        <p className="mt-2">
          Every order ships from our warehouse directly to addresses
          within the United States. We don&apos;t currently ship to other
          countries.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Delivery times</h2>
        <p className="mt-2">
          Orders are packed and shipped within 24 hours of being placed.
          Once shipped, expect delivery within 5–9 business days, including
          customs clearance.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Shipping cost</h2>
        <p className="mt-2">
          Shipping is a flat rate, and free on all orders over $
          {siteSettings.free_shipping_threshold}.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Tracking</h2>
        <p className="mt-2">
          You&apos;ll receive a tracking link by email as soon as your order
          ships. You can also check status anytime on our{" "}
          <a href="/track-order" className="font-semibold text-primary">
            Track Order
          </a>{" "}
          page.
        </p>
      </div>
    </>
  );
}

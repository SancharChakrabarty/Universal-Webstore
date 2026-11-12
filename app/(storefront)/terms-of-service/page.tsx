import PageHeader from "@/components/shop/PageHeader";

export const metadata = { title: "Terms of Service — My Store" };

export default function TermsOfServicePage() {
  return (
    <>
      <PageHeader title="Terms of Service" crumb="Terms of Service" />
      <div className="shell max-w-2xl py-12 text-sm leading-relaxed text-ink-soft">
        <p>Last updated: June 2026</p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Age requirement</h2>
        <p className="mt-2">
          My Store sells product products intended for adults only. By
          using this site or placing an order, you confirm that you are at
          least 21 years of age.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Orders &amp; payment</h2>
        <p className="mt-2">
          All prices are listed in USD. We reserve the right to refuse or
          cancel any order, including for suspected fraud or failed age
          verification. Payment is processed securely at checkout.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Shipping</h2>
        <p className="mt-2">
          Orders ship from our EU warehouse to addresses within the United
          States only. See our{" "}
          <a href="/shipping-info" className="font-semibold text-primary">
            Shipping Info
          </a>{" "}
          page for full details.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Product use</h2>
        <p className="mt-2">
          Product is an addictive chemical. Products sold on this site are
          intended for existing adult product users and should be used as
          directed on the packaging.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Limitation of liability</h2>
        <p className="mt-2">
          My Store is not liable for indirect, incidental, or consequential
          damages arising from the use or misuse of products purchased on
          this site.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Changes to these terms</h2>
        <p className="mt-2">
          We may update these terms from time to time. Continued use of the
          site after changes constitutes acceptance of the updated terms.
        </p>
      </div>
    </>
  );
}

import PageHeader from "@/components/shop/PageHeader";

export const metadata = { title: "Returns — My Store" };

export default function ReturnsPage() {
  return (
    <>
      <PageHeader title="Returns" crumb="Returns" />
      <div className="shell max-w-2xl py-12 text-sm leading-relaxed text-ink-soft">
        <p>
          We want you to be happy with every order. Unopened, unused products
          can be returned within 14 days of delivery for a full refund.
        </p>
        <h2 className="mt-8 font-display text-base font-bold text-ink">How to start a return</h2>
        <p className="mt-2">
          Email <a href="mailto:support@mystore.com" className="font-semibold text-primary">
            support@mystore.com
          </a>{" "}
          with your order number and the items you&apos;d like to return.
          We&apos;ll send you a prepaid return label.
        </p>
        <h2 className="mt-8 font-display text-base font-bold text-ink">What can&apos;t be returned</h2>
        <p className="mt-2">
          Due to the nature of the product, opened cans cannot be returned
          for hygiene and regulatory reasons.
        </p>
        <h2 className="mt-8 font-display text-base font-bold text-ink">Refund timing</h2>
        <p className="mt-2">
          Refunds are issued to your original payment method within 5–7
          business days of us receiving your return.
        </p>
      </div>
    </>
  );
}

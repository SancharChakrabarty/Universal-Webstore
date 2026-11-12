import PageHeader from "@/components/shop/PageHeader";

export const metadata = { title: "Privacy Policy — My Store" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" crumb="Privacy Policy" />
      <div className="shell max-w-2xl py-12 text-sm leading-relaxed text-ink-soft">
        <p>Last updated: June 2026</p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Information we collect</h2>
        <p className="mt-2">
          When you create an account, place an order, or sign up for our
          newsletter, we collect your name, email address, shipping address,
          and order history. Payment details are processed directly by our
          payment provider and are never stored on our servers.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">How we use it</h2>
        <p className="mt-2">
          We use your information to process orders, provide customer
          support, verify your age, and — if you&apos;ve opted in — send
          product updates and promotions. We never sell your personal
          information to third parties.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Age verification</h2>
        <p className="mt-2">
          Because our products are restricted to adults 21 and older, we use
          third-party age verification services at checkout and may verify
          age again at delivery.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Cookies</h2>
        <p className="mt-2">
          We use cookies to keep you signed in, remember your cart, and
          understand how visitors use our site.
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Your rights</h2>
        <p className="mt-2">
          You can request a copy of your data, ask us to correct it, or
          request deletion of your account at any time by contacting{" "}
          <a href="mailto:support@mystore.com" className="font-semibold text-primary">
            support@mystore.com
          </a>
          .
        </p>

        <h2 className="mt-8 font-display text-base font-bold text-ink">Contact us</h2>
        <p className="mt-2">
          Questions about this policy? Reach out via our{" "}
          <a href="/contact" className="font-semibold text-primary">
            Contact Us
          </a>{" "}
          page.
        </p>
      </div>
    </>
  );
}

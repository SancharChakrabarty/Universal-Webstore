import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import PageHeader from "@/components/shop/PageHeader";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = { title: "Contact Us — My Store" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Questions about an order, a product, or anything else? We're here to help."
        crumb="Contact Us"
      />
      <div className="shell grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <ContactForm />

        <div className="flex flex-col gap-6">
          <div className="card p-6">
            <h3 className="font-display text-sm font-bold text-ink">Get in Touch</h3>
            <div className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
              <Mail size={16} className="text-primary" /> support@mystore.com
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-ink-soft">
              <MapPin size={16} className="text-primary" /> [Your Business Address]
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-sm font-bold text-ink">Common Questions</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Shipping times, returns, and order tracking are answered on our FAQ page.
            </p>
            <Link href="/faq" className="mt-3 inline-block text-sm font-semibold text-primary">
              Visit the FAQ →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

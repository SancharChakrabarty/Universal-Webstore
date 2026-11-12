import Link from "next/link";
import { Instagram, Music2, Mail } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Brands", href: "/brands" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "On Sale", href: "/sale" },
  { label: "Flavors", href: "/flavors" },
  { label: "Bundles", href: "/bundles" },
  { label: "Contact Us", href: "/contact" },
];

const customerService = [
  { label: "Shipping Info", href: "/shipping-info" },
  { label: "Returns", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Track Order", href: "/track-order" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#f7f8fa]">
      <div className="shell py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand blurb */}
          <div className="lg:col-span-2">
            <span className="font-display text-xl font-bold text-ink">My Store</span>
            <p className="mt-3 max-w-sm text-sm text-ink-soft">
              Premium products from top brands&apos;s best brands, shipped fast
              and discreetly to your door in the USA.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-ink-soft hover:text-primary">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="TikTok" className="text-ink-soft hover:text-primary">
                <Music2 size={20} />
              </a>
              <a href="#" aria-label="Email" className="text-ink-soft hover:text-primary">
                <Mail size={20} />
              </a>
            </div>

          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-ink">Quick Links</h4>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="text-sm font-semibold text-ink">Customer Service</h4>
            <ul className="mt-3 space-y-2">
              {customerService.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-ink">Join the Club</h4>
            <p className="mt-3 text-sm text-ink-soft">
              New flavors, restocks, and member-only offers in your inbox.
            </p>
            <form className="mt-3 flex gap-2">
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="w-full rounded-pill border border-line bg-white px-4 py-2 text-sm outline-none focus:border-primary"
              />
              <button type="submit" className="btn-primary px-4 py-2 text-xs">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Payment icons */}
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          {["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"].map((p) => (
            <span
              key={p}
              className="rounded-md border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-faint"
            >
              {p}
            </span>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink-faint">
          WARNING: This product contains product. Product is an addictive
          chemical. Not for sale to minors — you must be 21 years of age or
          older to purchase. Keep out of reach of children and pets.
        </p>

        <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} My Store. All rights reserved.</span>
          <span>Fast shipping worldwide.</span>
        </div>
      </div>
    </footer>
  );
}

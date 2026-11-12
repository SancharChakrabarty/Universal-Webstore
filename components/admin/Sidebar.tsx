"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  Boxes,
  ShoppingCart,
  Users,
  Star,
  Settings,
  Gauge,
  Ticket,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/brands", label: "Brands", icon: Tags },
  { href: "/admin/flavors", label: "Flavors", icon: Layers },
  { href: "/admin/bundles", label: "Bundles", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/strength-ranges", label: "Strength Ranges", icon: Gauge },
  { href: "/admin/discount-codes", label: "Discount Codes", icon: Ticket },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const content = (
    <>
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="font-display text-lg font-bold text-ink">
          My Store
        </Link>
        <button onClick={onClose} className="lg:hidden" aria-label="Close menu">
          <X size={20} className="text-ink-soft" />
        </button>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-primary text-white"
                : "text-ink-soft hover:bg-tint hover:text-primary"
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-[#f7f8fa] lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#f7f8fa] shadow-2xl">{content}</aside>
        </div>
      )}
    </>
  );
}

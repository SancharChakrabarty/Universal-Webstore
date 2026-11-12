import Link from "next/link";
import { UserCircle2, Mail } from "lucide-react";

const rows = [
  {
    icon: UserCircle2,
    title: "My Account",
    subtitle: "Orders, addresses, settings",
    href: "/account",
  },
  {
    icon: Mail,
    title: "Contact",
    subtitle: "Get in touch with us",
    href: "/contact",
  },
];

export default function InfoAccountMenu() {
  return (
    <div className="absolute right-0 top-full z-50 w-72 pt-3">
      <div className="rounded-card border border-line bg-white p-5 shadow-xl">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          Info &amp; Account
        </p>
        <div className="mt-4 flex flex-col gap-1">
          {rows.map((row) => (
            <Link
              key={row.href}
              href={row.href}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-tint"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tint">
                <row.icon size={18} className="text-ink-soft" />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">{row.title}</span>
                <span className="block text-xs text-ink-faint">{row.subtitle}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

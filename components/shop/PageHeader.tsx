import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PageHeader({
  title,
  description,
  crumb,
}: {
  title: string;
  description?: string;
  crumb?: string;
}) {
  return (
    <div className="border-b border-line bg-surface py-10">
      <div className="shell">
        <div className="flex items-center gap-1.5 text-xs text-ink-faint">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-ink-soft">{crumb ?? title}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm text-ink-soft">{description}</p>}
      </div>
    </div>
  );
}

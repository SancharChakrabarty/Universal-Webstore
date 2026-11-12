import Link from "next/link";
import { flavors } from "@/lib/data";
import { getFlavorIcon } from "@/lib/flavorIcons";

export default function FlavorsMenu() {
  return (
    <div className="absolute left-1/2 top-full z-50 w-[980px] max-w-[94vw] -translate-x-1/2 pt-3">
      <div className="max-h-[420px] overflow-y-auto overflow-x-hidden rounded-card border border-line bg-white p-6 shadow-xl">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          All Flavors
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {flavors.map((f) => {
            const { icon: Icon, color } = getFlavorIcon(f.name);
            return (
              <Link
                key={f.id}
                href={`/flavors/${f.slug}`}
                className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#f0f4f9] px-3 py-3 text-left transition-colors hover:bg-line/60"
              >
                <span
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${color}1a` }}
                >
                  <Icon size={18} style={{ color }} />
                </span>
                <span className="min-w-0 flex-1 whitespace-normal text-xs font-medium leading-tight text-ink-soft">
                  {f.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

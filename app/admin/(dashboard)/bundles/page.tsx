import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminBundlesPage() {
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to manage bundles.
      </div>
    );
  }

  const { data: bundles } = await admin
    .from("bundles")
    .select("id, name, image_url, bundle_price, is_active, bundle_products(product_id)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-ink">Bundles</h1>
        <Link href="/admin/bundles/new" className="btn-primary">
          <Plus size={15} /> Add Bundle
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(bundles ?? []).map((b: any) => (
          <Link
            key={b.id}
            href={`/admin/bundles/${b.id}`}
            className="card overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] w-full bg-tint">
              {b.image_url && <Image src={b.image_url} alt={b.name} fill className="object-cover" />}
              {!b.is_active && (
                <span className="absolute right-2 top-2 rounded-pill bg-ink px-2 py-0.5 text-xs font-bold text-white">
                  Inactive
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="font-medium text-ink">{b.name}</p>
              <p className="text-xs text-ink-faint">
                {b.bundle_products?.length ?? 0} products · ${b.bundle_price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

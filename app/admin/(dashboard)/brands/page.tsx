import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to manage brands.
      </div>
    );
  }

  const { data: brands } = await admin.from("brands").select("id, name, slug, logo_url").order("name");
  const { data: products } = await admin.from("products").select("brand_id");

  const counts = new Map<string, number>();
  (products ?? []).forEach((p) => {
    if (p.brand_id) counts.set(p.brand_id, (counts.get(p.brand_id) ?? 0) + 1);
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-ink">Brands</h1>
        <Link href="/admin/brands/new" className="btn-primary">
          <Plus size={15} /> Add Brand
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(brands ?? []).map((b) => (
          <Link
            key={b.id}
            href={`/admin/brands/${b.id}`}
            className="card flex items-center gap-3 p-4 transition-shadow hover:shadow-lg"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-tint">
              {b.logo_url && <Image src={b.logo_url} alt={b.name} fill className="object-contain p-1" />}
            </div>
            <div>
              <p className="font-medium text-ink">{b.name}</p>
              <p className="text-xs text-ink-faint">{counts.get(b.id) ?? 0} products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

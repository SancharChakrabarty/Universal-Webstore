import { notFound } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import BrandForm from "@/components/admin/brands/BrandForm";

export const dynamic = "force-dynamic";

export default async function EditBrandPage({ params }: { params: { id: string } }) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to edit brands.
      </div>
    );
  }

  const { data: brand } = await admin.from("brands").select("*").eq("id", params.id).single();
  if (!brand) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-ink">Edit Brand</h1>
      <BrandForm
        brandId={brand.id}
        initial={{
          name: brand.name,
          slug: brand.slug,
          description: brand.description ?? "",
          logo_url: brand.logo_url ?? "",
        }}
      />
    </div>
  );
}

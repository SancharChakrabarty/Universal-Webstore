import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import ReviewsManager from "@/components/admin/ReviewsManager";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to manage reviews.
      </div>
    );
  }

  const { data } = await admin
    .from("reviews")
    .select("id, customer_name, rating, review_text, is_featured, products(name)")
    .order("created_at", { ascending: false });

  const initial = (data ?? []).map((r: any) => ({
    id: r.id,
    customer_name: r.customer_name,
    rating: r.rating,
    review_text: r.review_text,
    is_featured: r.is_featured,
    product_name: r.products?.name ?? null,
  }));

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-ink">Reviews</h1>
      <ReviewsManager initial={initial} />
    </div>
  );
}

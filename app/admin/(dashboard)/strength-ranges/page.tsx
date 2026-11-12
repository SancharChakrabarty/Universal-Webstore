import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import StrengthRangesManager from "./StrengthRangesManager";

export const dynamic = "force-dynamic";

export default async function AdminStrengthRangesPage() {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return (
      <div className="card p-6 text-sm text-ink-soft">
        Add <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
        environment variables to manage strength ranges.
      </div>
    );
  }

  const { data } = await admin.from("strength_ranges").select("*").order("sort_order");

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-ink">Strength Ranges</h1>
      <StrengthRangesManager initial={data ?? []} />
    </div>
  );
}

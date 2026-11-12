import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { DiscountCode } from "@/lib/types";
import DiscountCodesManager from "@/components/admin/DiscountCodesManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Discount Codes — Admin" };

const sampleCodes: DiscountCode[] = [
  { id: "demo-1", code: "WELCOME10", discount_type: "percent", discount_value: 10, expires_at: null, usage_limit: null, usage_count: 0, is_active: true },
];

export default async function DiscountCodesPage() {
  const admin = getSupabaseAdminClient();
  let codes: DiscountCode[] = [];

  if (admin) {
    const { data } = await admin
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });
    codes = (data as DiscountCode[]) ?? [];
  } else {
    codes = sampleCodes;
  }

  return (
    <div>
      <DiscountCodesManager initial={codes} />
      <div className="mt-6 rounded-lg border border-line bg-tint p-4 text-xs text-ink-soft">
        <strong>Auto-send WELCOME10:</strong> The WELCOME10 code (10% off) is automatically emailed to new customers on signup — this is wired into the registration flow and will send via your Resend or email integration once configured. See <code>components/account/RegisterForm.tsx</code> for the hook point.
      </div>
    </div>
  );
}

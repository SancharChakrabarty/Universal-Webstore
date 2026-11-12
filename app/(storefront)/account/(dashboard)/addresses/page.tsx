import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Address } from "@/lib/types";
import AddressCard from "@/components/account/AddressCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Addresses — My Account" };

const sampleAddresses: Record<"billing" | "shipping", Address | null> = {
  billing: {
    id: "demo-billing",
    customer_id: "demo",
    type: "billing",
    full_name: "Jordan Casey",
    line1: "482 Maple Street",
    line2: "Apt 3B",
    city: "Austin",
    state: "TX",
    postal_code: "78701",
    country: "US",
    phone: "(555) 010-2938",
    is_default: true,
  },
  shipping: {
    id: "demo-shipping",
    customer_id: "demo",
    type: "shipping",
    full_name: "Jordan Casey",
    line1: "117 Birchwood Lane",
    line2: null,
    city: "Round Rock",
    state: "TX",
    postal_code: "78664",
    country: "US",
    phone: "(555) 010-2938",
    is_default: true,
  },
};

export default async function AddressesPage() {
  const supabase = getSupabaseServerClient()!;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let addresses: Address[] = [];
  try {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("customer_id", session!.user.id);
    addresses = data ?? [];
  } catch {
    addresses = [];
  }

  const billing = addresses.find((a) => a.type === "billing") ?? null;
  const shipping = addresses.find((a) => a.type === "shipping") ?? null;
  const isSample = addresses.length === 0;

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-ink">Saved Addresses</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Keep a billing and shipping address on file to speed up checkout.
      </p>
      {isSample && (
        <p className="mt-1 text-xs text-ink-faint">
          Sample data shown below — add your own to replace it.
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <AddressCard type="billing" address={isSample ? sampleAddresses.billing : billing} isSample={isSample} />
        <AddressCard type="shipping" address={isSample ? sampleAddresses.shipping : shipping} isSample={isSample} />
      </div>
    </div>
  );
}

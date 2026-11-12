"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Address } from "@/lib/types";
import { saveAddress, deleteAddress, AddressInput } from "@/app/(storefront)/account/(dashboard)/addresses/actions";

const emptyForm = {
  full_name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "US",
  phone: "",
};

export default function AddressCard({
  type,
  address,
  isSample = false,
}: {
  type: "billing" | "shipping";
  address: Address | null;
  isSample?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(
    address
      ? {
          full_name: address.full_name,
          line1: address.line1,
          line2: address.line2 ?? "",
          city: address.city,
          state: address.state ?? "",
          postal_code: address.postal_code,
          country: address.country,
          phone: address.phone ?? "",
        }
      : emptyForm
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const title = type === "billing" ? "Billing Address" : "Shipping Address";

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const input: AddressInput = { id: isSample ? undefined : address?.id, type, ...form };
    startTransition(async () => {
      const res = await saveAddress(input);
      if (!res.ok) {
        setError(res.error ?? "Something went wrong.");
        return;
      }
      setEditing(false);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!address) return;
    startTransition(async () => {
      await deleteAddress(address.id);
      router.refresh();
    });
  };

  if (editing) {
    return (
      <form onSubmit={handleSubmit} className="card flex flex-col gap-3 p-5">
        <h3 className="font-display text-sm font-bold text-ink">{title}</h3>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <input
          required
          placeholder="Full name"
          value={form.full_name}
          onChange={handleChange("full_name")}
          className="rounded-lg border border-line px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Address line 1"
          value={form.line1}
          onChange={handleChange("line1")}
          className="rounded-lg border border-line px-3 py-2 text-sm"
        />
        <input
          placeholder="Address line 2 (optional)"
          value={form.line2}
          onChange={handleChange("line2")}
          className="rounded-lg border border-line px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="City"
            value={form.city}
            onChange={handleChange("city")}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          />
          <input
            placeholder="State / Province"
            value={form.state}
            onChange={handleChange("state")}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Postal code"
            value={form.postal_code}
            onChange={handleChange("postal_code")}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Country"
            value={form.country}
            onChange={handleChange("country")}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          />
        </div>
        <input
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={handleChange("phone")}
          className="rounded-lg border border-line px-3 py-2 text-sm"
        />
        <div className="mt-1 flex gap-3">
          <button type="submit" disabled={isPending} className="btn-primary px-5 py-2.5 text-xs">
            {isPending ? "Saving…" : "Save Address"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError(null);
            }}
            className="text-xs font-semibold text-ink-soft hover:text-ink"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <h3 className="font-display text-sm font-bold text-ink">{title}</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(true)}
            aria-label={`Edit ${title}`}
            className="text-ink-faint hover:text-primary"
          >
            <Pencil size={15} />
          </button>
          {address && !isSample && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              aria-label={`Delete ${title}`}
              className="text-ink-faint hover:text-red-600"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {address ? (
        <div className="mt-3 text-sm text-ink-soft">
          <p className="font-semibold text-ink">{address.full_name}</p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}{address.state ? `, ${address.state}` : ""} {address.postal_code}
          </p>
          <p>{address.country}</p>
          {address.phone && <p className="mt-1 text-ink-faint">{address.phone}</p>}
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-faint">
          No {type} address saved yet.{" "}
          <button onClick={() => setEditing(true)} className="font-semibold text-primary">
            Add one
          </button>
        </p>
      )}
    </div>
  );
}

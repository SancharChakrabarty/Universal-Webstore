"use client";

import { useState, useTransition } from "react";
import { Star, Plus } from "lucide-react";
import QuickToggle from "@/components/admin/QuickToggle";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { showToast } from "@/lib/admin/toast";
import { createReview, toggleReviewFeatured, deleteReview } from "@/app/admin/(dashboard)/reviews/actions";

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  is_featured: boolean;
  product_name: string | null;
};

export default function ReviewsManager({ initial }: { initial: Review[] }) {
  const [reviews, setReviews] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ customer_name: "", rating: 5, review_text: "" });
  const [pending, startTransition] = useTransition();

  const handleAdd = () => {
    startTransition(async () => {
      const result = await createReview({ ...form, product_id: null, is_featured: true });
      if (!result.ok) return showToast(result.error, "error");
      showToast("Review added.");
      setReviews((r) => [
        { id: crypto.randomUUID(), ...form, is_featured: true, product_name: null },
        ...r,
      ]);
      setForm({ customer_name: "", rating: 5, review_text: "" });
      setShowAdd(false);
    });
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button onClick={() => setShowAdd((s) => !s)} className="btn-secondary">
          <Plus size={15} /> Add Review
        </button>
      </div>

      {showAdd && (
        <div className="card mb-5 flex flex-col gap-3 p-5">
          <input
            placeholder="Customer name"
            value={form.customer_name}
            onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
            className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <select
            value={form.rating}
            onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
            className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} stars</option>
            ))}
          </select>
          <textarea
            placeholder="Review text"
            rows={3}
            value={form.review_text}
            onChange={(e) => setForm((f) => ({ ...f, review_text: e.target.value }))}
            className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button disabled={pending} onClick={handleAdd} className="btn-primary self-start disabled:opacity-60">
            {pending ? "Saving…" : "Add Review"}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {reviews.map((r) => (
          <div key={r.id} className="card flex items-start justify-between gap-4 p-4">
            <div className="flex-1">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                ))}
              </div>
              <p className="mt-1 text-sm text-ink-soft">&ldquo;{r.review_text}&rdquo;</p>
              <p className="mt-1 text-xs font-medium text-ink">
                {r.customer_name} {r.product_name && <span className="text-ink-faint">· {r.product_name}</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-ink-faint">
                Featured
                <QuickToggle
                  checked={r.is_featured}
                  onToggle={(next) => toggleReviewFeatured(r.id, next)}
                />
              </div>
              <ConfirmDeleteButton
                itemLabel="this review"
                onDelete={async () => {
                  const result = await deleteReview(r.id);
                  if (result.ok) setReviews((rs) => rs.filter((x) => x.id !== r.id));
                  return result;
                }}
              />
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-faint">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

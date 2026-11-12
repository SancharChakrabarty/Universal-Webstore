"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import SupabaseSetupNotice from "./SupabaseSetupNotice";

type WelcomeCode = { code: string; discountValue: number } | null;

export default function RegisterForm({ welcomeCode }: { welcomeCode?: WelcomeCode }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured()) return <SupabaseSetupNotice />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ageConfirmed) {
      setError("You must confirm you are 21 years of age or older to register.");
      return;
    }

    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase!.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    // Store the welcome code so checkout auto-applies it
    if (welcomeCode) {
      try { localStorage.setItem("pc_pending_promo", welcomeCode.code); } catch {}
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="card mx-auto max-w-md p-6 text-center">
        <span className="text-4xl">🎉</span>
        <h2 className="mt-3 font-display text-base font-bold text-ink">
          Welcome to My Store!
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          We sent a confirmation link to <strong>{email}</strong>. Confirm your email, then sign in.
        </p>

        {welcomeCode && (
          <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Your {welcomeCode.discountValue}% Off Promo Code
            </p>
            <p className="mt-1 font-display text-2xl font-bold tracking-widest text-primary">
              {welcomeCode.code}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              Use this at checkout to save {welcomeCode.discountValue}% on your first order.
            </p>
          </div>
        )}

        <Link href="/account/login" className="btn-primary mt-5 inline-flex">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto flex max-w-md flex-col gap-4 p-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Full Name
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Password
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <label className="flex items-start gap-2 text-xs text-ink-soft">
        <input
          type="checkbox"
          checked={ageConfirmed}
          onChange={(e) => setAgeConfirmed(e.target.checked)}
          className="mt-0.5"
        />
        I confirm that I am 21 years of age or older.
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/account/login" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { verifyAdminLogin } from "@/app/admin/login/actions";

export default function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    params.get("denied") ? "This account doesn't have admin access." : null
  );
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <div className="card mx-auto max-w-sm p-6 text-center">
        <h2 className="font-display text-base font-bold text-ink">Admin panel not connected</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Add <code className="rounded bg-tint px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="rounded bg-tint px-1 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
          <code className="rounded bg-tint px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your
          environment variables. See the README&apos;s &ldquo;Admin Access Setup&rdquo; section.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseBrowserClient()!;
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.session) {
      setError(authError?.message ?? "Invalid email or password.");
      setLoading(false);
      return;
    }

    const result = await verifyAdminLogin(data.session.user.id);
    if (!result.ok) {
      await supabase.auth.signOut();
      setError(result.reason ?? "Access denied.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="card mx-auto flex max-w-sm flex-col gap-4 p-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Admin Email
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Signing in…" : "Sign In to Admin"}
      </button>
    </form>
  );
}

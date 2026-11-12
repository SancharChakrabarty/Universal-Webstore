export default function SupabaseSetupNotice() {
  return (
    <div className="card mx-auto max-w-md p-6 text-center">
      <h2 className="font-display text-base font-bold text-ink">
        Accounts aren&apos;t connected yet
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        Add your <code className="rounded bg-tint px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="rounded bg-tint px-1 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your
        environment variables to enable sign in, registration, and order history. See the README
        for setup steps.
      </p>
    </div>
  );
}

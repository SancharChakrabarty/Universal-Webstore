import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex flex-col items-center justify-center gap-4 py-32 text-center">
      <span className="font-display text-7xl font-bold text-primary">404</span>
      <h1 className="font-display text-2xl font-bold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist, or may have moved.
        Let&apos;s get you back to the good stuff.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

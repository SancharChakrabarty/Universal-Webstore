import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  // Never gate the login page itself, or we'd create a redirect loop.
  if (req.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // If Supabase isn't configured yet, send to login — it renders a
  // "connect Supabase" notice instead of a broken admin panel.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("is_admin")
    .eq("id", session.user.id)
    .single();

  if (!customer?.is_admin) {
    return NextResponse.redirect(new URL("/admin/login?denied=1", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};

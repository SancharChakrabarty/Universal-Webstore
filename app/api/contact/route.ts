import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerComponentClient({ cookies });
      await supabase.from("contact_messages").insert({ name, email, message });
    } catch {
      // If the insert fails (e.g. table not migrated yet), still acknowledge
      // receipt rather than blocking the user — log server-side in a real deploy.
    }
  }

  return NextResponse.json({ ok: true });
}

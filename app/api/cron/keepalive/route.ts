import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase environment variables not configured" },
      { status: 503 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    // Lightweight HEAD query to keep database active and prevent 7-day inactivity pause
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      productsInDb: count,
      message: "Supabase keepalive ping successful",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

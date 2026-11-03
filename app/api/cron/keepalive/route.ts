import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 10;

export async function GET() {
  const timestamp = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    console.error(`[keepalive] ${timestamp} — Supabase not configured`);
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
      console.error(`[keepalive] ${timestamp} — Supabase query error:`, error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    console.log(`[keepalive] ${timestamp} — Ping OK, ${count} products in DB`);

    return NextResponse.json({
      ok: true,
      timestamp,
      productsInDb: count,
      message: "Supabase keepalive ping successful",
    });
  } catch (err: any) {
    console.error(`[keepalive] ${timestamp} — Unexpected error:`, err?.message);
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

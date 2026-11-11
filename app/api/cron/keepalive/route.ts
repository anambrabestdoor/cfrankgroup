import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function GET() {
  const timestamp = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    console.warn(`[keepalive] ${timestamp} — Supabase environment variables not configured`);
    return NextResponse.json(
      {
        ok: false,
        error: "Supabase environment variables not configured",
        hint: "Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment variables.",
      },
      { status: 503 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    // 1. Read query: fetch product count
    const { count, error: readError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    if (readError) {
      console.error(`[keepalive] ${timestamp} — Supabase read query error:`, readError.message);
      return NextResponse.json({ ok: false, error: readError.message }, { status: 500 });
    }

    // 2. Real PostgreSQL write transaction: touch site_settings.updated_at
    // CRITICAL FOR FREE TIER: Supabase's auto-pause monitor looks for active PostgreSQL WAL & I/O.
    // Pure HEAD requests or cached queries can be bypassed by Supabase's pause monitor.
    // An active UPDATE ensures the PostgreSQL backend registers real transaction activity.
    const { error: writeError } = await supabase
      .from("site_settings")
      .update({ updated_at: timestamp })
      .eq("id", "global");

    let touched = true;
    if (writeError) {
      console.warn(`[keepalive] ${timestamp} — Settings touch notice:`, writeError.message);
      touched = false;
    }

    console.log(
      `[keepalive] ${timestamp} — Ping OK, products in DB: ${count ?? 0}, write transaction active: ${touched}`
    );

    return NextResponse.json({
      ok: true,
      timestamp,
      productsInDb: count ?? 0,
      writeTransactionActive: touched,
      message: "Supabase keepalive read + write ping successful",
    });
  } catch (err: any) {
    console.error(`[keepalive] ${timestamp} — Unexpected keepalive error:`, err?.message);
    return NextResponse.json({ ok: false, error: err?.message || "Keepalive ping failed" }, { status: 500 });
  }
}

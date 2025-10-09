export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    let body = await req.json();

    // --- DEMO OVERRIDE ---
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    if (isDemoMode) {
      console.warn("⚠️ Running in DEMO mode — overriding request options.");
      body.request_us_criminal_record_check_tier_1 = true;
    }
    // ----------------------

    const CERTN_API_KEY = process.env.CERTN_API_KEY || "";

    // ✅ Skip external API call gracefully if env var missing
    if (!CERTN_API_KEY) {
      console.warn("⚠️ Missing CERTN_API_KEY — skipping Certn API call.");
      return NextResponse.json(
        {
          success: false,
          message: "CERTN_API_KEY not configured. Skipped Certn API request.",
          bodyReceived: body,
        },
        { status: 200 }
      );
    }

    const res = await fetch("https://demo-api.certn.co/hr/v1/applications/invite/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CERTN_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let errData;
      try {
        errData = await res.json();
      } catch {
        errData = { message: "Certn API error (non-JSON response)" };
      }

      console.warn("⚠️ Certn API error:", errData);
      return NextResponse.json({ success: false, error: errData }, { status: res.status || 400 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("⚠️ Internal error in POST /api route:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 200 });
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
    }

    const CERTN_API_KEY = process.env.CERTN_API_KEY || "";

    // ✅ If env var missing, skip API call gracefully
    if (!CERTN_API_KEY) {
      console.warn("⚠️ Missing CERTN_API_KEY — skipping Certn API call.");
      return NextResponse.json(
        {
          message: "CERTN_API_KEY not configured. Skipped Certn API request.",
          success: false,
        },
        { status: 200 }
      );
    }

    const certnRes = await fetch(`https://api.certn.co/api/v1/applications/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CERTN_API_KEY}`,
      },
    });

    if (!certnRes.ok) {
      const text = await certnRes.text();
      console.warn("⚠️ Certn API responded with error:", text);
      return NextResponse.json(
        { error: `Certn API error: ${text}`, success: false },
        { status: certnRes.status || 400 }
      );
    }

    const data = await certnRes.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("⚠️ Error fetching Certn data:", error);
    return NextResponse.json({ error: error.message, success: false }, { status: 500 });
  }
}

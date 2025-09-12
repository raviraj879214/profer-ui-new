import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    let body = await req.json();

    // --- DEMO OVERRIDE ---
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      body.request_us_criminal_record_check_tier_1 = true;
    }
    // ----------------------

    const res = await fetch(
      "https://demo-api.certn.co/hr/v1/applications/invite/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CERTN_API_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errData = await res.json();
      return NextResponse.json({ error: errData }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

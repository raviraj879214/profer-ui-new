import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Get JSON body from frontend
    const body = await req.json();

    // Call Certn API from server-side
    const res = await fetch("https://demo-api.certn.co/hr/v1/applications/quick/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CERTN_API_KEY}`, // server-only
      },
      body: JSON.stringify(body),
    });

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

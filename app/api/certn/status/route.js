import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
    }

    // Call Certn API
    const certnRes = await fetch(`https://api.certn.co/api/v1/applications/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CERTN_API_KEY}`, // 👈 use your real API key
      },
    });

    if (!certnRes.ok) {
      const text = await certnRes.text();
      return NextResponse.json({ error: `Certn API error: ${text}` }, { status: certnRes.status });
    }

    const data = await certnRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const accessToken =
      searchParams.get("token") ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    // ✅ Skip gracefully if no token
    if (!accessToken) {
      console.warn("⚠️ No access token provided for Gmail fetch");
      return new Response(
        JSON.stringify({ error: "Missing access token, skipping Gmail fetch" }),
        { status: 400 }
      );
    }

    // ✅ Fetch Gmail messages list
    const gmailRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!gmailRes.ok) {
      const errorText = await gmailRes.text();
      console.warn("⚠️ Gmail API response error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch Gmail messages", details: errorText }),
        { status: gmailRes.status }
      );
    }

    const gmailData = await gmailRes.json();
    let messages = [];

    // ✅ Fetch message details if any
    if (gmailData.messages) {
      for (const msg of gmailData.messages.slice(0, 5)) {
        try {
          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const detail = await detailRes.json();
          messages.push({ id: msg.id, snippet: detail.snippet || "No snippet" });
        } catch (err) {
          console.warn(`⚠️ Failed to fetch details for message ${msg.id}:`, err.message);
        }
      }
    }

    return new Response(JSON.stringify({ messages }), { status: 200 });
  } catch (error) {
    console.error("❌ Gmail API route error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected server error", details: error.message }),
      { status: 500 }
    );
  }
}

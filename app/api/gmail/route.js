export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const accessToken = searchParams.get("token") || req.headers.get("authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "No access token" }), { status: 401 });
  }

  // Fetch Gmail messages
  const gmailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const gmailData = await gmailRes.json();

  // Optional: fetch snippets for each email
  let messages = [];
  if (gmailData.messages) {
    for (const msg of gmailData.messages.slice(0, 5)) {
      const detailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const detail = await detailRes.json();
      messages.push({ id: msg.id, snippet: detail.snippet });
    }
  }

  return new Response(JSON.stringify({ messages }), { status: 200 });
}

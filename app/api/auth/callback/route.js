export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  // Read env vars safely (fallback to empty string)
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";
  const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.profer.com";

  // If missing vars, skip the external call gracefully
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    console.warn("⚠️ Missing Google OAuth environment variables — skipping token exchange.");
    return new Response(
      JSON.stringify({
        message: "Missing Google environment variables, skipped token exchange.",
        success: false,
      }),
      { status: 200 }
    );
  }

  if (!code) {
    console.warn("⚠️ No authorization code provided — skipping.");
    return new Response(
      JSON.stringify({
        message: "No authorization code provided.",
        success: false,
      }),
      { status: 200 }
    );
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.warn("⚠️ Google token error:", tokenData);
      return new Response(JSON.stringify({ success: false, error: tokenData }), { status: 200 });
    }

    // Redirect safely even if NEXT_PUBLIC_APP_URL missing
    const redirectUrl = `${NEXT_PUBLIC_APP_URL}?access_token=${tokenData.access_token || ""}`;
    return Response.redirect(redirectUrl);
  } catch (err) {
    console.error("⚠️ OAuth error:", err);
    return new Response(JSON.stringify({ success: false, error: "Internal error" }), { status: 200 });
  }
}

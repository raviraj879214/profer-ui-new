export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();

  // Redirect to home with access token in query for now (in real app, store securely)
  return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?access_token=${tokenData.access_token}`);
}

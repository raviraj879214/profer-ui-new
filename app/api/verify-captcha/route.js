

export async function POST(req) {
  try {
    const { captchatoken } = await req.json();

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${captchatoken}`,
    });

    const data = await res.json();

    // success + score threshold check
    if (data.success && data.score >= 0.5) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, score: data.score });
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

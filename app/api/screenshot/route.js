import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const dynamic = "force-dynamic"; // ensures server-side execution

export async function GET(request) {
  const url = "http://localhost:3000/prooverview/67";
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();

    return new Response(screenshot, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="screenshot.png"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to take screenshot" }, { status: 500 });
  }
}

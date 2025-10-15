export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request) {
  console.log("✅ PDF Generation Started");

  try {
    // ✅ Environment variable check (log only)
    const frontendUrl = process.env.NEXT_FORNTEND_PUBLIC_URL;
    if (!frontendUrl) {
      console.log("⚠️ Missing environment variable: NEXT_FORNTEND_PUBLIC_URL");
      return NextResponse.json(
        { success: false, message: "Missing config: NEXT_FORNTEND_PUBLIC_URL" },
        { status: 200 }
      );
    }

    // ✅ Get ID from body (log only)
    const { id } = await request.json().catch(err => {
      console.log("❌ Invalid JSON in request:", err);
      return {};
    });

    if (!id) {
      console.log("⚠️ No 'id' provided in request body");
      return NextResponse.json(
        { success: false, message: "Missing id in request" },
        { status: 200 }
      );
    }

    console.log(`📄 Generating PDF for ID: ${id}`);

    // ✅ Launch Puppeteer
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,2000'],
        defaultViewport: { width: 1200, height: 2000, isMobile: false },
      });
    } catch (err) {
      console.log("❌ Puppeteer launch failed:", err);
      return NextResponse.json(
        { success: false, message: "Puppeteer failed to launch" },
        { status: 200 }
      );
    }

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    const targetUrl = `${frontendUrl}/prooverview/${id}?export=true`;
    console.log("🌐 Navigating to:", targetUrl);

    // ✅ Go to URL
    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 60000 });
    } catch (err) {
      console.log("❌ Page navigation failed:", err);
      await browser.close();
      return NextResponse.json(
        { success: false, message: "Unable to load page" },
        { status: 200 }
      );
    }

    // ✅ Wait for images safely
    try {
      await page.evaluate(async () => {
        const imgs = Array.from(document.querySelectorAll('img'));
        await Promise.all(
          imgs.map(img => {
            if (img.complete) return;
            return new Promise(resolve => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve); // resolve even if error
            });
          })
        );
      });
    } catch (err) {
      console.log("⚠️ Image wait failed:", err);
    }

    // ✅ Content height
    let bodyHeight = 1500;
    try {
      bodyHeight = await page.evaluate(() => document.body.scrollHeight || 1500);
    } catch (err) {
      console.log("⚠️ Failed to measure body height:", err);
    }

    console.log("📏 Content height:", bodyHeight);

    // ✅ Generate PDF
    let pdf;
    try {
      pdf = await page.pdf({
        width: '1200px',
        height: `${bodyHeight + 100}px`,
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
        pageRanges: '1',
      });
    } catch (err) {
      console.log("❌ PDF creation failed:", err);
      await browser.close();
      return NextResponse.json(
        { success: false, message: "PDF generation failed" },
        { status: 200 }
      );
    }

    await browser.close();
    console.log("✅ PDF Generated Successfully");

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="pro-overview-${id}.pdf"`,
      },
    });

  } catch (error) {
    console.log("❌ Unexpected Error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 200 }
    );
  }
}

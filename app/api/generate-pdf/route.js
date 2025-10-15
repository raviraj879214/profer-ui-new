export const dynamic = 'force-dynamic';

// app/api/generate-pdf/route.js
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request) {
  try {
    // ✅ Safe check for env variable
    const frontendUrl = process.env.NEXT_FORNTEND_PUBLIC_URL;
    if (!frontendUrl) {
      console.warn("⚠️ Missing NEXT_FORNTEND_PUBLIC_URL environment variable");
      return NextResponse.json(
        { error: "Server missing configuration: NEXT_FORNTEND_PUBLIC_URL" },
        { status: 400 }
      );
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing 'id' in request body" }, { status: 400 });
    }

    // ✅ Launch Puppeteer safely
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,2000'],
      defaultViewport: {
        width: 1200,
        height: 2000,
        isMobile: false,
      },
    });

    const page = await browser.newPage();

    // ✅ Desktop user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    // ✅ Navigate to the dynamic page
    const targetUrl = `${frontendUrl}/prooverview/${id}?export=true`;
    console.log("📄 Generating PDF from:", targetUrl);

    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for images
    await page.evaluate(async () => {
      const selectors = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        selectors.map((img) => {
          if (img.complete) return;
          return new Promise((resolve, reject) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', reject);
          });
        })
      );
    });

    // ✅ Measure content height
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

    // ✅ Generate PDF
    const pdf = await page.pdf({
      width: '1200px',
      height: `${bodyHeight + 100}px`,
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      pageRanges: '1',
    });

    await browser.close();

    // ✅ Return file
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="pro-overview-${id}.pdf"`,
      },
    });
} catch (error) {
  
  console.log('❌ PDF generation error:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
  });

  return NextResponse.json(
    {
      error: 'Failed to generate PDF',
      details: error.message,
    },
    { status: 500 }
  );
}

// app/api/generate-pdf/route.js
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request) {
  try {
    const { id } = await request.json();
    
    // Launch Puppeteer with a specific viewport for desktop
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--window-size=1200,2000' // Set a large window size for desktop
      ],
      defaultViewport: {
        width: 1200,
        height: 2000,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
      }
    });
    
    const page = await browser.newPage();
    
    // Set a desktop user agent to ensure desktop version is served
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to the pro overview page
    await page.goto(`${process.env.NEXT_FORNTEND_PUBLIC_URL}/prooverview/${id}?export=true`, {
      waitUntil: 'networkidle0'
    });
    
    // Wait for all images to load
    await page.evaluate(async () => {
      const selectors = Array.from(document.querySelectorAll("img"));
      await Promise.all(selectors.map(img => {
        if (img.complete) return;
        return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', reject);
        });
      }));
    });
    
    // Get the full height of the page content
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    
    // Generate PDF with custom size to fit content on one page
    const pdf = await page.pdf({
      width: '1200px',
      height: `${bodyHeight + 100}px`, // Add some extra space
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      pageRanges: '1' // Force single page
    });
    
    await browser.close();
    
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="pro-overview-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
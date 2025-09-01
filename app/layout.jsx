"use client";

import "./globals.css";
import { usePathname, useSearchParams } from "next/navigation";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { SiteLayout } from "./SiteLayout";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAdmin = pathname?.startsWith("/admin");
  const isExportMode = searchParams?.get("export") === "true";

  return (
    <html lang="en">
      <body className={`flex flex-col min-h-screen ${!isAdmin && !isExportMode ? "pt-20" : ""}`}>
        <main className="flex-grow">
          {isExportMode ? (
            children
          ) : (
            <GoogleReCaptchaProvider
              reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            >
              <SiteLayout>{children}</SiteLayout>
            </GoogleReCaptchaProvider>
          )}
        </main>
      </body>
    </html>
  );
}

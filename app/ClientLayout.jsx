"use client";

import { usePathname } from "next/navigation";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { SiteLayout } from "./SiteLayout";
import "../app/globals.css";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <body
      className={`flex flex-col min-h-screen ${
        isAdmin ? "" : ""
      }`}
    >
      <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
        <SiteLayout>{children}</SiteLayout>
      </GoogleReCaptchaProvider>
    </body>
  );
}

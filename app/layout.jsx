"use client"; // <-- Add this at the top

import "./globals.css";
import { Header } from "@/components/Frontend/shared/Header";
import { Footer } from "@/components/Frontend/shared/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {SiteLayout} from "./SiteLayout";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import {CookieConsent} from "../components/CookiesManagement/Cookiesterms";


export default function RootLayout({ children }) {

   const pathname = usePathname();
   const isAdmin = pathname.startsWith("/admin");



  return (

    <html lang="en">
  <body
    className={`flex flex-col min-h-screen ${
      isAdmin
        ? "px-1 sm:px-1 lg:px-8"       // Responsive horizontal padding
        : "pt-20 px-1 sm:px-1 lg:px-1" // Add top padding for non-admins + responsive sides
    }`}
  >
    <main className="flex-grow">
      <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
        <SiteLayout>{children}</SiteLayout>
      </GoogleReCaptchaProvider>
    </main>
  </body>
</html>



    
  );
}
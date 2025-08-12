"use client"; // <-- Add this at the top

import "./globals.css";
import { Header } from "@/components/Frontend/shared/Header";
import { Footer } from "@/components/Frontend/shared/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {SiteLayout} from "./SiteLayout";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function RootLayout({ children }) {



  return (
    <html lang="en">  
      <body>
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
            <SiteLayout>{children}</SiteLayout>
        </GoogleReCaptchaProvider>
      </body>
    </html>
  );
}
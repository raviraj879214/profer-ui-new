"use client"; // <-- Add this at the top

import "./globals.css";
import { Header } from "@/components/Frontend/shared/Header";
import { Footer } from "@/components/Frontend/shared/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {SiteLayout} from "./SiteLayout";


export default function RootLayout({ children }) {



  return (
    <html lang="en">  
      <body>
         <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
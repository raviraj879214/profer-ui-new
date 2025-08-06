


'use client';  // This makes it re-render on navigation
import { Header } from "@/components/Frontend/shared/Header";
import { Footer } from "@/components/Frontend/shared/Footer";
import { usePathname } from "next/navigation";



export  function SiteLayout({ children }) {
    const pathname = usePathname();
    const hideLayout = pathname?.startsWith("/pro") ||  pathname?.startsWith("/admin"); // this will now work

  



    



  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
        {children}
        {!hideLayout && <Footer />}
    </div>
  );
}

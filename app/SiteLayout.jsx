


'use client';  // This makes it re-render on navigation
import { MainHeader } from "@/components/Frontend/shared/MainHeader";
import { Footer } from "@/components/Frontend/shared/Footer";
import { usePathname } from "next/navigation";



export  function SiteLayout({ children }) {
    const pathname = usePathname();
    const hideLayout = pathname?.startsWith("/pro") ||  pathname?.startsWith("/admin"); // this will now work

  


  return (
   
      <>
      { <MainHeader />}
        {children}
      </>
        
   
  );
}

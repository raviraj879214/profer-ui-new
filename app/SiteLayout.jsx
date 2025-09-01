


'use client';  // This makes it re-render on navigation
import { MainHeader } from "@/components/Frontend/shared/MainHeader";
import {MainFooter} from "../components/Frontend/shared/MainFooter";
import { usePathname } from "next/navigation";



export  function SiteLayout({ children }) {
    const pathname = usePathname();
    const hideLayout = pathname?.startsWith("/pro") ||  pathname?.startsWith("/admin"); // this will now work

  


  return (
   
      <>
      { <MainHeader />}
        {children}
      {<MainFooter />}
      </>
        
   
  );
}

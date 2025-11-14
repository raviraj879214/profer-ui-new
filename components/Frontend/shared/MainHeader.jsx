"use client";
import { useEffect, useState } from "react";
import { Header } from "../../Frontend/shared/Header";
import { ProHeader } from "../../ProsArea/shared/ProHeader";
import { usePathname, useRouter } from "next/navigation";
import { AdminSubHeader } from "@/components/Areas/shared/AdminSubHeader";
import { AdminHeader } from "@/components/Areas/shared/Header";

export function MainHeader() {
  const [role, setRole] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

   const isProOverview = pathname.startsWith("/prooverview");

  useEffect(() => {
   
    debugger;
    const storedRole = document.cookie.split("; ").find((row) => row.startsWith("role="))?.split("=")[1];

    if (storedRole) {
      setRole(storedRole);
    }
    
  }, []);

  useEffect(() => {
   


  if (role === "admin" && !pathname.startsWith("/admin")) {
      router.push("/admin/dashboard"); // force redirect
    }
  }, [role, pathname, router]);




  if (pathname.startsWith("/admin") && !pathname.startsWith('/admin-login'))
 {
    return null;
  }
  
  if (pathname === "/admin-login") {
  return <AdminHeader></AdminHeader>;
}




  if(isProOverview){
    return null;
  }


  if (role === "Pro") {
    return <ProHeader />;
  }
  

  
  return <Header />;
}

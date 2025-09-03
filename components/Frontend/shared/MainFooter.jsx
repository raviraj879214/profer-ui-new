"use client";
import { useEffect, useState } from "react";
import { Header } from "../../Frontend/shared/Header";
import { ProHeader } from "../../ProsArea/shared/ProHeader";
import { usePathname, useRouter } from "next/navigation";
import { Footer } from "./Footer";
import {AdminFooter} from "../../Areas/shared/Footer";

export function MainFooter() {
  const [role, setRole] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const isProOverview = pathname.startsWith("/prooverview");

  useEffect(() => {
    // Get cookie value for role
    const storedRole = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    // ✅ Restrict admin to only /admin routes
    if (role === "admin" && !pathname.startsWith("/admin")) {
      router.push("/admin/dashboard"); // force redirect
    }
  }, [role, pathname, router]);

  
  if(isProOverview){
    return null;
  }


  
  // ✅ Hide header for admin inside /admin
  if (role === "admin" && pathname.startsWith("/admin")) {
    return <AdminFooter />;
  }

  
  
  return <Footer />;
}

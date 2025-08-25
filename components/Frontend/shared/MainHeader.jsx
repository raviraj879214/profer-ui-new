"use client";
import { useEffect, useState } from "react";
import { Header } from "../../Frontend/shared/Header";
import { ProHeader } from "../../ProsArea/shared/ProHeader";
import { usePathname, useRouter } from "next/navigation";

export function MainHeader() {
  const [role, setRole] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

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

  // ✅ Hide header for admin inside /admin
  if (role === "admin" && pathname.startsWith("/admin")) {
    return null;
  }

  // ✅ Show ProHeader for Pros
  if (role === "Pro") {
    return <ProHeader />;
  }

  // ✅ Default header for everyone else
    
  
    
  
  return <Header />;
}

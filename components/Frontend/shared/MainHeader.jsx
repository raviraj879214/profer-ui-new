"use client";
import { useEffect, useState } from "react";
import { Header } from "../../Frontend/shared/Header";
import { ProHeader } from "../../ProsArea/shared/ProHeader";
import { usePathname, useRouter } from "next/navigation";

export  function MainHeader() {
  const [role, setRole] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get cookie value
    const storedRole = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  debugger;
     if (role === "admin" && pathname.startsWith("/admin")) {
         return null;
      }
      else if (role === "Pro") 
      {
        return <ProHeader />;
      }
      else 
      {
        return <Header />;
      }
}

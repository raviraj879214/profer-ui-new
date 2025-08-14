"use client";
import { useEffect, useState } from "react";
import { Header } from "../../Frontend/shared/Header";
import { ProHeader } from "../../ProsArea/shared/ProHeader";

export  function MainHeader() {
  const [role, setRole] = useState(null);

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
      if (role === "admin") {
        return null; // no JSX for admin
      } else if (role === "Pro") {
        return <ProHeader />;
      } else {
        return <Header />;
      }
}

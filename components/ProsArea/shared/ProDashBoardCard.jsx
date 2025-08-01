"use client";
import { useEffect, useState } from "react";

export function ProDashBoardHero() {
  const [company, setCompany] = useState({
    companyName: "",
    companyLogo: "",
    streetAddress : "",
    city : "",
    state : "",
    zip : ""
  });

  useEffect(() => {
    fetchuserdetails();
  }, []);

  const fetchuserdetails = async () => {
    const userid = localStorage.getItem("UserID");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-business-details/${userid}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200 && result.data.length > 0) {
          setCompany({
            companyName: result.data[0]?.companyName || "",
            companyLogo: result.data[0]?.companyLogo || "",
            city : result.data[0]?.city || "",
            state : result.data[0]?.state || "",
            zip : result.data[0]?.zip || "",
            streetAddress : result.data[0]?.streetAddress || "",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching company details:", err);
    }
  };

  return (
    <div className="relative bg-[#C1E5EC] p-8 pb-20 rounded-b-3xl mt-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-6">
        <div className="flex-shrink-0 w-24 h-24">
          <img
            src={company.companyLogo || "/placeholder-logo.png"}
            alt={company.companyName || "Company Logo"}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="font-bold text-xl text-[#012C43] flex items-center gap-2">
            {company.companyName || "Company Name"}
          </h1>
          <p className="text-gray-500 mt-1">{company.state} {company.city} {company.streetAddress} {company.zip}</p>
          <p className="flex items-center space-x-2 text-gray-400 mt-2 font-medium">
            
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";

export function ProDashBoardHero() {
  const [company, setCompany] = useState({
    id : "",
    companyName: "",
    companyLogo: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    verified: true, // For demo, you can toggle this based on your data
  });
  const [logoSrc, setLogoSrc] = useState("/placeholder-logo.png");
  const [logoLoaded, setLogoLoaded] = useState(false);
  
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const userid = localStorage.getItem("UserID");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-business-details/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200 && result.data.length > 0) {
          const data = result.data[0];
          console.log("business details",data);
          debugger;
          setCompany({
            id : data?.id,
            companyName: data?.companyName || "",
            companyLogo: data?.companyLogo || "",
            city: data?.city || "",
            state: data?.state || "",
            zip: data?.zip || "",
            streetAddress: data?.streetAddress || "",
            verified: data?.user.status,
          });
        
          if (data?.companyLogo) {
            setLogoSrc(data.companyLogo);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching company details:", err);
    }
  };

  return (
    <div className=" relative bg-[#C1E5EC] rounded-b-3xl p-6 sm:p-8 flex items-center justify-between mt-25 shadow-md ">
      {/* Left Side: Logo + Info */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* Logo with rounded corners */}
       <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white shadow">
  <img
    src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${logoSrc}`}
    alt={company.companyName || "Company Logo"}
    className={`w-full h-full object-contain transition-opacity duration-500 ${
      logoLoaded ? "opacity-100" : "opacity-0"
    }`}
    onLoad={() => setLogoLoaded(true)}
  />

  {company.verified == "4" && (
    <span className="absolute bottom-0 right-0">
      <VerifiedCheckIcon />
    </span>
  )}
</div>

        

        
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-[#012C43]">
            {company.companyName || "Not Updated"}   

           

          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            {company.city && company.state
              ? `${company.city}, ${company.state}`
              : "Location not available"}
          </p>
         <div className="mt-1 text-sm sm:text-base">
  {company.verified == "4" ? (
    <h3 className="text-lg font-bold">
      Pro<span className="text-red-600">Verified</span>™
    </h3>
  ) : (
    <h3 className="text-lg font-bold">
      Un <span className="text-red-600">Verified</span>™
    </h3>
  )}
</div>





        </div>
      </div>

      {/* Right Side: View Public ProFile™ */}
      <div>
        <a
          href={`/pro-overview/${company.id}`} // Adjust this link accordingly
          className="text-cyan-500 text-sm sm:text-base hover:underline font-medium cursor-pointer"
        >
          View Public ProFile<span className="text-xs">™</span>
        </a>
      </div>
    </div>
  );
}

/* Verified Check Icon */
function VerifiedCheckIcon() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 bg-cyan-400 rounded-full">
      <img src={"/images/4.png"}></img>
    </span>
  );
}

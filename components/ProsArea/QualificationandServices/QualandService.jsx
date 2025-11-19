import { useEffect, useState } from "react";

export function QualandServe() {
  const [services, setServices] = useState([]);
  const [qualification, setQualification] = useState([]);
     const [userId, setUserId] = useState(null);




  const fetchQualification = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/qualification/getnames`
    );
    if (res.ok) {
      const result = await res.json();
      const names = result.map((item) => item.name);
      setQualification(names);
    }
  };

  const fetchServices = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/services/get-services`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      const result = await res.json();
      const names = result.map((item) => item.name);
      setServices(names);
    }
  };
















  useEffect(() => {
    // fetchQualification();
    // fetchServices();
     const storedId = localStorage.getItem("UserID");
    if (storedId) setUserId(storedId);
    
    
     async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/create-pros-business-request/${storedId}`
        );
        if (res.ok) {
            debugger;
          const { business } = await res.json();
          console.log("business",business);
          if (!business) return;


          setServices(safeParse(business.services));
          setQualification(safeParse(business.qualifications));

        }
      } catch (err) {
        console.error(err);
      }
    }
    
    fetchData();
  }, []);


    const safeParse = (val) => {
    if (!val) return [];
    let parsed = val;
    try {
      while (typeof parsed === "string") parsed = JSON.parse(parsed);
      if (Array.isArray(parsed)) {
        return parsed
          .flat(Infinity)
          .map((s) => String(s).replace(/['"]+/g, "").trim())
          .filter(Boolean);
      }
      return [];
    } catch {
      return String(val)
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((s) => s.replace(/['"]+/g, "").trim())
        .filter(Boolean);
    }
  };


  return (
    <div className="p-4 border rounded-lg bg-white space-y-6 mt-5">
      {/* Services Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Services</h3>

        <div className="flex flex-wrap gap-2">
          {services.map((item) => (
            <span
              key={item}
              className="px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Badges Section */}
      <h3 className="text-lg font-semibold mb-2">Qualifications</h3>

      <div className="flex flex-wrap gap-2">
         {qualification.map((item) => (
            <span
              key={item}
              className="px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        
      </div>
    </div>
  );
}

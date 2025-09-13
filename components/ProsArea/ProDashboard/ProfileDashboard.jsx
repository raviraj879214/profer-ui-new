"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {ProCredentialList} from "../../../components/ProsArea/shared/ProCredentialsList";
/* ---------- Editable Field Component ---------- */
function EditableField({ icon, field, value, setValue, linkPrefix, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
 
  const handleSave = () => {
    setValue(tempValue);
    if (onSave) onSave(field, tempValue);
    setIsEditing(false);
  };

  return (
    <li className="flex items-center space-x-3">
      {icon}
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={`Enter ${field}`}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-auto"
          />
          <button
            onClick={handleSave}
            className="text-green-600 font-bold hover:text-green-800"
          >
            ✓
          </button>
        </div>
      ) : (
        <>
          {value ? (
            linkPrefix ? (
              <a
                href={`${linkPrefix}${value}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {value}
              </a>
            ) : value.startsWith("http") ? (
              <a href={value} target="_blank" rel="noopener noreferrer">
                {value}
              </a>
            ) : (
              <span>{value}</span>
            )
          ) : (
            <span className="text-gray-400 italic">Not provided</span>
          )}
          <button
            onClick={() => {
              setTempValue(value || "");
              setIsEditing(true);
            }}
            className="text-gray-500 hover:text-gray-700 ml-2"
          >
            ✎
          </button>
        </>
      )}
    </li>
  );
}

export function ProDash() {
  const [aboutInfo, setAboutInfo] = useState({
    phone: "",
    website: "",
    maps: "",
    facebook: "",
    googlebusinesslisting: "",
    bingbusinesslisting: "",
    linkedin: "",
    linktoyourwebsite: "",

  });
   const [year,setyear] = useState("");
   const [verified,setverified] = useState(0);
  const [message, setMessage] = useState("");

  /* Fetch social links */
  const fetchsocialmedialinks = async () => {
    try {
      const token = localStorage.getItem("token");
      const userid = localStorage.getItem("UserID");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-social-links-business/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error("Error fetching social links:", res.status);
        return;
      }

      const result = await res.json();
      console.log("API result:", result);

      if (result.status === 200 && result.data) {

        setAboutInfo({
          phone: result?.data?.phone || "",
          website: result?.data?.website || "",
          maps: result?.data?.maps || "",
          facebook: result?.data?.facebook || "",
          googlebusinesslisting: result?.data?.googlebusinesslisting || "",
          bingbusinesslisting: result?.data?.bingbusinesslisting || "",
          linkedin: result?.data?.linkedin || "",
          linktoyourwebsite: result?.data?.linktoyourwebsite || "",
        });


        setyear(result.data.experienceYears);
        
        setverified(result.data.verifiedStatus);

      } else {
        setAboutInfo({
          phone: "",
          website: "",
          maps: "",
          facebook: "",
          googlebusinesslisting: "",
          bingbusinesslisting: "",
          linkedin: "",
          linktoyourwebsite: "",
        });
      }
    } catch (error) {
      console.error("Error fetching social links:", error);
    }
  };

  /* Update social links */
  const fetchupdatesocialmedialinks = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const userid = localStorage.getItem("UserID");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/update-social-media-links`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid,
            ...updatedData,
          }),
        }
      );

      if (res.ok) {
        setMessage("Updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating social links:", error);
    }
  };

  /* Handle save for a field */
  const handleSaveField = (field, newValue) => {
    const updated = { ...aboutInfo, [field]: newValue };
    setAboutInfo(updated);
    fetchupdatesocialmedialinks(updated);
  };

  /* Run only once on mount */
  useEffect(() => {
    fetchsocialmedialinks();
  }, []);

  return (
    <section className="max-w-7xl mx-auto my-10 px-6">
      {message && (
        <div className="mb-4 p-2 text-green-700 bg-green-100 rounded">
          {message}
        </div>
      )}

      {/* Overview */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-900">
        {/* Licensed + Founded */}
        <div className="grid grid-rows-2 gap-3 md:border-r md:pr-8 border-gray-300">
          <div className="flex items-center space-x-4">
            <img src="/images/licensed.png" alt="Licensed Icon" className="w-8 h-8 object-contain" />
            <span className="font-semibold text-base md:text-lg">Licensed</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-base md:text-lg text-gray-700">
              <b>{year}</b> Founded
            </span>
          </div>
        </div>

        {/* Insured + ProVerified™ */}
        <div className="grid grid-rows-2 gap-3 md:border-r md:pr-8 border-gray-300">
          <div className="flex items-center space-x-4">
            <img src="/images/insured.avif" alt="Insured Icon" className="w-8 h-8 object-contain" />
            <span className="font-semibold text-base md:text-lg">Insured</span>
          </div>

          
          
          {verified == "0" ? (<>
            <div className="flex items-center space-x-4">
              <span className="text-base md:text-lg text-gray-700">UnVerified™</span>
            </div>
          </>) :(
            <div className="flex items-center space-x-4">
              <img src="/images/4.png" alt="Pro Verified Icon" className="w-8 h-8 object-contain" />
               <h3 className="text-lg font-bold">
                      Pro<span className="text-green-600">Verified</span>™
                    </h3>
            </div>
          )}



        </div>

        


         {verified == "0" ? (<>
            {/* Detailed UnVerified™ Section */}
<div className="flex flex-col">
  <div className="flex items-center space-x-4">
    
    <h3 className="text-lg font-bold text-gray-600">
      Un<span className="text-gray-500">Verified</span>™
    </h3>
  </div>
  <p className="mt-2 text-gray-600 text-sm leading-relaxed font-normal">
    This professional has <span className="font-semibold">not yet completed</span> 
    our <span className="font-semibold">ProVerify™</span> process. 
    Identification, licenses, and insurance have not been confirmed by Profer.
  </p>
</div>

          </>) :(<>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-4">
                    <img src="/images/4.png" alt="Pro Verified Icon" className="w-10 h-10 object-contain" />
                    <h3 className="text-lg font-bold">
                      Pro<span className="text-green-600">Verified</span>™
                    </h3>
                  </div>
                  <p className="mt-2 text-gray-700 text-sm leading-relaxed font-normal">
                    This professional is fully vetted using our extensive
                    <span className="font-semibold text-red-600"> ProVerify™ </span>
                    process. Identification, licenses, and insurance. It's all there.
                    You can see for yourself.
                  </p>
                </div>
              </>)}
      </div>

      {/* About + Credentials */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* About Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px]">
          <h3 className="font-bold text-gray-900 mb-3">About</h3>
          <ul className="space-y-4 text-blue-600 text-sm font-medium">
            <EditableField icon={<PhoneIcon />} field="phone" value={aboutInfo.phone} setValue={(val) => setAboutInfo((prev) => ({ ...prev, phone: val }))} linkPrefix="tel:" onSave={handleSaveField} />
            <EditableField icon={<GlobeIcon />} field="website" value={aboutInfo.website} setValue={(val) => setAboutInfo((prev) => ({ ...prev, website: val }))} onSave={handleSaveField} />
            <EditableField icon={<GoogleMapsIcon />} field="maps" value={aboutInfo.maps} setValue={(val) => setAboutInfo((prev) => ({ ...prev, maps: val }))} onSave={handleSaveField} />
            <EditableField icon={<FacebookIcon />} field="facebook" value={aboutInfo.facebook} setValue={(val) => setAboutInfo((prev) => ({ ...prev, facebook: val }))} onSave={handleSaveField} />
            <EditableField icon={<GoogleBusinessIcon />} field="googlebusinesslisting" value={aboutInfo.googlebusinesslisting} setValue={(val) => setAboutInfo((prev) => ({ ...prev, googlebusinesslisting: val }))} onSave={handleSaveField} />
            <EditableField icon={<BingBusinessIcon />} field="bingbusinesslisting" value={aboutInfo.bingbusinesslisting} setValue={(val) => setAboutInfo((prev) => ({ ...prev, bingbusinesslisting: val }))} onSave={handleSaveField} />
            <EditableField icon={<LinkedInIcon />} field="linkedin" value={aboutInfo.linkedin} setValue={(val) => setAboutInfo((prev) => ({ ...prev, linkedin: val }))} onSave={handleSaveField} />
            <EditableField icon={<WebsiteIcon />} field="linktoyourwebsite" value={aboutInfo.linktoyourwebsite} setValue={(val) => setAboutInfo((prev) => ({ ...prev, linktoyourwebsite: val }))} onSave={handleSaveField} />
          </ul>
        </div>

        {/* Credentials Section */}
        <ProCredentialList></ProCredentialList>

      </div>
    </section>
  );
}

/* ---------- ICONS ---------- */
function PhoneIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M3 5a2 2 0 012-2h3.6a1 1 0 01.97.757l1.2 4.8a1 1 0 01-.271.98L9.293 11.707a16 16 0 006.414 6.414l1.17-1.17a1 1 0 01.98-.271l4.8 1.2a1 1 0 01.757.97V19a2 2 0 01-2 2h-1C10.163 21 3 13.837 3 5V5z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.21 0 4 4.477 4 10s-1.79 10-4 10-4-4.477-4-10 1.79-10 4-10z" />
    </svg>
  );
}
function GoogleMapsIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12a10 10 0 10-11.5 9.95v-7.05H8v-2.9h2.5V9.35c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4H15.7c-1.3 0-1.7.8-1.7 1.6v1.95H18l-.4 2.9h-2.6V22A10 10 0 0022 12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5a2.5 2.5 0 11.02 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3V9zm7 0h3.8v1.6h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6v6.3h-4V15c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v6.1h-4V9z"/>
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.5 2 2 6.48 2 12s4.5 10 10 10 10-4.48 10-10S17.5 2 12 2zm0 18c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm6.4-4.4A8 8 0 1112 4a8 8 0 016.4 11.6z"/>
    </svg>
  );
}

function GoogleBusinessIcon() {
  return (
    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 00-3.16 19.48c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.92-.64.07-.63.07-.63 1.02.07 1.55 1.05 1.55 1.05.9 1.54 2.37 1.1 2.95.84.09-.65.35-1.1.63-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.26.1-2.63 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85 0 1.7.12 2.5.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.38.1 2.63.64.7 1.03 1.6 1.03 2.69 0 3.84-2.35 4.68-4.59 4.92.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0012 2z"/>
    </svg>
  );
}

function BingBusinessIcon() {
  return (
    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5.02 3.5v5.2l5.58 2.34-3.6 9.46 10.98-5.35-3.16-1.23-2.62-7.04L5.02 3.5z"/>
    </svg>
  );
}

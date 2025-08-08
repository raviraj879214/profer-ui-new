"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

/* ---------- Editable Field Component ---------- */
function EditableField({ icon, field, value, setValue, linkPrefix, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    setValue(tempValue);
    if (onSave) onSave(field, tempValue); // Call save on parent
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
          {linkPrefix ? (
            <a
              href={`${linkPrefix}${value}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {value}
            </a>
          ) : (
            <a href={value} target="_blank" rel="noopener noreferrer">
              {value}
            </a>
          )}
          <button
            onClick={() => {
              setTempValue(value);
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
  });

  const [message, setMessage] = useState("");

  /* Fetch social links */
  const fetchsocialmedialinks = async () => {
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
    if (res.ok) {
      const result = await res.json();
      if (result.status == 200) {
        setAboutInfo({
          phone: result.data.phone,
          website: result.data.website,
          maps: result.data.maps,
          facebook: result.data.facebook,
        });
      }
    }
  };

  /* Update social links */
  const fetchupdatesocialmedialinks = async (updatedData) => {
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
          userid: userid,
          ...updatedData,
        }),
      }
    );

    if (res.ok) {
      setMessage("Updated successfully!");
      setTimeout(() => setMessage(""), 3000);
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
        <div className="flex items-center space-x-4 md:border-r md:pr-8 border-gray-300">
          <img src="/images/licensed.png" alt="Licensed Icon" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-sm">Licensed</span>
        </div>
        <div className="flex items-center space-x-4 md:border-r md:pr-8 border-gray-300">
          <img src="/images/insured.avif" alt="Insured Icon" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-sm">Insured</span>
        </div>
        <div className="col-span-1 md:col-span-1 flex flex-col">
          <div className="flex items-center space-x-4">
            <img src="/images/proverified.avif" alt="Pro Verified Icon" className="w-10 h-10 object-contain" />
            <h3 className="text-lg font-bold">
              Pro<span className="text-red-600">Verified</span>™
            </h3>
          </div>
          <p className="mt-2 text-gray-700 text-sm leading-relaxed font-normal">
            This professional is fully vetted using our extensive
            <span className="font-semibold text-red-600"> ProVerify™ </span>
            process. Identification, licenses, and insurance. It's all there. You can see for yourself.
          </p>
        </div>
      </div>
       {/* About + Credentials */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* About Section - Commented Out */}
        {/*
        <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px]">
          <h3 className="font-bold text-gray-900 mb-3">About</h3>
          <ul className="space-y-4 text-blue-600 text-sm font-medium">
            <EditableField
              icon={<PhoneIcon />}
              field="phone"
              value={aboutInfo.phone}
              setValue={(val) => setAboutInfo((prev) => ({ ...prev, phone: val }))}
              linkPrefix="tel:"
              onSave={handleSaveField}
            />
            <EditableField
              icon={<GlobeIcon />}
              field="website"
              value={aboutInfo.website}
              setValue={(val) => setAboutInfo((prev) => ({ ...prev, website: val }))}
              onSave={handleSaveField}
            />
            <EditableField
              icon={<GoogleMapsIcon />}
              field="maps"
              value={aboutInfo.maps}
              setValue={(val) => setAboutInfo((prev) => ({ ...prev, maps: val }))}
              onSave={handleSaveField}
            />
            <EditableField
              icon={<FacebookIcon />}
              field="facebook"
              value={aboutInfo.facebook}
              setValue={(val) => setAboutInfo((prev) => ({ ...prev, facebook: val }))}
              onSave={handleSaveField}
            />
          </ul>
        </div>
        */}


        {/* Credentials Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Credentials</h3>
            <Link href="/pro/pro-credentials" className="text-blue-400 text-xs hover:underline cursor-pointer">View Credentials</Link>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[600px]">
            {credentialData.map((section, idx) => (
              <div key={idx} className="border border-gray-200 rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {section.icon}
                    <h4 className="font-semibold text-gray-700 text-xs">{section.title}</h4>
                  </div>
                  {section.viewText && <span className="text-blue-400 text-xs cursor-pointer hover:underline">{section.viewText}</span>}
                </div>
                <div className="space-y-4">
                  {section.contents.map((content, i) => (
                    <div key={i}>
                      <p className="text-xs text-gray-600 truncate mb-1">{content.text}</p>
                      <img
                        src={content.image}
                        alt={content.alt}
                        className="w-full h-40 object-contain border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- ICONS ---------- */
function PhoneIcon() { return <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.6a1 1 0 01.97.757l1.2 4.8a1 1 0 01-.271.98L9.293 11.707a16 16 0 006.414 6.414l1.17-1.17a1 1 0 01.98-.271l4.8 1.2a1 1 0 01.757.97V19a2 2 0 01-2 2h-1C10.163 21 3 13.837 3 5V5z" /></svg>; }
function GlobeIcon() { return <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.21 0 4 4.477 4 10s-1.79 10-4 10-4-4.477-4-10 1.79-10 4-10z" /></svg>; }
function GoogleMapsIcon() { return <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>; }
function FacebookIcon() { return <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.5 9.95v-7.05H8v-2.9h2.5V9.35c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4H15.7c-1.3 0-1.7.8-1.7 1.6v1.95H18l-.4 2.9h-2.6V22A10 10 0 0022 12z" /></svg>; }

/* ---------- Credential Data ---------- */
const credentialData = [
  { title: "State Licenses, Registrations, and Certifications", icon: <img src="/images/licensed.png" alt="State License Icon" className="w-5 h-5 object-contain" />, viewText: "View 35 document(s)", contents: [{ text: "All State Roofing Certifications", image: "/images/dashboardshowcase.png", alt: "Combined State License Certificates" }] },
  { title: "Local Licenses, Registrations, and Certifications", icon: <img src="/images/licensed.png" alt="Local License Icon" className="w-5 h-5 object-contain" />, viewText: "View 48 document(s)", contents: [{ text: "All Local Roofing Certifications", image: "/images/dashboardshowcase.png", alt: "Combined Local License Certificates" }] },
  { title: "Insurance and Bonds", icon: <img src="/images/licensed.png" alt="Insurance Icon" className="w-5 h-5 object-contain" />, viewText: "View 5 document(s)", contents: [{ text: "All Insurance and Bond Documents", image: "/images/dashboardshowcase.png", alt: "Combined Insurance Documents" }] },
  { title: "Certificate of Good Standing", icon: <img src="/images/licensed.png" alt="Good Standing Icon" className="w-5 h-5 object-contain" />, contents: [{ text: "Certificate of Good Standing", image: "/images/dashboardshowcase.png", alt: "Certificate of Good Standing" }] },
];

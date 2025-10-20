"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiFileText, FiImage, FiFolder } from "react-icons/fi";
import { useSearchParams } from 'next/navigation';

const credentialIcons = [
  "/licensed.png",
  "/licensed.png",
  "/images/Checkmark.png",
  "/images/Checkmark.png",
  "/images/Checkmark.png",
  "/images/Checkmark.png",
  "/images/insured.jpg",
  "/images/Checkmark.png",
];

export default function ProOverviewPage() {
  const { id } = useParams(); // dynamic route param
  const [pro, setPro] = useState(null);
  const [credentials, setCredentials] = useState([]);
    const pathname = usePathname();
    const searchParams = useSearchParams();


  const [expandedSections, setExpandedSections] = useState({});
    const isExportMode = searchParams.get('export') === 'true';
    useEffect(() => {
  if (isExportMode && typeof document !== 'undefined') {
    document.body.setAttribute('data-export-ready', 'true');
  }
}, [isExportMode]);
   

  // Fetch Pro details
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-pros/${id}`)
        .then((res) => res.json())
        .then((data) => setPro(data));
    }
  }, [id]);

  // Fetch Pro credentials
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/pro/${id}/credentials`)
        .then((res) => res.json())
        .then((data) => setCredentials(data.data || [])); // <-- use data.data
    }
  }, [id]);

  if (!pro) return <p className="text-center mt-10">Loading...</p>;

  // Group credentials by section
  const grouped = credentials.reduce((acc, cred) => {
  if (!acc[cred.section]) acc[cred.section] = [];
  acc[cred.section].push(cred);
  return acc;
}, {});
  const toggleShowMore = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };


 const takeScreenshot = async () => {
    const urlToCapture = "https://example.com"; // replace with any URL
    const res = await fetch(`/api/screenshot?url=${encodeURIComponent(urlToCapture)}`);
    if (!res.ok) return alert("Screenshot failed");

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "screenshot.png";
    link.click();
  };








  return (
    <>
       

    <div className={isExportMode ? "p-4 md:p-6" : "p-4 md:p-6"}>

    <div className="relative bg-[#C1E5EC] rounded-3xl p-6 sm:p-8 flex items-center justify-between mt-6 shadow-md w-full mt-15">
      {/* Left Side: Logo + Info */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* Logo with rounded corners */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white shadow">
          <img
            src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${pro.companyLogo}`}
            alt={pro.companyName || "Pro Logo"}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Pro Info */}
        <div>
          {/* Company Name + Verified Check */}
          <h2 className="flex items-center gap-2 text-2xl md:text-4xl font-extrabold text-[#012C43]">
            {pro.companyName || "Not Updated"}
            <span className="inline-flex items-center justify-center w-6 h-6 bg-cyan-400 rounded-full">
              <img src={"/images/4.png"}></img>
            </span>
          </h2>

          {/* Location */}
          <p className="text-gray-500 mt-1 text-sm sm:text-lg">
            {pro.city && pro.state ? `${pro.city}, ${pro.state}` : "Location not available"}
          </p>
   {/* <button
      onClick={takeScreenshot}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Take Screenshot
    </button>
          */}
         
        </div>
      </div>
    </div>




{!isExportMode && (
 <nav className="flex justify-center space-x-6">
    <Link
      href={`/pro-overview/${id}`}
      className="text-sm font-medium px-3 py-2 border-b-2  border-indigo-500 text-indigo-600 hover:text-indigo-600 hover:border-indigo-500"
    >
      Overview
    </Link>
    <Link
      href={`/pro-overview/${id}/credentials`}
      className="text-sm font-medium px-3 py-2 border-b-2 border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-500"
    >
      Credentials
    </Link>
   <a
      href={`${process.env.NEXT_PUBLIC_URL}/prooverview/${id}`}
     target="_blank"
      className="text-sm font-medium px-3 py-2 border-b-2 border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-500">
      Download
    </a>





   
  </nav>
  )}
 
  <br/>


<div className="px-4 md:px-8 lg:px-12">
  <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md border border-gray-400 p-8 min-h-[230px] grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-900">

    {/* Licensed + Founded */}
    <div className="grid grid-rows-2 gap-3 md:pr-8">
      <div className="flex items-center space-x-4">
        <img src="/images/licensed.png" alt="Licensed Icon" className="w-12 h-12 object-contain" />
        <span className="font-semibold text-base md:text-lg">Licensed</span>
      </div>

      
      {pro.verifiedStatus == "0" ? (<div className="flex items-center space-x-4">
        <img  src="/images/4.png" alt="Pro Verified Icon" className="w-12 h-12 object-contain invisible" />
        <span className="font-semibold text-base md:text-lg">UnVerified™</span>
      </div>) : (
        <div className="flex items-center space-x-4">
        <img src="/images/4.png" alt="Pro Verified Icon" className="w-12 h-12 object-contain" />
          <h3 className="text-lg font-bold">
                      Pro<span className="text-green-600">Verified</span>™
                    </h3>
      </div>
      )}

    </div>

    {/* Insured + Year Founded */}
    <div className="grid grid-rows-2 gap-3 md:border-r md:pr-8 border-gray-300">
      <div className="flex items-center space-x-4">
        <img src="/images/insured.avif" alt="Insured Icon" className="w-12 h-12 object-contain" />
        <span className="font-semibold text-base md:text-lg">Insured</span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-3xl font-bold">{pro.experienceYears}</span>
        <span className="text-base md:text-lg font-semibold text-gray-700">Year Founded</span>
      </div>
    </div>

    {/* Detailed ProVerified™ Section */}
   




            {pro.verifiedStatus == "0" ? (<>

             <div className="flex flex-col">
  <div className="flex items-center space-x-4">
    <h3 className="text-2xl font-bold">
      Un<span className="text-red-600">Verified</span>™
    </h3>
  </div>

  <div className="pl-14 mt-2">
    <p className="text-gray-800 text-xl leading-relaxed font-normal">
      This professional has <span className="font-bold">not completed</span> our 
      <span className="font-bold"> Pro</span>
      <span className="text-red-600 font-bold">Verify</span>
      <span className="font-bold">™</span> process. 
      Their identification, licenses, and insurance have <span className="font-bold">not been confirmed</span>.
    </p>
  </div>
</div>

            </>) : (<>

              <div className="flex flex-col">
                <div className="flex items-center space-x-4">
                  <img src="/images/4.png" alt="Pro Verified Icon" className="w-12 h-12 object-contain" />
                    <h3 className="text-lg font-bold">
                      Pro<span className="text-green-600">Verified</span>™
                    </h3>
                </div>

                <div className="pl-14 mt-2">
                  <p className="text-gray-800 text-xl leading-relaxed font-normal">
                    This professional is fully vetted using our extensive
                    <span className="font-bold"> Pro</span>
                    <span className="text-green-600 font-bold">Verified</span>
                    <span className="font-bold">™</span>
                    process. Identification, licenses, and insurance. It's all there.
                    You can see for yourself.
                  </p>
                </div>
              </div>
            </>)}





  </div>
</div>
</div>



<br/>

<div
  className="w-full max-w-6xl min-h-[500px] grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto items-stretch"
>
  {/* Left Side - About */}
  <div className="bg-white shadow-md border-gray-400 border-2 rounded-2xl p-10 w-full h-full">
    <h2 className="text-gray-800 font-medium mb-6 text-2xl">About</h2>

    <div className="space-y-6 px-6">
      <div className="flex items-center gap-6">
        <PhoneIcon />
        <span className="text-blue-600 text-xl">{pro.companyPhone}</span>
      </div>

      <div className="flex items-center gap-6">
        <GlobeIcon />
        <span className="text-blue-600 text-xl">{pro.website}</span>
      </div>

      <div className="flex items-center gap-6">
        <GoogleMapsIcon />
        <span className="text-blue-600 text-xl">{pro.maps}</span>
      </div>

      <div className="flex items-center gap-6">
        <FacebookIcon />
        <span className="text-blue-600 text-xl">{pro.facebook}</span>
      </div>

      <div className="flex items-center gap-6">
        <GoogleBusinessIcon />
        <span className="text-blue-600 text-xl">{pro.googlebusinesslisting}</span>
      </div>

      <div className="flex items-center gap-6">
        <BingBusinessIcon />
        <span className="text-blue-600 text-xl">{pro.bingbusinesslisting}</span>
      </div>

      <div className="flex items-center gap-6">
        <LinkedInIcon />
        <span className="text-blue-600 text-xl">{pro.linkedin}</span>
      </div>

      <div className="flex items-center gap-6">
        <WebsiteIcon />
        <span className="text-blue-600 text-xl">{pro.linktoyourwebsite}</span>
      </div>
    </div>
  </div>

  {/* Right Side - Credentials */}
  {/* Right Side - Credentials */}
{/* Right Side - Credentials */}
<div className="bg-white shadow-md border-gray-400 border-2 rounded-2xl p-10 w-full h-full">
  <h2 className="text-gray-800 font-medium mb-6 text-2xl">Credentials</h2>
    <div className="flex justify-end">
  <Link
    href={`/pro-overview/${id}/credentials`}
    className="text-l font-medium px-3 py-2 border-b-2 border-transparent text-red-500 hover:text-indigo-600 hover:border-indigo-500"
  >
    View Credentials
  </Link>
</div>

  

  <div className="space-y-4 overflow-y-auto max-h-[600px]">
    {Object.keys(grouped).length === 0 ? (
      <p className="text-center text-gray-500 text-sm">No credentials found.</p>
    ) : (
      Object.entries(grouped).map(([section, creds], idx) => {
        const expanded = expandedSections[section];
        const visibleCreds = expanded ? creds : creds.slice(0, 2); // show 2 by default
        const icon = credentialIcons[idx] || "/images/default.png"; // pick icon by order

        return (
          <div key={idx} className="border border-gray-200 rounded-md p-4">
            {/* Section Header with icon */}
            <div className="flex items-center mb-3">
              {/* <img
                src={icon}
                alt={`${section} Icon`}
                className="w-5 h-5 object-contain mr-2"
              /> */}
              <h4 className="font-semibold text-gray-700 text-xl">{section}</h4>
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleCreds.map((cred) => (
                <div
                  key={cred.id}
                  className="flex flex-col items-center border border-gray-300 rounded p-2"
                >
                  <p className="font-semibold text-gray-700 text-l">{cred.name}</p>
                  {cred.fileUrl?.endsWith(".pdf") ? (
                    <embed
                      src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${cred.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      type="application/pdf"
                      width="100%"
                      height="200px"
                      className="border rounded"
                    />
                  ) : (
                    <img
                      src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${cred.fileUrl}`}
                      alt={cred.name}
                      className="w-full h-32 object-contain border rounded"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Show More / Less */}
            {creds.length > 2 && (
              <button
                onClick={() => toggleShowMore(section)}
                className="mt-2 text-blue-500 text-xs hover:underline"
              >
                {expanded ? "Show Less" : `Show More (${creds.length - 2} more)`}
              </button>
            )}
          </div>
        );
      })
    )}
  </div>
</div>


</div>







      {/* <div className="max-w-3xl mx-auto mt-10 bg-white p-6 shadow rounded-lg">
        <h1 className="text-4xl font-bold">About</h1>
        <h1 className="text-2xl font-bold mb-4">{pro.companyName}</h1>

        <p>Year: {pro.experienceYears}</p>
        <p>
          <strong>Phone:</strong> {pro.phone}
        </p>
        <p>
          <strong>Email:</strong> {pro.companyEmail}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(pro.createdAt).toLocaleString()}
        </p>
        <p>Fb: {pro.facebook}</p>
        <p>Website: {pro.website}</p>
        <p>Maps: {pro.maps}</p>
        <p>bingbusinesslisting: {pro.bingbusinesslisting}</p>
        <p>googlebusinesslisting: {pro.googlebusinesslisting}</p>
        <p>linkedin: {pro.linkedin}</p>
        <p>linktoyourwebsite: {pro.linktoyourwebsite}</p>
      </div>

      <hr className="border-t-2 border-gray-600 my-4" />

      <h2 className="text-center text-2xl font-semibold">Credentials</h2>

      <div className="max-w-3xl mx-auto mt-4 bg-gray-50 p-6 shadow rounded-lg space-y-6">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-gray-500 text-center">No credentials found.</p>
        ) : (
          Object.entries(grouped).map(([section, creds]) => (
            <div key={section} className="border border-gray-200 rounded-md p-4">
              <h3 className="font-semibold text-gray-800 mb-3">{section}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {creds.map((cred) => (
                  <div
                    key={cred.id}
                    className="border border-gray-300 rounded p-2 flex flex-col items-center"
                  >
                    <p className="text-sm font-medium mb-2">{cred.name}</p>
                    {cred.fileUrl?.endsWith(".pdf") ? (
                      <embed
                        src={`http://localhost:8000${cred.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        type="application/pdf"
                        width="100%"
                        height="200px"
                        className="border rounded"
                      />
                    ) : (
                      <img
                        src={`http://localhost:8000${cred.fileUrl}`}
                        alt={cred.name}
                        className="w-full h-40 object-contain border rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div> */}
    </>
  );
}
function PhoneIcon() {
  return (
    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M3 5a2 2 0 012-2h3.6a1 1 0 01.97.757l1.2 4.8a1 1 0 01-.271.98L9.293 11.707a16 16 0 006.414 6.414l1.17-1.17a1 1 0 01.98-.271l4.8 1.2a1 1 0 01.757.97V19a2 2 0 01-2 2h-1C10.163 21 3 13.837 3 5V5z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.21 0 4 4.477 4 10s-1.79 10-4 10-4-4.477-4-10 1.79-10 4-10z" />
    </svg>
  );
}
function GoogleMapsIcon() {
  return (
    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12a10 10 0 10-11.5 9.95v-7.05H8v-2.9h2.5V9.35c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4H15.7c-1.3 0-1.7.8-1.7 1.6v1.95H18l-.4 2.9h-2.6V22A10 10 0 0022 12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5a2.5 2.5 0 11.02 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3V9zm7 0h3.8v1.6h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6v6.3h-4V15c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v6.1h-4V9z"/>
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.5 2 2 6.48 2 12s4.5 10 10 10 10-4.48 10-10S17.5 2 12 2zm0 18c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm6.4-4.4A8 8 0 1112 4a8 8 0 016.4 11.6z"/>
    </svg>
  );
}

function GoogleBusinessIcon() {
  return (
    <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 00-3.16 19.48c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.92-.64.07-.63.07-.63 1.02.07 1.55 1.05 1.55 1.05.9 1.54 2.37 1.1 2.95.84.09-.65.35-1.1.63-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.26.1-2.63 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85 0 1.7.12 2.5.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.38.1 2.63.64.7 1.03 1.6 1.03 2.69 0 3.84-2.35 4.68-4.59 4.92.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0012 2z"/>
    </svg>
  );
}

function BingBusinessIcon() {
  return (
    <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5.02 3.5v5.2l5.58 2.34-3.6 9.46 10.98-5.35-3.16-1.23-2.62-7.04L5.02 3.5z"/>
    </svg>
  );
}

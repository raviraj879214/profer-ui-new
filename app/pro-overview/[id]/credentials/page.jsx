"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
 
// Array of icons for each section
const credentialIcons = [
  "/images/licensed.png",
  "/images/licensed.png",
  "/images/Checkmark.png",
  "/images/Checkmark.png",
  "/images/Checkmark.png",
  "/images/Checkmark.png",
  "/images/insured.jpg",
  "/images/Checkmark.png",
];
 
export default function CredentialsPage() {
  const { id } = useParams();
  const [credentials, setCredentials] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
   const [pro, setPro] = useState(null);



 
 
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-pros/${id}`)
        .then((res) => res.json())
        .then((data) =>{
           setPro(data);
           console.log("business details",data);
        });
    }
  }, [id]);
 
 
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/pro/${id}/credentials`)
        .then((res) => res.json())
        .then((data) => setCredentials(data.data || []));
    }
  }, [id]);
 
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





     
const [modalOpen, setModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Open modal
  const openModal = (cred) => {
    setModalFile(cred.fileUrl);
    setIsPdf(cred.fileUrl?.endsWith(".pdf"));
    setZoom(1);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => setModalOpen(false);

  // Zoom
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));








 
  return (
    <div className="p-4 md:p-6 mt-20">
      <div className="relative bg-[#C1E5EC] rounded-3xl p-6 sm:p-8 flex items-center justify-between mt-6 shadow-md w-full">
        {/* Left Side: Logo + Info */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Logo */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white shadow">
        {pro ? (
          <>
            <img
              src={
                pro?.companyLogo
                  ? `${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${pro.companyLogo}`
                  : "/images/default-logo.png"
              }
              alt="Pro Logo"
              className="w-full h-full object-contain"
            />

            {/* Bottom-right checkmark */}
           {/* {pro && pro.user?.status === "4" && (
                <span
                  className="absolute bottom-0 right-0 inline-flex items-center justify-center 
                            w-8 h-8 bg-cyan-400 rounded-full shadow-lg"
                  title="Verified"
                >
                  <img src="/images/4.png" className="w-6 h-6" />
                </span>
              )} */}

          </>
        ) : (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        )}
      </div>


    {/* Pro Info */}
    <div>
      {/* Company Name + Verified Check */}
      {pro ? (
        <h2 className="flex items-center gap-2 text-2xl md:text-4xl font-extrabold text-[#012C43]">
          {pro.companyName} 

         
        </h2>
      ) : (
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
      )}

      {/* Location */}
      {pro ? (
        <p className="text-gray-500 mt-1 text-sm sm:text-lg">
          {(pro?.city ?? "") + (pro?.state ? `, ${pro.state}` : "")}
        </p>
      ) : (
        <div className="h-4 w-32 mt-2 bg-gray-200 rounded animate-pulse" />
      )}

      {pro ? (
  pro.user.status !== "4" ? (
    <div className="flex items-center space-x-4">
      <span className="font-semibold text-base md:text-lg">UnVerified</span>
    </div>
  ) : (
    <div className="flex items-center space-x-4 mt-2">
      <h3 className="text-lg font-bold">
        Pro<span className="text-[#d63934]">Verified</span>
      </h3>
    </div>
  )
) : null}

      
      
    </div>
  </div>
</div>

{/* LEFT-ALIGNED TABS - sits below the blue box */}
<nav className="flex flex-wrap justify-start gap-4 md:gap-6 mt-2 mb-6 pt-10">
  {[
    { href: `/pro-overview/${id}`, label: "Overview" },
    { href: `/pro-overview/${id}/credentials`, label: "Credentials", active: true },
    { href: `/prooverview/${id}`, label: "Download" },
  ].map((link, i) => (
    <Link
      key={i}
      href={link.href}
      className={`text-sm font-medium px-3 py-2 border-b-2 transition-colors duration-200 ${
        link.active
          ? "border-[#23a0b0] text-[#23a0b0] font-semibold"
          : "border-transparent text-gray-500 hover:text-[#23a0b0] hover:border-[#23a0b0]"
      }`}
    >
      {link.label}
    </Link>
  ))}
</nav>







 
      {/* Credentials Title */}
      <h2 className="text-4xl font-semibold mb-4 ">Credentials</h2>
 
      {/* Credentials Sections */}
  <div className="space-y-4 max-w-6xl mx-auto px-2 sm:px-4">
      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-gray-500 text-sm mb-70">No credentials found.</p>
      ) : (
        Object.entries(grouped).map(([section, creds], idx) => {
          const expanded = expandedSections[section];
          const visibleCreds = expanded ? creds : creds.slice(0, 3);
          const icon = credentialIcons[idx] || "/images/default.png";

          return (
            <div key={idx} className="border border-gray-200 rounded-md p-4">
              {/* Section Header */}
              <div className="flex items-center mb-3 flex-wrap justify-center md:justify-start">
                <img src={icon} alt={`${section} Icon`} className="w-5 h-5 object-contain mr-2 mb-1" />
                <h4 className="font-semibold text-gray-700 text-xl text-center md:text-left break-words">
                  {section}
                </h4>
              </div>

              {/* Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
                {visibleCreds.map((cred) => (
                 <div key={cred.id} className="flex flex-col items-center border border-gray-300 rounded p-2">
  <p className="font-semibold text-gray-700 text-l text-center">{cred.name}</p>

  {/* Small View Button */}
  <button
    onClick={() => openModal(cred)}
    className="mt-1 text-sm text-blue-500 hover:text-blue-700 px-2 py-1 border border-blue-200 rounded transition"
  >
    View
  </button>

  {/* Credential Preview */}
  {cred.fileUrl?.endsWith(".pdf") ? (
    <embed
      src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${cred.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
      type="application/pdf"
      width="100%"
      height="200px"
      className="border rounded mt-2 "
    />
  ) : (
    <div className="w-full h-48 overflow-hidden rounded border mt-2">
      <img
        src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${cred.fileUrl}`}
        alt={cred.name}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-500 cursor-pointer"
      />
    </div>
  )}
</div>

                ))}
              </div>

              {/* Show More / Less Button */}
              {creds.length > 3 && (
                <div className="flex">
                  <button
                    onClick={() => toggleShowMore(section)}
                    className="mt-2 text-blue-500 text-xs hover:underline"
                  >
                    {expanded ? "Show Less" : `Show More (${creds.length - 3} more)`}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Modal */}
      {modalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        {/* Zoom buttons */}
        <div className="flex gap-2">
          <button
            onClick={zoomOut}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            −
          </button>
          <button
            onClick={zoomIn}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={closeModal}
          className="text-gray-600 hover:text-red-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Modal Content */}
      <div className="overflow-auto max-h-[80vh] flex justify-center items-center p-4">
        {isPdf ? (
          <embed
            src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${modalFile}#toolbar=0`}
            type="application/pdf"
            className="w-full"
            style={{
              height: "80vh",
              transform: `scale(${zoom})`,
              transformOrigin: "center top",
            }}
          />
        ) : (
          <img
            src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${modalFile}`}
            alt="credential"
            className="object-contain max-h-[75vh]"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
            }}
          />
        )}
      </div>

    </div>
  </div>
)}

    </div>




      
    </div>
  );
}
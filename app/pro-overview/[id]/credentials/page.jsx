"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Array of icons for each section
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

export default function CredentialsPage() {
  const { id } = useParams();
  const [credentials, setCredentials] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/pro/${id}/credentials`)
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

  return (
    <div className="p-4 md:p-6">
      {/* Nav */}
      <nav className="flex flex-wrap justify-center gap-2 md:gap-6 mb-6">
        {[
          { href: `/pro-overview/${id}`, label: "Overview" },
          { href: `/pro-overview/${id}/credentials`, label: "Credentials", active: true },
          { href: `/pro-overview/${id}/download`, label: "Download" },
          
        ].map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={`text-sm font-medium px-3 py-2 border-b-2 ${
              link.active
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-500"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Credentials Title */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Credentials</h2>

      {/* Credentials Sections */}
      <div className="space-y-4 max-w-6xl mx-auto px-2 sm:px-4">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-500 text-sm">No credentials found.</p>
        ) : (
          Object.entries(grouped).map(([section, creds], idx) => {
            const expanded = expandedSections[section];
            const visibleCreds = expanded ? creds : creds.slice(0, 3);
            const icon = credentialIcons[idx] || "/images/default.png";

            return (
              <div key={idx} className="border border-gray-200 rounded-md p-4">
                {/* Section Header */}
          <div className="flex items-center mb-3 flex-wrap justify-center md:justify-start">
  <img
    src={icon}
    alt={`${section} Icon`}
    className="w-5 h-5 object-contain mr-2 mb-1"
  />
  <h4 className="font-semibold text-gray-700 text-xl text-center md:text-left break-words">
    {section}
  </h4>
</div>



                {/* Credentials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
                  {visibleCreds.map((cred) => (
                    <div
                      key={cred.id}
                      className="flex flex-col items-center border border-gray-300 rounded p-2"
                    >
                      <p className="font-semibold text-gray-700 text-l text-center">{cred.name}</p>
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
                          className="w-full h-32 object-contain border rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Show More / Less Button */}
                {creds.length > 3 && (
                  <div className="flex ">
                    <button
                      onClick={() => toggleShowMore(section)}
                      className="mt-2 text-blue-500 text-xs hover:underline"
                    >
                      {expanded
                        ? "Show Less"
                        : `Show More (${creds.length - 3} more)`}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

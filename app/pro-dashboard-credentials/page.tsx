"use client";
import React from "react";

interface DocumentItem {
  title: string;
  imgSrc: string;
  alt: string;
  subText?: string;
}

interface CredentialSectionProps {
  title: string;
  viewCount: number;
  documents: DocumentItem[];
}

export default function Home() {
  return (
    <div className="">
      {/* Main profile header */}
      <div className="relative bg-[#C1E5EC] p-8 pb-20 rounded-b-3xl mt-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          {/* Company Logo */}
          <div className="flex-shrink-0 w-24 h-24">
            <img
              src="/images/hometownroofing.png"
              alt="Hometown Roofing Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Company Info */}
          <div>
            <h1 className="font-bold text-xl text-[#012C43] flex items-center gap-2">
              Hometown Roofing
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#3CB371]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </h1>
            <p className="text-gray-500 mt-1">Hometown, USA</p>
            <p className="flex items-center space-x-2 text-gray-400 mt-2 font-medium">
              <span>Favorite Pro</span>
              <svg fill="red" stroke="none" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                         2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
                         2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 
                         5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 
                         21.35z" />
              </svg>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <ul className="flex space-x-8 mt-8 text-sm font-semibold text-gray-500">
          <li className="cursor-pointer hover:text-[#3CB371] py-2">Overview</li>
          <li className="border-b-2 border-[#3CB371] text-[#3CB371] pb-2 cursor-default">
            Credentials
          </li>
          <li className="cursor-pointer hover:text-[#3CB371] py-2">Download</li>
          <li className="cursor-pointer hover:text-[#3CB371] py-2">Share</li>
        </ul>
      </div>

      {/* Credentials content */}
      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto space-y-6">
        <p className="text-center text-xs text-gray-400 mb-4">
          *Credentials are in order of importance from the top to bottom.
        </p>

        <CredentialSection
          title="State Licenses, Registrations, and Certifications"
          viewCount={35}
          documents={[
            {
              title: "Kansas Registered Roofing Contractor Certificate",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9ffff034-1fbd-48aa-878e-8f74a583d251.png",
              alt: "Kansas Registered Roofing Contractor Certificate",
            },
            {
              title: "North Carolina Registered Roofing Contractor Certificate",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c3b94a0c-ecc3-44e2-ae93-f3e073530fec.png",
              alt: "North Carolina Registered Roofing Contractor Certificate",
            },
          ]}
        />

        <CredentialSection
          title="Local Licenses, Registrations, and Certifications"
          viewCount={48}
          documents={[
            {
              title: "Wichita Area Class A General Contractor License",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a41a634e-3aab-4fde-8f03-b0633819d655.png",
              alt: "Wichita Area Class A General Contractor License",
            },
            {
              title: "Johnson County Class A General Contractor License",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/577766b7-f9ee-433f-b7ba-8bfc03daf99e.png",
              alt: "Johnson County Class A General Contractor License",
            },
          ]}
        />

        <CredentialSection
          title="Insurance and Bonds"
          viewCount={5}
          documents={[
            {
              title: "Liability Insurance",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6e670210-38fd-4f85-aee3-238888de6fa1.png",
              alt: "Liability Insurance document",
              subText: "Verify Insurance Services",
            },
            {
              title: "Work Comp Insurance",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/93e8cff2-a6fc-4424-9dfd-fe75d345b966.png",
              alt: "Work Comp Insurance document",
              subText: "Verify Insurance Services",
            },
          ]}
        />

        <CredentialSection
          title="Certificate of Good Standing"
          viewCount={1}
          documents={[
            {
              title: "Kansas Secretary of State Certificate of Good Standing",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/66d57fea-b02c-4f44-b17f-f9b92934ca1e.png",
              alt: "Kansas Secretary of State Certificate of Good Standing",
            },
          ]}
        />

        <CredentialSection
          title="Skills Certifications"
          viewCount={11}
          documents={[
            {
              title: "Ludowici Installation Certificate",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d1b6dd1c-c092-4193-b634-8a49ff187f94.png",
              alt: "Ludowici Installation Certificate",
            },
            {
              title: "Ludowici Installation Certificate",
              imgSrc: "https://placehold.co/200x112/cccccc/000000?text=Ludowici+Certificate+Blur",
              alt: "Ludowici Installation Certificate",
            },
          ]}
        />

        <CredentialSection title="Safety Certifications" viewCount={0} documents={[]} />

        <CredentialSection
          title="Government Certifications"
          viewCount={2}
          documents={[
            {
              title: "Kansas Minority Business Owner Certificate",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fd0999cb-058f-4579-a34f-d5efd8704c1f.png",
              alt: "Kansas Minority Business Owner Certificate",
            },
            {
              title: "SAM.GOV Registration Certificate",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/defef40e-ec8f-4d1e-9ac5-48ac18950bdf.png",
              alt: "SAM.GOV Registration Certificate",
            },
          ]}
        />

        <CredentialSection
          title="Badges"
          viewCount={10}
          documents={[
            {
              title: "Porch Pro Badge",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ff3147bf-8048-47f2-b0eb-7c02387e3868.png",
              alt: "Porch Pro Badge",
            },
            {
              title: "Google Guaranteed Badge",
              imgSrc:
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f681a3ad-7143-4ce1-94a7-748e2b04ae9a.png",
              alt: "Google Guaranteed Badge",
            },
          ]}
        />

        <p className="text-center text-xs text-gray-400 mt-4">
          *Credentials are in order of importance from the top to bottom.
        </p>
      </main>
    </div>
  );
}

function CredentialSection({ title, viewCount, documents }: CredentialSectionProps) {
  return (
    <section className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center mb-4 space-x-3">
        <CredentialIcon title={title} />
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>

      <p className="text-blue-500 text-xs font-semibold mb-6 cursor-pointer">
        View {viewCount} document{viewCount !== 1 ? "s" : ""}
      </p>

      {documents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {documents.map(({ title, imgSrc, alt, subText }, i) => (
            <div key={i} className="space-y-1">
              <p className="text-xs text-gray-600">{title}</p>
              {subText && <p className="text-xs text-gray-400 italic">{subText}</p>}
              <div className="w-full max-w-xs h-28 bg-gray-200 rounded overflow-hidden relative">
                <img src={imgSrc} alt={alt} className="object-contain w-full h-full" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function CredentialIcon({ title }: { title: string }) {
  // (same SVG logic as before)
  if (title.includes("State Licenses")) { /* SVG */ }
  // ... rest of your icons
  return (
    <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect width={18} height={18} x={3} y={3} rx={2} ry={2} />
    </svg>
  );
}

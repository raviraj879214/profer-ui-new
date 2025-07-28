"use client";

import React from "react";
import type { JSX } from "react";

export default function ProProfile() {
  return (
    <>
      {/* Top info block */}
      <div className="relative bg-[#C1E5EC] p-8 pb-20 rounded-b-3xl mt-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0 w-24 h-24">
            <img
              src="/images/hometownroofing.png"
              alt="Hometown Roofing Logo"
              className="w-full h-full object-contain"
            />
          </div>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
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

        
      </div>

      {/* Main Section */}
      <section className="max-w-7xl mx-auto my-10 px-6">
        {/* Overview Card */}
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

        {/* Grid: About + Credentials */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px]">
            <h3 className="font-bold text-gray-900 mb-3">About</h3>
            <div className="mb-4 flex flex-wrap gap-3 text-xs">
              {["Roofer", "Electrician", "Class A", "Class B"].map((item, idx) => (
                <span
                  key={idx}
                  className="py-1 px-3 rounded-full text-blue-600 border border-blue-200 cursor-pointer"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-xs mb-6">Click to view each license</p>
            <ul className="space-y-4 text-blue-600 text-sm font-medium">
              <li className="flex items-center space-x-3"><PhoneIcon /> <a href="tel:(800)813-4021">(800) 813-4021</a></li>
              <li className="flex items-center space-x-3"><MailIcon /> <a href="mailto:info@hometownroofing.com">info@hometownroofing.com</a></li>
              <li className="flex items-center space-x-3"><GlobeIcon /> <a href="http://www.hometownroofing.com" target="_blank" rel="noopener noreferrer">www.hometownroofing.com</a></li>
              <li className="flex items-center space-x-3"><GoogleMapsIcon /> <a href="https://www.google.com/maps/place/hometownroofing" target="_blank" rel="noopener noreferrer">google.com/maps/hometownroofing</a></li>
              <li className="flex items-center space-x-3"><FacebookIcon /> <a href="https://www.facebook.com/nexttown/profilehome" target="_blank" rel="noopener noreferrer">facebook.com/nexttown/profilehome</a></li>
            </ul>
          </div>

          {/* Credentials Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Credentials</h3>
              <a href="#" className="text-blue-400 text-xs hover:underline cursor-pointer">View Credentials</a>
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
    </>
  );
}

// ICON COMPONENTS
function PhoneIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M3 5a2 2 0 012-2h3.6a1 1 0 01.97.757l1.2 4.8a1 1 0 01-.271.98L9.293 11.707a16 16 0 006.414 6.414l1.17-1.17a1 1 0 01.98-.271l4.8 1.2a1 1 0 01.757.97V19a2 2 0 01-2 2h-1C10.163 21 3 13.837 3 5V5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M4 4h16v16H4V4zm0 0l8 8 8-8" />
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


// CREDENTIAL DATA
const credentialData: {
  title: string;
  icon: JSX.Element;
  viewText?: string;
  contents: {
    text: string;
    image: string;
    alt: string;
  }[];
}[] = [
  {
    title: "State Licenses, Registrations, and Certifications",
    icon: <img src="/images/licensed.png" alt="State License Icon" className="w-5 h-5 object-contain" />,
    viewText: "View 35 document(s)",
    contents: [
      {
        text: "All State Roofing Certifications",
        image: "/images/dashboardshowcase.png",
        alt: "Combined State License Certificates",
      },
    ],
  },
  {
    title: "Local Licenses, Registrations, and Certifications",
    icon: <img src="/images/licensed.png" alt="Local License Icon" className="w-5 h-5 object-contain" />,
    viewText: "View 48 document(s)",
    contents: [
      {
        text: "All Local Roofing Certifications",
        image: "/images/dashboardshowcase.png",
        alt: "Combined Local License Certificates",
      },
    ],
  },
  {
    title: "Insurance and Bonds",
    icon: <img src="/images/licensed.png" alt="Insurance Icon" className="w-5 h-5 object-contain" />,
    viewText: "View 5 document(s)",
    contents: [
      {
        text: "All Insurance and Bond Documents",
        image: "/images/dashboardshowcase.png",
        alt: "Combined Insurance Documents",
      },
    ],
  },
  {
    title: "Certificate of Good Standing",
    icon: <img src="/images/licensed.png" alt="Good Standing Icon" className="w-5 h-5 object-contain" />,
    contents: [
      {
        text: "Certificate of Good Standing",
        image: "/images/dashboardshowcase.png",
        alt: "Certificate of Good Standing",
      },
    ],
  },
];

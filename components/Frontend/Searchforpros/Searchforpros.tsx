"use client";

import { useState } from "react";

export function SearchForPros() {
  const [service, setService] = useState("");
  const [zip, setZip] = useState("");

  const roofingContractors = [
    {
      name: "Hometown Roofing Co.",
      status: "Verified",
      profileImg:
        "https://static.wixstatic.com/media/8de7f9_acbb695fd7e94f47b58c7ef118d8f3a6~mv2.png/v1/fill/w_174,h_94,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8de7f9_acbb695fd7e94f47b58c7ef118d8f3a6~mv2.png",
      verified: true,
    },
    {
      name: "KC Roofing Company",
      status: "Unverified",
      profileImg:
        "https://static.wixstatic.com/media/8de7f9_acbb695fd7e94f47b58c7ef118d8f3a6~mv2.png/v1/fill/w_174,h_94,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8de7f9_acbb695fd7e94f47b58c7ef118d8f3a6~mv2.png",
      verified: false,
    },
    {
      name: "Quality Roofing",
      status: "Unverified",
      profileImg:
        "https://static.wixstatic.com/media/8de7f9_acbb695fd7e94f47b58c7ef118d8f3a6~mv2.png/v1/fill/w_174,h_94,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8de7f9_acbb695fd7e94f47b58c7ef118d8f3a6~mv2.png",
      verified: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-center mb-4">
          Pro Directory - Search Results
        </h1>

        {/* Search Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 bg-white shadow-md p-4 rounded-lg">
          <select
            className="border border-gray-300 rounded px-4 py-2 focus:ring-red-400 focus:outline-none"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="" disabled>
              Service type dropdown
            </option>
            <option value="roofing">Roofing</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
          </select>

          <input
            type="text"
            placeholder="Enter Zip Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-40 focus:ring-red-400 focus:outline-none"
          />

          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded shadow transition">
            Search
          </button>
        </div>

        {/* Results Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-center text-gray-800">
            Roofing Contractors in 67037
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Click to View{" "}
            <strong>
              Pro<span className="text-red-500">Files</span>
            </strong>
            <sup>™</sup>
          </p>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2">Company Name</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">
                  Pro<span className="text-red-500">file</span>
                  <sup>™</sup>
                </th>
              </tr>
            </thead>
            <tbody>
              {roofingContractors.map(({ name, status, profileImg, verified }, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-200 ${
                    verified ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  <td className="flex items-center gap-2 py-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        verified ? "bg-cyan-500" : "bg-red-500"
                      }`}
                    >
                      {verified ? (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                        </svg>
                      )}
                    </div>
                    <span>{name}</span>
                  </td>
                  <td
                    className={`py-3 font-semibold ${
                      verified ? "text-cyan-600" : "text-red-600"
                    }`}
                  >
                    {status}
                  </td>
                  <td className="py-3">
                    <img
                      src={profileImg}
                      alt={`ProFile for ${name}`}
                      className="w-10 h-10 opacity-80"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/40x40?text=PF";
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Call to Action */}
        <section className="mt-20 text-center max-w-md mx-auto">
          <img
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bfd2e70d-953f-4cd6-8c0b-cd8e7d55f1f1.png"
            alt="Woman at desk"
            className="mx-auto mb-6 max-h-40"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fabdb81f-a141-4d60-886b-a9c02b08ad9f.png";
            }}
          />
          <h2 className="text-xl font-semibold mb-2">What are you waiting on?</h2>
          <p className="text-gray-600 mb-6">
            Start your next project with our{" "}
            <strong>
              Project <span className="text-red-500">Auction</span>
            </strong>
            ™. With our money-back guarantee, your project is in good hands.
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded shadow transition">
            Get Started
          </button>
        </section>
      </main>
    </div>
  );
}

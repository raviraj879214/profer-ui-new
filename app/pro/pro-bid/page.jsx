"use client"
import { useState } from "react";

export default function Home() {
  const [location, setLocation] = useState("All locations");
  const locations = ["All locations", "Location 1", "Location 2"];

  const closedProjects = [
    {
      name: "OKC Roof",
      type: "Roof Replacement",
      endDate: "02/11/2025",
      status: "Won",
      bid: "$213,932.12",
    },
    {
      name: "KC Flat Roof",
      type: "Gutter Replacement",
      endDate: "02/01/2025",
      status: "Lost",
      bid: "$123,932.13",
    },
    {
      name: "Wichita Roof",
      type: "Storm Restoration",
      endDate: "01/21/2025",
      status: "Lost",
      bid: "$893,932.45",
    },
  ];

  return (
    <>
      

     

     

      {/* Body */}
      <main className="max-w-7xl mx-auto flex flex-col">
      

        {/* Content */}
        <section className="flex mt-6 w-full max-w-full">
          {/* Sidebar Left */}
          <aside className="flex flex-col space-y-3 bg-sky-200 w-36 p-5 rounded-tl-lg rounded-bl-lg text-gray-600 text-sm font-medium">
            <span className="cursor-pointer">Bids</span>
            <span className="cursor-pointer">Open</span>
            <span className="cursor-pointer">In-Progress</span>
            <span className="cursor-pointer font-bold text-gray-900 border-l-4 border-sky-500 pl-3">
              Closed
            </span>
          </aside>

          {/* Main Table */}
          <article className="flex-1 bg-white p-6 rounded-tr-lg rounded-br-lg drop-shadow-md overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b border-gray-200">
                <tr className="text-left text-gray-800 font-semibold text-sm">
                  <th className="py-3 px-6">Project Name</th>
                  <th className="py-3 px-6">Project Type</th>
                  <th className="py-3 px-6">End Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Bid</th>
                  <th className="py-3 px-6 text-red-600 font-bold">JobFile™</th>
                </tr>
              </thead>
              <tbody>
                {closedProjects.map(({ name, type, endDate, status, bid }) => (
                  <tr
                    key={name}
                    className="even:bg-gray-50 odd:bg-white hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="py-4 px-6">{name}</td>
                    <td className="py-4 px-6">{type}</td>
                    <td className="py-4 px-6">{endDate}</td>
                    <td className="py-4 px-6">{status}</td>
                    <td className="py-4 px-6 font-semibold">{bid}</td>
                    <td className="py-4 px-6 text-red-600 flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-6 h-6"
                      >
                        <path d="M6 2h9a3 3 0 0 1 3 3v14a1 1 0 0 1-1.447.894L9 16H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </section>
      </main>

      
    </>
  );
}


"use client";
import React, { useState } from "react";

export function CompanyManagement() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const companies = [
    {
      id: 1,
      name: "Apex Roofing Solutions",
      description: "Residential and commercial roofing services",
      years: 5,
      employees: 12,
      contactName: "Michael Rodriguez",
      contactEmail: "michael@apexroofing.com",
      contactPhone: "(512) 555-1234",
      location: "Austin, TX",
      joined: "Mar 18, 2025",
      status: "Pending",
    },
    {
      id: 2,
      name: "SkyHigh Contractors",
      description: "Specialized in high-altitude and complex roofing projects",
      years: 8,
      employees: 25,
      contactName: "Sarah Johnson",
      contactEmail: "sarah@skyhighcontractors.com",
      contactPhone: "(303) 555-9876",
      location: "Denver, CO",
      joined: "Mar 17, 2025",
      status: "Pending",
    },
    {
      id: 3,
      name: "Elite Roofing LLC",
      description: "Eco-friendly roofing solutions and repairs",
      years: 10,
      employees: 15,
      contactName: "David Chen",
      contactEmail: "david@eliteroofing.com",
      contactPhone: "(503) 555-4321",
      location: "Portland, OR",
      joined: "Mar 16, 2025",
      status: "Approved",
    },
    {
      id: 4,
      name: "Premier Roof Systems",
      description: "Hurricane-resistant roofing specialists",
      years: 3,
      employees: 7,
      contactName: "Carlos Mendez",
      contactEmail: "carlos@premierroof.com",
      contactPhone: "(305) 555-7890",
      location: "Miami, FL",
      joined: "Mar 15, 2025",
      status: "Rejected",
    },
    {
      id: 5,
      name: "TopTier Roofing Inc",
      description: "Rain-resistant roofing and gutter systems",
      years: 7,
      employees: 18,
      contactName: "Lisa Kim",
      contactEmail: "lisa@toptierroofing.com",
      contactPhone: "(206) 555-2468",
      location: "Seattle, WA",
      joined: "Mar 15, 2025",
      status: "Pending",
    },
  ];

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  } as const;

  const filteredCompanies = companies.filter(
    (company) =>
      (filter === "All" || company.status === filter) &&
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
          <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700">
            + Add Company
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-40"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>

          <input
            type="search"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-[200px]"
          />
        </div>

        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Company Info</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-semibold">{company.name}</div>
                    <div className="text-xs text-gray-500">{company.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {company.years} year{company.years !== 1 && "s"} •{" "}
                      {company.employees} employee{company.employees !== 1 && "s"}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-pre-line">
                    <div className="font-semibold">{company.contactName}</div>
                    <a
                      href={`mailto:${company.contactEmail}`}
                      className="text-blue-600 underline text-xs"
                    >
                      {company.contactEmail}
                    </a>
                    <br />
                    <span className="text-xs text-gray-600">{company.contactPhone}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{company.location}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{company.joined}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[company.status as keyof typeof statusColors]}`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 space-x-2">
                    <button className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-xs hover:bg-gray-100">
                      View
                    </button>
                    <button className="bg-blue-500 text-white rounded-md px-3 py-1 text-xs hover:bg-blue-600">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-6">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

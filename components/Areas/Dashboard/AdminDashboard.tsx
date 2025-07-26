"use client";
import { useState } from "react";

// Dummy Stats
const stats = [
  { title: 'Companies Pending Verification', value: 27, change: '+12%' },
  { title: 'Active Projects', value: 124, change: '+8%' },
  { title: 'Completed Projects', value: 368, change: '+15%' },
  { title: 'Total Revenue', value: '$42,850', change: '+22%' },
];

// Dummy Requests
const verificationRequests = [
  {
    company: 'Apex Roofing Solutions',
    location: 'Austin, TX',
    date: 'Mar 18, 2025',
    status: 'Pending',
  },
  {
    company: 'SkyHigh Contractors',
    location: 'Denver, CO',
    date: 'Mar 17, 2025',
    status: 'Pending',
  },
  {
    company: 'TopTier Roofing Inc',
    location: 'Seattle, WA',
    date: 'Mar 15, 2025',
    status: 'Pending',
  },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Verification Queue');

  return (
    <main className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ title, value, change }) => (
          <div key={title} className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-gray-500 text-sm">{title}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xl font-bold text-gray-800">{value}</p>
              <p className="text-green-600 text-sm flex items-center font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                {change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Tab Buttons */}
        <div className="border-b px-4 sm:px-6">
          <nav className="flex flex-wrap gap-2 sm:space-x-8 text-sm font-medium">
            {['Verification Queue', 'Recent Activity', 'Platform Analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 transition ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          {/* Verification Queue Table */}
          {activeTab === 'Verification Queue' && (
            <div className="w-full">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Company Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Location</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Submission Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {verificationRequests.map(({ company, location, date, status }) => (
                    <tr key={company}>
                      <td className="px-4 py-3 font-medium text-gray-900">{company}</td>
                      <td className="px-4 py-3 text-gray-600">{location}</td>
                      <td className="px-4 py-3 text-gray-600">{date}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                        Review
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-right text-blue-600 text-sm hover:underline cursor-pointer">
                      View all verification requests &rarr;
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Recent Activity Placeholder */}
          {activeTab === 'Recent Activity' && (
            <div className="text-gray-500 text-sm">Recent activity content goes here.</div>
          )}

          {/* Platform Analytics Placeholder */}
          {activeTab === 'Platform Analytics' && (
            <div className="text-gray-500 text-sm">Platform analytics content goes here.</div>
          )}
        </div>
      </div>
    </main>
  );
}

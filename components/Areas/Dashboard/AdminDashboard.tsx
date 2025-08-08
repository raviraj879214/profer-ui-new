"use client";
import { useState } from "react";

import {ActivityLog} from "../../reusable/Loging";

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
  const [activeTab, setActiveTab] = useState('Recent Activity');

  return (<>
    
    

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
            {['Recent Activity', 'Platform Analytics'].map((tab) => (
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
         
          

          {/* Recent Activity Placeholder */}
          {activeTab === 'Recent Activity' && (
            <div className="text-gray-500 text-sm">

            <ActivityLog></ActivityLog>


            </div>
          )}

          {/* Platform Analytics Placeholder */}
          {activeTab === 'Platform Analytics' && (
            <div className="text-gray-500 text-sm">Platform analytics content goes here.</div>
          )}
        </div>
      </div>
    </main>
  </>);
}

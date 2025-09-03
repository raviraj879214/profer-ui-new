"use client";
import { useState } from "react";

import {ActivityLog} from "../../reusable/Loging";
import {Dashboardwidgets} from "../../Areas/Dashboard/Dashboardwidgets";
import {DoughnutChartDemo} from "../../Areas/Dashboard/Platformactivity";
// Dummy Stats


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
      <Dashboardwidgets></Dashboardwidgets>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Tab Buttons */}
        <div className="border-b px-4 sm:px-6">
          <nav className="flex flex-wrap gap-2 sm:space-x-8 text-sm font-medium">
            {['Recent Activity', 'Projects Analytics' , 'Companies Analytics'].map((tab) => (
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
          {activeTab === 'Projects Analytics' && (
            <div className="text-gray-500 text-sm">
              
                <DoughnutChartDemo></DoughnutChartDemo>

            </div>
          )}
          
           {activeTab === 'Companies Analytics' && (
            <div className="text-gray-500 text-sm">
              
                <DoughnutChartDemo></DoughnutChartDemo>

            </div>
          )}


        </div>
      </div>
    </main>
  </>);
}

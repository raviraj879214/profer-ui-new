"use client"
import { useState } from "react"
import {AdminDetails} from "../../Areas/Settings/Admindetailschages";
import {AdminPassword} from "../../Areas/Settings/AdminPasswordChnage";
const Settings = () => {
  const settingsTabs = ["General Settings", "Security"]
  const [activeTab, setActiveTab] = useState("General Settings")

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "General Settings":
        return (
          <>
            <AdminDetails></AdminDetails>
          </>
        )
      
      case "Security":
        return (
          <>
            <AdminPassword></AdminPassword>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <main className="flex-1 bg-white">
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Settings</h2>

            {/* Mobile Tabs - Horizontal Scrollable */}
            <div className="lg:hidden mb-6">
              <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 py-2 px-4 text-sm rounded-md whitespace-nowrap transition-colors ${
                      activeTab === tab ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="flex flex-col lg:flex-row">
              {/* Desktop Tabs - Vertical Sidebar */}
              <div className="hidden lg:block w-60 border-r pr-6 flex-shrink-0">
                {settingsTabs.map((tab) => (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-4 text-sm rounded-md cursor-pointer mb-1 transition-colors ${
                      activeTab === tab ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              {/* Dynamic Content */}
              <div className="flex-1 lg:pl-6">{renderTabContent()}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Settings

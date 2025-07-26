"use client"
import { useState } from "react"

const Settings = () => {
  const settingsTabs = ["General Settings", "Notifications", "Security", "Admin Access"]
  const [activeTab, setActiveTab] = useState("General Settings")

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "General Settings":
        return (
          <>
            <h3 className="text-lg font-semibold mb-1">General Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Configure basic application settings and preferences</p>
            <form className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Profer Admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>UTC</option>
                  <option>IST</option>
                  <option>EST</option>
                  <option>PST</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Save Changes
              </button>
            </form>
          </>
        )
      case "Notifications":
        return (
          <>
            <h3 className="text-lg font-semibold mb-1">Notification Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Manage your notification preferences</p>
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Email alerts for new projects</span>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Push notifications for bidding updates</span>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Weekly summary via email</span>
              </label>
            </div>
          </>
        )
      case "Security":
        return (
          <>
            <h3 className="text-lg font-semibold mb-1">Security Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Update your password and secure your account</p>
            <form className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Update Password
              </button>
            </form>
          </>
        )
      case "Admin Access":
        return (
          <>
            <h3 className="text-lg font-semibold mb-1">Admin Access</h3>
            <p className="text-sm text-gray-500 mb-4">Manage administrative access for other users</p>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border p-4 rounded-md bg-gray-50 gap-3">
                <div>
                  <div className="font-medium text-sm">admin@proferadmin.com</div>
                  <div className="text-xs text-gray-500">Full Admin Access</div>
                </div>
                <button className="text-sm text-red-500 hover:underline self-start sm:self-center">Revoke</button>
              </div>
              <button className="text-sm text-blue-600 hover:underline">+ Add New Admin</button>
            </div>
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

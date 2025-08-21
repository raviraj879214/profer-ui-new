"use client";
 
import { Bell, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
 
export function AdminSubHeader({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const router = useRouter();
 
  const notifications = [
    { id: 1, message: "✅ Your report has been generated.", time: "2 mins ago" },
    { id: 2, message: "⚠️ Server usage exceeded 80%.", time: "10 mins ago" },
    { id: 3, message: "📥 New user registration.", time: "30 mins ago" },
  ];
 
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const handleLogout = () => {
    localStorage.clear();   
    
     document.cookie.split(";").forEach(cookie => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; path=/; max-age=0`;
    });

    window.location.href = ("/admin-login");

  };
 
  return (
    <header className="bg-white shadow w-full text-gray-800 z-30 relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
       
        {/* Menu icon for mobile */}
        <button className="block sm:hidden" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
 
        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            {/* <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative focus:outline-none p-1.5 hover:bg-gray-100 rounded-md transition"
              aria-label="View notifications"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 h-4 w-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center ring-2 ring-white">
                  {notifications.length}
                </span>
              )}
            </button> */}
 
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[70vh] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b text-sm font-semibold text-gray-700">
                  <span>Notifications</span>
                  <button className="text-xs text-blue-600 hover:underline">Clear All</button>
                </div>
 
                <ul className="max-h-60 overflow-y-auto text-sm text-gray-700 divide-y">
                  {notifications.map((n) => (
                    <li key={n.id} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <p className="text-sm">{n.message}</p>
                        <span className="text-[10px] text-gray-400 ml-2 whitespace-nowrap">{n.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
 
                <div className="text-center text-xs text-blue-600 py-2 border-t hover:underline cursor-pointer">
                  View all
                </div>
              </div>
            )}
          </div>
 
          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-semibold">
                A
              </div>
              <span className="text-sm font-medium hidden sm:block">Admin</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
 
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <ul className="py-1 text-sm text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <Link href="/admin/settings">
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
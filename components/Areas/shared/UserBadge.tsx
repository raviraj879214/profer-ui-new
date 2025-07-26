"use client";


import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function UserBadge() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const route = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("Role");
    localStorage.removeItem("token");
    localStorage.removeItem("LoginStatus");
    route.push("/admin-login");

  };

  const handleAccountSettings = () => {
    console.log("Navigating to Account Settings...");
    // perform navigation logic here
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 1112 0H4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="hidden md:block text-gray-700">
          <p className="font-semibold text-sm">Admin User</p>
          <p className="text-xs text-gray-400">admin@proferadmin.com</p>
        </div>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-10">
          <button
            onClick={handleAccountSettings}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Account Settings
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

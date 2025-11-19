"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { Menu, X, Bell } from "lucide-react";
import {
  UserIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

import { Logo } from "@/components/Areas/shared/Logo";
import Notifications from "@/app/notify/NotificationPro";

export function ProHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);

  // single ref that wraps the area containing the interactive parts
  const containerRef = useRef(null);

  // Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Close dropdowns when clicking outside the containerRef
  useEffect(() => {
    function handleClickOutside(e) {
      // if ref not set, nothing to do
      if (!containerRef.current) return;

      // if the click is outside the container, close dropdowns
      if (!containerRef.current.contains(e.target)) {
        setShowNotifications(false);
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/pro/pro-dashboard", icon: BuildingOffice2Icon },
    { name: "Overview", href: "/pro/pro-overview", icon: BuildingOffice2Icon },
    { name: "Credentials", href: "/pro/pro-credentials", icon: ShieldCheckIcon, highlight: true },
    { name: "Bids", href: "/pro/pro-bid", icon: ClipboardDocumentListIcon },
    { name: "Subscription", href: "/pro/pro-subscribe", icon: CreditCardIcon },
    { name: "Business Details", href: "/pro/pro-business", icon: BuildingOffice2Icon },
    { name: "Profile", href: "/pro/pro-update", icon: UserIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem("Role");
    localStorage.removeItem("token");
    localStorage.removeItem("FrontendLoginStatus");
    document.cookie = "role=; path=/; max-age=0";
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 w-full border-b border-gray-200 bg-white px-4 md:px-10 py-3 md:py-4 z-50 shadow-sm">
      <div ref={containerRef} className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="https://www.profer.com/" className="flex items-center gap-2" prefetch={false}>
          <div className="w-24 md:w-28">
            <Logo />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-gray-600 font-medium text-sm mx-auto">
          {navLinks.map(link => {
            const isActive = pathname.startsWith(link.href);
            return (
              <button
                key={link.name}
                onClick={() => router.push(link.href)}
                className={clsx(
                  "flex items-center gap-2 relative transition-all px-2 py-1 rounded-md hover:text-gray-900 cursor-pointer",
                  isActive && "text-red-600 font-semibold"
                )}
              >
                <link.icon className={clsx("w-5 h-5", link.highlight && "text-red-600")} />
                <span className="truncate">{link.name}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4 relative">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="relative focus:outline-none p-1.5 hover:bg-gray-100 rounded-md transition"
              aria-label="View notifications"
            >
              <Bell className="w-6 h-6 text-gray-600" />
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[70vh] overflow-hidden"
              >
                <Notifications />
              </div>
            )}
          </div>

          {/* Account Menu */}
          <div className="relative">
            <button
              onClick={() => setAccountMenuOpen(prev => !prev)}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 text-sm"
            >
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-gray-700" />
              </div>
              <span className="text-gray-700 truncate max-w-[120px]">
                {user?.name || "My Account"}
              </span>
            </button>

            {accountMenuOpen && (
              <div
                className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-md z-50"
              >
                <Link
                  href="/pro/pro-dashboard"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle + Mobile Bell */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="text-gray-800 p-1.5"
          >
            <Bell size={22} />
          </button>

          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="text-gray-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Notification Dropdown */}
      {showNotifications && (
        <div className="md:hidden mt-2 bg-white border border-gray-200 shadow-lg rounded-md p-3 z-50">
          <Notifications />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-4 bg-white border-t border-gray-200">
          <nav className="flex flex-col space-y-2 text-gray-700 font-medium text-sm">
            {navLinks.map(link => {
              const isActive = pathname.startsWith(link.href);
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    router.push(link.href);
                    setMobileMenuOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 px-2 py-2 rounded-md hover:text-black text-left w-full",
                    isActive && "text-red-600 font-semibold"
                  )}
                >
                  <link.icon className={clsx("w-5 h-5", link.highlight && "text-red-600")} />
                  <span className="truncate">{link.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Account */}
          <div className="pt-4 border-t flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 text-gray-700 hover:text-black text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

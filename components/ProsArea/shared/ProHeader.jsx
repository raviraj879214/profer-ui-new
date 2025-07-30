"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import {
  UserIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { Logo } from "@/components/Areas/shared/Logo";

export function ProHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const navLinks = [
    { name: "ProFile™ Overview", href: "/pro/pro-dashboard", icon: BuildingOffice2Icon },
    { name: "Credentials", href: "#", icon: ShieldCheckIcon, highlight: true },
    { name: "Bids", href: "/pro/pro-bid", icon: ClipboardDocumentListIcon },
  ];

  const handleLinkClick = (name, href) => {
    setActiveLink(name);
    if (href && href !== "#") {
      router.push(href);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <div className="w-24 md:w-28">
            <Logo />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-gray-600 font-medium text-sm mx-auto">
          {navLinks.map((link) => {
            const isActive = activeLink === link.name;
            return (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.name, link.href)}
                className={clsx(
                  "flex items-center gap-2 relative transition-all px-2 py-1 rounded-md hover:text-gray-900 cursor-pointer",
                  isActive && "text-red-600 font-semibold",
                  link.href === "#" && "opacity-70"
                )}
              >
                <link.icon
                  className={clsx("w-5 h-5", link.highlight && "text-red-600")}
                />
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account Section */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
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
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md z-50">
                <Link
                  href="/account"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  Account
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

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-4 animate-slide-down">
          <nav className="flex flex-col space-y-3 text-gray-700 font-medium text-sm">
            {navLinks.map((link) => {
              const isActive = activeLink === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    handleLinkClick(link.name, link.href);
                    setMobileMenuOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 relative px-2 py-1 rounded-md hover:text-black text-left",
                    isActive && "text-red-600 font-semibold",
                    link.href === "#" && "opacity-70"
                  )}
                >
                  <link.icon
                    className={clsx("w-5 h-5", link.highlight && "text-red-600")}
                  />
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Account/Login */}
          <div className="pt-4 border-t">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="block py-2 text-gray-700 hover:text-black text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 hover:text-black text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-2 text-red-600 font-semibold text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

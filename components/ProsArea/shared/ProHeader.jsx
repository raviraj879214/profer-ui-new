"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import {
  UserIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Logo } from "@/components/Areas/shared/Logo";

export default function ProHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(pathname);

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/home", icon: UserIcon },
    { name: "ProFile™ Overview", href: "#", icon: BuildingOffice2Icon, disabled: true },
    { name: "Credentials", href: "#", icon: ShieldCheckIcon, highlight: true },
    { name: "Bids", href: "#", icon: ClipboardDocumentListIcon, disabled: true },
    { name: "Notifications", href: "#", icon: EnvelopeIcon, disabled: true },
    { name: "Stats", href: "#", icon: Cog6ToothIcon, disabled: true },
    { name: "Messages", href: "#", icon: ChatBubbleLeftRightIcon, disabled: true },
  ];

  const handleLinkClick = (href) => {
    if (href !== "#") setActiveLink(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("tempemailuser");
    setUser(null);
    router.push("/");
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white px-3 sm:px-5 md:px-8 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <div className="w-20 sm:w-24 md:w-28">
            <Logo />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 lg:gap-6 text-gray-600 font-medium text-xs sm:text-sm md:text-base mx-auto">
          {navLinks.map((link) => {
            const isActive = activeLink === link.href || pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.disabled ? "#" : link.href}
                prefetch={false}
                aria-disabled={link.disabled}
                onClick={() => handleLinkClick(link.href)}
                className={clsx(
                  "flex items-center gap-1.5 relative transition-colors px-1 lg:px-2 py-0.5",
                  link.disabled
                    ? "opacity-50 cursor-not-allowed select-none"
                    : "hover:text-gray-900 cursor-pointer",
                  isActive && "text-red-600 font-semibold"
                )}
              >
                <link.icon className={clsx("w-4 h-4", link.highlight && "text-red-600")} />
                {link.name}
                {isActive && !link.disabled && (
                  <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Account/Login Section */}
        <div className="hidden md:flex items-center gap-2">
         
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full hover:bg-gray-200 text-xs sm:text-sm"
              >
                <UserIcon className="w-4 h-4 text-gray-700" />
                <span className="text-gray-700 truncate max-w-[100px]">{}</span>
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                  <Link
                    href="/account"
                    className="block px-3 py-1.5 hover:bg-gray-100 text-gray-700 text-sm"
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-100 text-gray-700 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-3 pt-3 pb-5 space-y-3 animate-slide-down">
          <nav className="flex flex-col space-y-2 text-gray-700 font-medium text-sm">
            {navLinks.map((link) => {
              const isActive = activeLink === link.href || pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.disabled ? "#" : link.href}
                  prefetch={false}
                  aria-disabled={link.disabled}
                  onClick={() => {
                    handleLinkClick(link.href);
                    setMobileMenuOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-1.5 relative",
                    link.disabled
                      ? "opacity-50 cursor-not-allowed select-none"
                      : "hover:text-black",
                    isActive && "text-red-600 font-semibold"
                  )}
                >
                  <link.icon className={clsx("w-4 h-4", link.highlight && "text-red-600")} />
                  {link.name}
                  {isActive && !link.disabled && (
                    <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-red-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Account/Login */}
          <div className="pt-3 border-t">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="block py-1 text-gray-700 hover:text-black text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-1 text-gray-700 hover:text-black text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-1 text-red-600 font-semibold text-sm"
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

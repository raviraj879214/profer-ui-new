"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/home", icon: UserIcon },
    { name: "ProFile™ Overview", href: "#", icon: BuildingOffice2Icon, disabled: true },
    { name: "Credentials", href: "/credentials", icon: ShieldCheckIcon, highlight: true },
    { name: "Bids", href: "#", icon: ClipboardDocumentListIcon, disabled: true },
    { name: "Notifications", href: "#", icon: EnvelopeIcon, disabled: true },
    { name: "Stats", href: "#", icon: Cog6ToothIcon, disabled: true },
    { name: "Messages", href: "#", icon: ChatBubbleLeftRightIcon, disabled: true },
  ];

  return (
    <header className="w-full border-b border-gray-200 bg-white px-4 md:px-10 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Logo />
        </Link>

        {/* Desktop Nav - Centered */}
        <nav className="hidden md:flex gap-10 text-gray-600 font-medium text-lg mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.disabled ? "#" : link.href}
              prefetch={false}
              aria-disabled={link.disabled}
              className={clsx(
                "flex items-center gap-2 relative transition-colors px-2 py-1",
                link.disabled
                  ? "opacity-50 cursor-not-allowed select-none"
                  : "hover:text-gray-900 cursor-pointer",
                pathname === link.href && "text-red-600 font-semibold"
              )}
            >
              <link.icon className={clsx("w-5 h-5", link.highlight && "text-red-600")} />
              {link.name}
              {pathname === link.href && !link.disabled && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

       
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-gray-700 font-medium text-base">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.disabled ? "#" : link.href}
                prefetch={false}
                aria-disabled={link.disabled}
                className={clsx(
                  "flex items-center gap-2",
                  link.disabled
                    ? "opacity-50 cursor-not-allowed select-none"
                    : "hover:text-black",
                  pathname === link.href && "text-red-600 font-semibold"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className={clsx("w-5 h-5", link.highlight && "text-red-600")} />
                {link.name}
              </Link>
            ))}
          </nav>
         
        </div>
      )}
    </header>
  );
}

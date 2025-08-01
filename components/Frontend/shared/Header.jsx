"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/Areas/shared/Logo";
import { Menu, X } from "lucide-react"; // optional icons from lucide-react (or replace with SVGs)

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  
  const navLinks = [
    { name: "Search for Pros", href: "/search-for-pros" },
    { name: "Project Auction", href: "/auction" },
    { name: "Why Profer", href: "/why-profer" },
    // { name: "Submit Project", href: "/submit-project" },
    { name: "Select Plan", href: "/select-plan" },
  ];

  return (
    <header className="w-full border-b border-gray-200 bg-white px-4 md:px-10 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Logo />
        </Link>

        {/* Hamburger Menu Button (Mobile only) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Center Nav - Desktop only */}
        <nav className="hidden md:flex gap-8 text-gray-600 font-medium text-base">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch={false}
              className={clsx(
                "relative hover:text-black transition-colors pb-1",
                pathname === link.href && "text-black font-semibold"
              )}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-red-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Buttons - Desktop only */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-gray-700 hover:underline"
            prefetch={false}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
            prefetch={false}
          >
            Join Waitlist
          </Link>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-2 text-gray-700 font-medium text-base">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                prefetch={false}
                className={clsx(
                  "hover:text-black",
                  pathname === link.href && "text-black font-semibold"
                )}
                onClick={() => setMobileMenuOpen(false)} // close on click
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-700 hover:underline"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors text-center"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

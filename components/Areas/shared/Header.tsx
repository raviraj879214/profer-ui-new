import { useState } from "react";
import { Logo } from "./Logo";
import { UserBadge } from "./UserBadge";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo & Hamburger */}
        <div className="flex items-center space-x-3">
          {/* Hamburger for Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 text-2xl focus:outline-none"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          <Logo />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex space-x-8 text-gray-500 text-sm font-medium ml-6">
          <a href="#" className="hover:text-black transition">Search for Pros</a>
          <a href="#" className="hover:text-black transition">Project Auction</a>
          <a href="#" className="hover:text-black transition">Why Profer</a>
          <a href="#" className="hover:text-black transition">How it Works</a>
          <a href="#" className="hover:text-black transition">Profer Network</a>
        </nav>

        {/* Auth Buttons */}
        <div className="space-x-3 flex items-center ml-auto">
          <button className="hidden md:inline-block rounded-full border border-gray-400 px-4 py-1.5 text-sm font-medium hover:bg-gray-100 transition">
            Sign In
          </button>
          
          <UserBadge />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-5 pt-3 bg-gray-50 border-t border-gray-200 space-y-3 text-gray-800 text-sm font-medium">
          <a href="#" className="block py-2 px-2 rounded hover:bg-gray-100">Search for Pros</a>
          <a href="#" className="block py-2 px-2 rounded hover:bg-gray-100">Project Auction</a>
          <a href="#" className="block py-2 px-2 rounded hover:bg-gray-100">Why Profer</a>
          <a href="#" className="block py-2 px-2 rounded hover:bg-gray-100">How it Works</a>
          <a href="#" className="block py-2 px-2 rounded hover:bg-gray-100">Profer Network</a>

          {/* Mobile Auth Buttons */}
          <div className="pt-3 space-y-2">
            <button className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 transition">
              Sign In
            </button>
            <button className="w-full bg-red-600 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-red-700 transition">
              Join Profer
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

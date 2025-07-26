"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/adminguard/AuthGuard";
import { Footer } from "@/components/Areas/shared/Footer";
import { Header } from "@/components/Areas/shared/Header";
import { Sidebar } from "@/components/Areas/shared/Sidebar";
import { SidebarProvider } from "@/components/context/SidebarContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="relative flex flex-col min-h-screen bg-white font-sans overflow-hidden">
      <SidebarProvider>
        {/* <Header /> */}

        {/* Mobile Sidebar */}
        <div className="flex flex-1 flex-col md:flex-row relative z-10">
          <aside
            className={`transition-transform duration-300 ease-in-out md:translate-x-0 ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:flex flex-col w-64 bg-gray-900 text-white z-50 md:z-auto fixed md:static top-0 left-0 h-full md:h-auto overflow-y-auto`}
          >
            {/* Mobile Sidebar Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="px-3 py-1 bg-red-600 rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>

            <Sidebar />
          </aside>

          {/* Backdrop for mobile */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* Floating open button on mobile */}
          {!isMobileSidebarOpen && (
            <button
              className="fixed bottom-4 left-4 md:hidden bg-gray-800 text-white px-4 py-2 rounded-md z-40 shadow-md"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              Open Sidebar
            </button>
          )}

          <AuthGuard>
            <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 overflow-auto z-0">
              {children}
            </main>
          </AuthGuard>
        </div>

        {/* <Footer /> */}
      </SidebarProvider>
    </div>
  );
}

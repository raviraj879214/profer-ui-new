"use client";
 
import { useState } from "react";
import { AuthGuard } from "@/components/adminguard/AuthGuard";
import { Sidebar } from "@/components/Areas/shared/Sidebar";
import { SidebarProvider } from "@/components/context/SidebarContext";
import { AdminSubHeader } from "../../components/Areas/shared/AdminSubHeader";
 
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
 
  
  return (
    <div className="relative  bg-white font-sans overflow-hidden">
      <SidebarProvider>
        <div className="flex flex-1 flex-col md:flex-row relative ">
          {/* Sidebar */}
          <aside
            className={`transition-transform duration-300 ease-in-out md:translate-x-0 ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:flex flex-col w-64 bg-gray-900 text-white z-50 md:z-auto fixed md:static top-0 left-0 h-full md:h-auto overflow-y-auto`}
          >
            <Sidebar />
          </aside>
 
          {/* Backdrop for mobile */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-transparent bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
 
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
           
 
            <main className="flex-1 p-0 bg-gray-50 overflow-auto z-0">
               <AdminSubHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
              <AuthGuard>
                {children}
              </AuthGuard>
            </main>
          </div>
        </div>
      </SidebarProvider>
 
      {/* <Footer /> */}
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

// ---- Icons ----
function DashboardIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M3 12h7M3 6h7m-7 12h7m4-12h7M10 6l7 7-7 7" />
    </svg>
  );
}
function TimeIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
function CompaniesIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function ProjectsIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <rect x="3" y="7" width="18" height="14" rx="2" ry="2" />
      <path d="M16 3v4M8 3v4" />
    </svg>
  );
}
function CmsIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
      <line x1="3" y1="8" x2="21" y2="8" />
      <circle cx="12" cy="14" r="2" />
      <path d="M12 11v1M12 17v1M9.8 12.2l-.7-.7M15 17l-.7-.7M9.8 15.8l-.7.7M15 12.9l-.7.7" />
    </svg>
  );
}
function ProjectrequestedIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.82-.33 1.7 1.7 0 00-1 1.51V21a2 2 0 01-4 0v-.18a1.7 1.7 0 00-1-1.51 1.7 1.7 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.7 1.7 0 00.33-1.82 1.7 1.7 0 00-1.51-1H3a2 2 0 010-4h.18a1.7 1.7 0 001.51-1 1.7 1.7 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.7 1.7 0 001.82.33h.01a1.7 1.7 0 001-1.51V3a2 2 0 014 0v.18a1.7 1.7 0 001 1.51z" />
    </svg>
  );
}
function Qualification(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
    </svg>
  );
}
function ServicesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8zM6 12v1a3 3 0 006 0v-1M6 16v4m6-4v4" />
    </svg>
  );
}
function SettingsIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.82-.33 1.7 1.7 0 00-1 1.51V21a2 2 0 01-4 0v-.18a1.7 1.7 0 00-1-1.51 1.7 1.7 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.7 1.7 0 00.33-1.82 1.7 1.7 0 00-1.51-1H3a2 2 0 010-4h.18a1.7 1.7 0 001.51-1 1.7 1.7 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.7 1.7 0 001.82.33h.01a1.7 1.7 0 001-1.51V3a2 2 0 014 0v.18a1.7 1.7 0 001 1.51z" />
    </svg>
  );
}
function SubscriberIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 4l8 8 8-8" />
    </svg>
  );
}
function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function ContactsIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0113 0" />
    </svg>
  );
}

// ---- SideNavButton ----
interface SideNavButtonProps {
  icon?: React.ComponentType<any>;
  label: string;
  href: string;
  isSubItem?: boolean;
}
function SideNavButton({ icon: Icon, label, href, isSubItem = false }: SideNavButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-5 py-3 transition-colors ${
        isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-400"
      } ${isSubItem ? "pl-10 text-sm" : ""}`}
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

// ---- Sidebar ----
export function Sidebar() {
  const router = useRouter();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [generalOpen, setGeneralOpen] = useState(false);
  const [prosopen,setProsopen]= useState(false);





  
  return (
    <nav className="flex flex-col w-65 bg-gray-900 text-gray-400 text-sm flex-shrink-0 select-none">
      <div
        className="flex items-center justify-center cursor-pointer bg-white"
        onClick={() => router.push("/admin/dashboard")}
      >
        <Logo />
      </div>

      <SideNavButton icon={DashboardIcon} label="Dashboard" href="/admin/dashboard" />



      

       <button
        onClick={() => setProsopen(!prosopen)}
        className="flex items-center justify-between w-full px-5 py-3 hover:bg-gray-800 focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <ProjectsIcon className="w-5 h-5" />
          Pros Management
        </span>
        <ChevronDownIcon open={prosopen} />
      </button>

      {prosopen && (
        <div className="flex flex-col">
          <SideNavButton  label="Pros" href="/admin/companies"  isSubItem/>
          <SideNavButton  label="Invite Pros" href="/admin/invitepros"  isSubItem/>
         
        </div>
      )}



      {/* Projects collapsible */}
      <button
        onClick={() => setProjectsOpen(!projectsOpen)}
        className="flex items-center justify-between w-full px-5 py-3 hover:bg-gray-800 focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <ProjectsIcon className="w-5 h-5" />
          Project Management
        </span>
        <ChevronDownIcon open={projectsOpen} />
      </button>
      {projectsOpen && (
        <div className="flex flex-col">
           <SideNavButton  label="Project Requested" href="/admin/project-requested" isSubItem />
          <SideNavButton label="Project Management" href="/admin/projects" isSubItem />
          {/* <SideNavButton label="Create Project" href="/admin/create-project" isSubItem /> */}
         
          {/* <SideNavButton  label="Invite Pros" href="/admin/invitepros"  isSubItem/> */}
        </div>
      )}

      

      <button
        onClick={() => setGeneralOpen(!generalOpen)}
        className="flex items-center justify-between w-full px-5 py-3 hover:bg-gray-800 focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          General Settings
        </span>
        <ChevronDownIcon open={generalOpen} />
      </button>


       {generalOpen && (
        <div className="flex flex-col">
          <SideNavButton label="Preferred Time" href="/admin/prefered-time" isSubItem icon={TimeIcon} />
          <SideNavButton label="Plans" href="/admin/stripeplans" isSubItem icon={ServicesIcon} />
          {/* <SideNavButton label="CMS" href="/admin/cms" isSubItem icon={CmsIcon} /> */}
          <SideNavButton label="Qualifications" href="/admin/qualification" isSubItem icon={Qualification} />
          <SideNavButton label="Services" href="/admin/services" isSubItem icon={ServicesIcon} />
        </div>
      )}


      <SideNavButton icon={ContactsIcon} label="Contacts List" href="/admin/contacts" />
      {/* <SideNavButton icon={SubscriberIcon} label="Subscribers" href="/admin/subscribers" /> */}
      

   
      
     

      {/* <SideNavButton icon={SettingsIcon} label="Settings" href="/admin/settings" /> */}
    </nav>
  );
}

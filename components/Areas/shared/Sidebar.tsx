
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { SideNavButton } from "./SideNavButton";

function DashboardIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M3 12h7M3 6h7m-7 12h7m4-12h7M10 6l7 7-7 7" />
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

function BiddingIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function AnalyticsIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M3 3v18h18" />
      <path d="M9 17v-4h4v4h-4zm4-10v6h4V7h-4zM7 17v-8H3v8h4z" />
    </svg>
  );
}

function CmsIcon(props: any) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Outer browser frame */}
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
      <line x1="3" y1="8" x2="21" y2="8" />
      {/* Gear for settings */}
      <circle cx="12" cy="14" r="2" />
      <path d="M12 11v1M12 17v1M9.8 12.2l-.7-.7M15 17l-.7-.7M9.8 15.8l-.7.7M15 12.9l-.7.7" />
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
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  );
}



export function Sidebar() {


  const route = useRouter();



  return (
    <nav className="flex flex-col w-60 bg-gray-900 text-gray-400 text-sm flex-shrink-0 select-none">
      
       <div className="flex items-center justify-center" onClick={()=>route.push('/admin/dashboard') }>
          <Logo></Logo>
      </div>
    
      <SideNavButton icon={DashboardIcon} label="Dashboard" href="/admin/dashboard" />
      <SideNavButton icon={CompaniesIcon} label="Companies" href="/admin/companies" />
      <SideNavButton icon={ProjectsIcon} label="Projects" href="/admin/projects" />
      {/* <SideNavButton icon={BiddingIcon} label="Bidding Activity" href="/admin/bidding" /> */}
      {/* <SideNavButton icon={AnalyticsIcon} label="Analytics" href="/admin/analytics" /> */}
      {/* <SideNavButton icon={UsersIcon} label="Users" href="/admin/users" /> */}

      <SideNavButton icon={CmsIcon} label="CMS" href="/admin/cms" /> 

      <SideNavButton icon={ProjectrequestedIcon} label="Project Requested" href="/admin/project-requested" />
      <SideNavButton icon={Qualification} label="Qualification" href="/admin/qualification" />
      <SideNavButton icon={SettingsIcon} label="Settings" href="/admin/settings" />
    </nav>
  );
}

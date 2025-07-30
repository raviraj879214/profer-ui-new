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

function UsersIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21h13a2 2 0 00-13 0z" />
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

export function Sidebar() {
  return (
    <nav className="flex flex-col w-60 bg-gray-900 text-gray-400 text-sm flex-shrink-0 select-none">
      <SideNavButton icon={DashboardIcon} label="Dashboard" href="/admin/dashboard" />
      <SideNavButton icon={CompaniesIcon} label="Companies" href="/admin/companies" />
      {/* <SideNavButton icon={ProjectsIcon} label="Projects" href="/admin/projects" />
      <SideNavButton icon={BiddingIcon} label="Bidding Activity" href="/admin/bidding" />
      <SideNavButton icon={AnalyticsIcon} label="Analytics" href="/admin/analytics" />
      <SideNavButton icon={UsersIcon} label="Users" href="/admin/users" /> */}
      <SideNavButton icon={UsersIcon} label="CMS" href="/admin/cms" /> 

      <SideNavButton icon={ProjectrequestedIcon} label="Project Requested" href="/admin/project-requested" />

      <SideNavButton icon={SettingsIcon} label="Settings" href="/admin/settings" />
    </nav>
  );
}

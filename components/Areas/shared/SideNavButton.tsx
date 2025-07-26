"use client"; // needed to use hooks in Next.js App Router

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideNavButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
}

export function SideNavButton({ icon: Icon, label, href }: SideNavButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-5 py-4 transition-colors ${
        isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-400"
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-semibold">{label}</span>
    </Link>
  );
}

"use client"
import React, { useMemo, useState } from "react";
import {
  User,
  BadgeCheck,
  KeyRound,
  FileCheck2,
  PencilLine,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { ProUpdate } from "../../ProsArea/ProUpdate/ProfileUpdate.jsx";
import { Bid } from "../BidManagement/BidManagementList.jsx";
import { useRouter } from "next/navigation";

const widgets = [
  {
    href: "/pro/pro-overview",
    label: "Profile Overview",
   
    sub: "Profile Completeness",
    color: "indigo",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.121 17.804A4 4 0 0112 15h0a4 4 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ),
  },
  {
    href: "/pro/pro-credentials",
    label: "Credentials",
   
    sub: "Pro Badge",
    color: "green",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
  {
    href: "/pro/pro-bid",
    label: "Bids",
   
    sub: "Bids",
    color: "yellow",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 14l2-2 4 4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
  {
    href: "/pro/pro-update",
    label: "Profile Update",
   
    sub: "Update Info",
    color: "purple",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M9 13l6 6M9 13l-6 6M15 5l-6 6"
      />
    ),
  },
];


export function ProDash() {

    const router = useRouter();



  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {widgets.map((w, idx) => {
        const active = router.pathname === w.href;
        return (
          <Link
            key={idx}
            href={w.href}
            className={`rounded-2xl border p-5 shadow-sm transition cursor-pointer 
            ${
              active
                ? "border-red-500 text-red-600 shadow-md"
                : "bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`h-10 w-10 rounded-xl grid place-items-center 
                bg-${w.color}-100 text-${w.color}-600`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {w.icon}
                </svg>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-xl ${
                  active ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"
                }`}
              >
                {w.label}
              </span>
            </div>
            <div
              className={`mt-4 text-2xl font-semibold ${
                active ? "text-red-600" : ""
              }`}
            >
              {w.value}
            </div>
            <div className="text-sm text-gray-600">{w.sub}</div>
          </Link>
        );
      })}
    </div>

        {/* Main Grid */}
        <section className="mt-6 grid grid-cols-12 gap-6 w-full">
          {/* Bids */}
          <div className="col-span-12 xl:col-span-12">
            <Card>
              <Bid />
            </Card>

            {/* Profile Update */}
            <Card className="mt-6">
              <div className="flex items-center gap-2 ">
                <PencilLine className="h-5 w-5" />
                <h3 className="font-semibold">Profile Update</h3>
              </div>
              <ProUpdate />
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

// ————— Reusable UI Bits —————
function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-xl border px-2 py-0.5 text-[12px] font-medium ${className}`}>
      {children}
    </span>
  );
}

function KpiCard({ icon, label, value, hint, link }) {
  const content = (
    <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-xl bg-gray-900/5 grid place-items-center">{icon}</div>
        <Badge className="bg-gray-50 text-gray-700 border-gray-200">{hint}</Badge>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

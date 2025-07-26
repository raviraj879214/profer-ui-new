import type React from "react"
import Link from "next/link"
import Image from "next/image"

export default function VerifiedNetworkSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 space-y-12 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Verified Network</h2>
        </div>
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg"
            alt="USA Map"
            width={600}
            height={400}
            className="w-full max-w-2xl h-auto object-contain"
          />
        </div>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Start your next Pro search with the transparent nationwide network of{" "}
          <span className="font-semibold text-profer-blue">verified and trusted Profer Pros</span>. By letting each Pro
          show what&apos;s important to you, you&apos;ll know everything that makes a Pro a Pro. Never hire an
          unverified contractor who isn&apos;t verified in their profession.
        </p>
        <div className="pt-4">
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-profer-blue font-semibold hover:underline"
            prefetch={false}
          >
            <SearchIcon className="w-5 h-5" />
            Search for Pros
          </Link>
        </div>
      </div>
    </section>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

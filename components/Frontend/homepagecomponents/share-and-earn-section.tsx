import type React from "react"
import Image from "next/image"
import Link from "next/link"

export default function ShareAndEarnSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-profer-light-blue overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 space-y-12 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Share a Pro and Earn</h2>
        </div>
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg"
            alt="Share and Earn Illustration"
            width={300}
            height={200}
            className="w-full max-w-xs h-auto object-contain"
          />
        </div>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Earn points by referring Pros to your family and friends.{" "}
          <span className="font-semibold text-profer-blue">Profer Points</span> are points that determine the amount of
          your remittance in a <span className="font-semibold text-profer-blue">Project Auction™</span>. You already
          share Pros - now start earning rewards when you do.
        </p>
        <div className="pt-4">
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-profer-blue font-semibold hover:underline"
            prefetch={false}
          >
            <ArrowRightIcon className="w-5 h-5" />
            How it works
          </Link>
        </div>
      </div>
    </section>
  )
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

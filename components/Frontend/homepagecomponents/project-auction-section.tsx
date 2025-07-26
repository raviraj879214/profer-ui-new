import type React from "react"
import Image from "next/image"

export default function ProjectAuctionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-profer-dark text-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 space-y-12 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Project Auction™</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Shopping around for a Pro that fits your budget has never been easier. As a Client or general contractor,
            ensure your project gets the best value with our verified and trusted network.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg"
            alt="Project Auction Example"
            width={900}
            height={600}
            className="w-full max-w-5xl h-auto object-contain rounded-lg shadow-xl border border-gray-700"
          />
        </div>
        <div className="pt-8">
          <button className="inline-flex items-center gap-2 text-profer-blue font-semibold hover:underline">
            <ArrowRightIcon className="w-5 h-5" />
            Start a Project Auction™
          </button>
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

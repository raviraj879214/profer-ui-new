import type React from "react"
import Image from "next/image"
import Link from "next/link"

export default function WhyProferSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 space-y-12 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Profer</h2>
        </div>
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg"
            alt="Why Profer Illustration"
            width={300}
            height={200}
            className="w-full max-w-xs h-auto object-contain"
          />
        </div>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Your <span className="font-semibold text-profer-blue">property matters</span>. Don&apos;t take chances with
          unverified Pros. With <span className="font-semibold text-profer-blue">Profer</span>, you&apos;ll know
          everything about the Pros you hire, which Pros fall short. Plus, with the{" "}
          <span className="font-semibold text-profer-blue">Project Auction™</span>, choosing the right Pro to fit your
          budget has never been easier.
        </p>
        <div className="pt-4">
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-profer-blue font-semibold hover:underline"
            prefetch={false}
          >
            <ArrowRightIcon className="w-5 h-5" />
            Learn More
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

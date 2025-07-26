import Image from "next/image"

export default function WhatIsProferPro() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-profer-light-blue overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 space-y-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What is a Profer Pro?</h2>
            <p className="text-lg text-gray-700 max-w-md mx-auto lg:mx-0">
              A <span className="font-semibold text-profer-blue">Profer Pro</span> is a verified licensed, bonded, and
              insured professional.
            </p>
          </div>
          <div className="relative flex flex-col items-center lg:items-end space-y-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Image src="/placeholder.svg" alt="Pro Verified Checkmark" width={24} height={24} />
              <span className="text-lg font-semibold text-profer-blue">Pro Verified™</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs text-center lg:text-right">
              A blue check mark shows that a <span className="font-semibold">ProFile™</span> is fully verified. All
              documents and information are verified authentic.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">ProFile™</h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              A <span className="font-semibold text-profer-blue">ProFile™</span> is a centralized view of all a
              Pro&apos;s licenses, registrations, insurance, certifications, badges, and more. All in one place.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/placeholder.svg"
              alt="ProFile Example 1"
              width={800}
              height={450}
              className="w-full max-w-4xl h-auto object-contain rounded-lg shadow-xl border border-gray-200"
            />
          </div>
        </div>

        <div className="space-y-12 pt-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">See For Yourself</h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Don&apos;t take chances with unverified Pros. Verify the Pro you hire next. Take a look at a sample
              ProFile for yourself.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/placeholder.svg"
              alt="ProFile Example 2"
              width={800}
              height={450}
              className="w-full max-w-4xl h-auto object-contain rounded-lg shadow-xl border border-gray-200"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

'use client';

import Image from 'next/image';

export const ProfessionalProfile = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_left,rgba(0,172,193,0.08),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
        {/* GRID: Left - What is Profer Pro, Right - ProFile & ProVerified */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 lg:text-5xl">
              What is a <span className="text-sky-600">Profer Pro</span>?
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed flex-1">
                <span className="font-semibold text-sky-600">A Profer Pro</span> is a verified contractor who maintains homes, buildings, or both.
              </p>
              <Image
                src="/images/Profer logo.png"
                alt="Profer logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-10">
            {/* ProFile */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Image
                src="/images/2.jpg"
                alt="ProFile badge"
                width={80}
                height={80}
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Pro<span className="text-red-500">File</span>™
                </h3>
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                  A <span className="font-semibold">ProFile™</span> is a centralized view of a Pros&apos; professional licenses, insurance, certifications, badges, and more—all in one spot.
                </p>
              </div>
            </div>

            {/* ProVerified */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Image
                src="/images/4.png"
                alt="ProVerified badge"
                width={80}
                height={80}
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Pro<span className="text-emerald-500">Verified</span>™
                </h3>
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                  A <span className="text-sky-600 underline cursor-pointer">blue check mark</span> shows that a ProFile™ is fully verified. All documents displayed are verified as authentic and legitimate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CARD SECTION */}
        <div className="mt-16 flex flex-col items-center gap-8">
          <Image
            src="/images/5.png"
            alt="Hometown Roofing Co. ProFile card"
            width={800}
            height={400}
            className="rounded-lg shadow-lg w-full max-w-4xl"
          />
          <Image
            src="/images/6.png"
            alt="Another Profile Card"
            width={750}
            height={350}
            className="rounded-lg shadow-lg w-full max-w-3xl"
          />
         <div className="flex flex-row flex-wrap justify-center gap-6 w-full">
  <Image
    src="/images/7.jpg"
    alt="Card 1"
    width={340}
    height={200}
    className="rounded-lg shadow-md w-full max-w-sm"
  />
  <Image
    src="/images/8.jpg"
    alt="Card 2"
    width={340}
    height={200}
    className="rounded-lg shadow-md w-full max-w-sm"
  />
</div>

        </div>
      </div>
    </section>
  );
};

import Link from "next/link";
import Image from "next/image";



export default function Home() {
  return (
    <main className="font-sans">


      {/* Hero Banner Section - Two Column Layout */}
      <section className="bg-white px-6 md:px-24 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">

          {/* Left Side Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Verify your <span className="text-red-500">Pro</span>
            </h1>
            <p className="text-gray-700 mb-6 text-lg">
              Search and view the validity of any Pro.<br />
              Always verify your contractor before beginning any work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <input
                type="text"
                placeholder="Enter Company Name"
                className="border border-gray-300 px-6 py-3 rounded-md w-full sm:w-80 shadow text-gray-900 text-base"
              />
              <button className="bg-red-500 text-white px-8 py-3 rounded-md font-semibold shadow">
                Verify
              </button>
            </div>
          </div>

          {/* Right Side Illustration */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <Image
              src="/images/bannerimage.png" // Replace with your house/roofing image
              alt="Illustration"
              width={650}
              height={400}
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
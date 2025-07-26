import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            We let trust transfer by igniting word of mouth
          </h1>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Verify your Pro</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
              Search and view the validity of any Pro.
              <br />
              We&apos;ve got you covered, even before you beginning any work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <input
                type="text"
                placeholder="Enter Company Name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-profer-blue"
              />
              <button className="bg-profer-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-profer-blue/90 transition-colors">
                Verify
              </button>
            </div>
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
          <Image
            src="/placeholder.svg"
            alt="Hero Illustration"
            width={600}
            height={400}
            className="w-full max-w-lg lg:max-w-none h-auto object-contain"
          />
        </div>
      </div>
      {/* Simple approximation of the wave background */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-profer-light-blue to-transparent -z-10" />
    </section>
  )
}

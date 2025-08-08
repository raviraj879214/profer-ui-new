"use client"
import { useRouter } from "next/navigation";




export default function ProsStepNextCredentials() {
  const router = useRouter();
  return (
    <>
      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-16">
          {/* Left Image */}
          <div className="flex-shrink-0 w-full md:w-[300px] flex justify-center md:justify-start mb-10 md:mb-0">
            <img
              src="/images/company-profile-4.png"
              alt="Company Profile"
              className="w-48 h-auto md:w-64 object-contain"
            />
          </div>
          {/* Right Text Content */}
          <div className="max-w-xl text-gray-900 font-sans">
            <h2 className="text-2xl font-semibold mb-4">Next, enter your credentials.</h2>
            <p className="text-gray-500 text-base leading-relaxed">
              We recommend converting all printed certifications to a digital document with a scanner. Photos work,
              but scanned documents ensure your{' '}
              <span className="font-bold text-[#E94E3B]">
                Pro
                <span className="text-sm align-super font-normal">File™</span>
              </span>{' '}
              looks the best. Let your Pro show.
            </p>
          </div>
        </div>
      </main>
      {/* Bottom Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        {/* Back Button */}
       
        
        {/* Next Button */}
        <button
          onClick={() => {
            router.push('/pro/pro-credentials');
          }}
          className="bg-gray-900 text-white font-semibold rounded-lg py-2 px-6 shadow-md hover:brightness-110 transition duration-150"
        >
          Next
        </button>
      </div>
    </>
  );
}
"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";


export function ProsStep(){
    const router =useRouter();




    return(<>
     <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-6 sm:px-12 py-20 flex flex-col items-center text-center">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-16 w-full">
          <div className="flex-shrink-0 max-w-xs md:max-w-sm">
           <Image
           src="/images/comapny-profile.png"
            alt="Company profile illustration"
            width={400}
            height={400}
            className="w-full h-auto mx-auto"
            />
          </div>
          <div className="mt-10 md:mt-0 text-left max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-900">Hi, {"there"}.</h2>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Congratulations on your Pro Membership! Get started by entering your business details. Click Next to save and proceed.
            </p>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="mt-20 w-full flex items-center justify-between max-w-lg mx-auto">
          <button className="text-gray-400 text-sm font-semibold focus:outline-none"></button>
          <div className="flex space-x-3 items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 block"></span>
            <span className="w-3 h-3 rounded-full bg-gray-300 block"></span>
            <span className="w-3 h-3 rounded-full bg-gray-300 block"></span>
          </div>
          <button onClick={()=> router.push('/pro/step-2')} className="bg-[#0A0B27] shadow-lg text-white py-2 px-6 rounded-full text-sm font-semibold hover:bg-[#131533] transition">
            Next
          </button>
        </div>
      </main>
    </div>

    </>);
}
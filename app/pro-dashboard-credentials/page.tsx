'use client';
import Image from 'next/image';
import Link from 'next/link';

interface DocumentItem {
  title: string;
  imgSrc: string;
  alt: string;
  subText?: string;
}

interface CredentialSectionProps {
  title: string;
  viewCount: number;
  documents: DocumentItem[];
}

export default function Home() {
  return (
    <>
    {/*Header */}
  <div className="bg-gray-50 px-[30px]">
     <div className="bg-[#c9edf2] py-4 px-6 flex justify-between items-center">

        {/* Left Side - Logo and Name */}
        <div className="flex items-center space-x-4">
          <Image
            src="/images/hometownroofing.png"
            alt="Hometown Roofing Logo"
            width={150}
            height={100}
            className="object-contain"
          />
          <div>
            <div className="flex items-center space-x-2">
              <Image
                src="/images/tick.png"
                width={28}
                height={28}
                alt="Verified tick"
                className="object-contain"
              />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Hometown Roofing Co.
              </h2>
            </div>
            <p className="text-gray-500 text-sm">Hometown, USA</p>
          </div>
        </div>

        {/* Right Side - Link */}
        <Link
          href="#"
          className="text-teal-500 text-sm sm:text-base hover:underline"
        >
          View Public ProFile™
        </Link>
      </div>
    </div>
     <div className="my-5 " />
 {/*Main */}
<div className="w-full px-4 sm:px-6 py-6 bg-gray-50">
  <div className="relative max-w-screen-lg mx-auto rounded-2xl shadow-lg shadow-black/60 bg-white p-4 sm:p-6">
    {/* Update Link */}
    <Link href="#" className="absolute top-2 right-4 text-xl text-red-600 hover:underline">
      Update
    </Link>

    {/* Certificates Section */}
    <div className="mt-8 flex flex-wrap gap-6 justify-center">
       
      
      {/* Column 1 */}
      <div className="flex flex-col items-center sm:items-start min-w-[180px] max-w-[250px]">
        
        <div className="flex items-center gap-2 mb-2">
          <Image src="/images/licensed.png" alt="Shield Icon" width={24} height={24} />
          <h3 className="font-semibold text-gray-800 text-center sm:text-left">
            State Licenses, Registrations,<br /> and Certifications
          </h3>
        </div>
        <Link href="#" className="text-sm text-blue-500 hover:underline mb-4">
          View 35 document(s)
        </Link>
        <div className="h-[120px] w-[200px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-400 cursor-pointer shadow-sm">
          <span className="text-2xl text-teal-500">+</span>
          <p className="text-xs">Drag & drop</p>
          <p className="text-xs">or</p>
          <p className="text-xs text-teal-500 underline">Click to upload</p>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
          Kansas Registered Roofing Contractor Certificate
        </p>
        <div className="h-[124px] w-[250px] mt-10 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/RC.jpg"
            alt="RC Certificate"
            width={250}
            height={130}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
          North Carolina Registered Roofing Contractor Certificate
        </p>
        <div className="h-[124px] w-[250px] mt-10  rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/NCC.jpg"
            alt="NCC Certificate"
            width={250}
            height={130}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</div>


<div className="w-full px-4 sm:px-6 py-6 bg-gray-50">
  <div className="relative max-w-screen-lg mx-auto rounded-2xl shadow-lg shadow-black/60 bg-white p-4 sm:p-6">
    {/* Update Link */}
    <Link href="#" className="absolute top-2 right-4 text-xl text-red-600 hover:underline">
      Update
    </Link>

    {/* Certificates Section */}
    <div className="mt-8 flex flex-wrap gap-6 justify-center">
      
      {/* Column 1 */}
      <div className="flex flex-col items-center sm:items-start min-w-[180px] max-w-[250px]">
        <div className="flex items-center gap-2 mb-2">
          <Image src="/images/licensed.png" alt="Shield Icon" width={24} height={24} />
          <h3 className="font-semibold text-gray-800 text-center sm:text-left">
          Local Licenses, Registrations, and Certifications
          </h3>
        </div>
        <Link href="#" className="text-sm text-blue-500 hover:underline mb-4">
          View 35 document(s)
        </Link>
        <div className="h-[120px] w-[200px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-400 cursor-pointer shadow-sm">
          <span className="text-2xl text-teal-500">+</span>
          <p className="text-xs">Drag & drop</p>
          <p className="text-xs">or</p>
          <p className="text-xs text-teal-500 underline">Click to upload</p>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
        MABCD Class A General Contractor License   
        </p>
        <div className="h-[124px] w-[250px] mt-10 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/CL.jpg"
            alt="RC Certificate"
            width={250}
            height={130}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
         Johnson County Class A General Contractor License    
        </p>
        <div className="h-[124px] w-[250px] mt-10 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/JC.jpg"
            alt="NCC Certificate"
            width={250}
            height={130}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</div>








<div className="w-full px-4 sm:px-6 py-6 bg-gray-50">
  <div className="relative max-w-screen-lg mx-auto rounded-2xl shadow-lg shadow-black/60 bg-white p-4 sm:p-6">
    {/* Update Link */}
    <Link href="#" className="absolute top-2 right-4 text-xl text-red-600 hover:underline">
      Update
    </Link>

    {/* Certificates Section */}
    <div className="mt-8 flex flex-wrap gap-6 justify-center">
      
      {/* Column 1 */}
      <div className="flex flex-col items-center sm:items-start min-w-[180px] max-w-[250px]">
        <div className="flex items-center gap-2 mb-2">
          <Image src="/images/insured.jpg" alt="Shield Icon" width={24} height={24} />
          <h3 className="font-semibold text-gray-800 text-center sm:text-left">
          Insurance
          </h3>
        </div>
        <Link href="#" className="text-sm text-blue-500 hover:underline mb-4">
          View 35 document(s)
        </Link>
        <div className="h-[120px] w-[200px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-400 cursor-pointer shadow-sm">
          <span className="text-2xl text-teal-500">+</span>
          <p className="text-xs">Drag & drop</p>
          <p className="text-xs">or</p>
          <p className="text-xs text-teal-500 underline">Click to upload</p>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
      Liability Insurance Certificatee   
        </p>
        <div className="h-[124px] w-[250px] mt-10 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/LI.jpg"
            alt="RC Certificate"
            width={250}
            height={130}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
        Workers Compensations Insurance Certificate   
        </p>
        <div className="h-[124px] w-[250px] mt-6 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/LI.jpg"
            alt="NCC Certificate"
            width={250}
            height={130}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</div>

<div className="w-full px-4 sm:px-6 py-6 bg-gray-50">
  <div className="relative max-w-screen-lg mx-auto rounded-2xl shadow-lg shadow-black/60 bg-white p-4 sm:p-6">
    {/* Update Link */}
    <Link href="#" className="absolute top-2 right-4 text-xl text-red-600 hover:underline">
      Update
    </Link>

    {/* Certificates Section */}
    <div className="mt-8 flex flex-wrap gap-6 justify-center -ml-[250px]">
      
      {/* Column 1 */}
      <div className="flex flex-col items-center sm:items-start min-w-[180px] max-w-[250px]">
        <div className="flex items-center gap-2 mb-2">
          <Image src="/images/Checkmark.png" alt="Shield Icon" width={24} height={24} />
          <h3 className="font-semibold text-gray-800 text-center sm:text-left">
         Certificate of Good Standing
          </h3>
        </div>
        <Link href="#" className="text-sm text-blue-500 hover:underline mb-4">
          View 35 document(s)
        </Link>
        <div className="h-[120px] w-[200px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-400 cursor-pointer shadow-sm">
          <span className="text-2xl text-teal-500">+</span>
          <p className="text-xs">Drag & drop</p>
          <p className="text-xs">or</p>
          <p className="text-xs text-teal-500 underline">Click to upload</p>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
      Kansas Secretary of State Certificate of Good Standing  
        </p>
        <div className="h-[124px] w-[250px] mt-4 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/SC.jpg"
            alt="RC Certificate"
            width={250}
            height={130}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Column 3 */}
      
    </div>
  </div>
</div>
 

//

<div className="w-full px-4 sm:px-6 py-6 bg-gray-50">
  <div className="relative max-w-screen-lg mx-auto rounded-2xl shadow-lg shadow-black/60 bg-white p-4 sm:p-6">
    {/* Update Link */}
    <Link href="#" className="absolute top-2 right-4 text-xl text-red-600 hover:underline">
      Update
    </Link>

    {/* Certificates Section */}
    <div className="mt-8 flex flex-wrap gap-6 justify-center">
      
      {/* Column 1 */}
      <div className="flex flex-col items-center sm:items-start min-w-[180px] max-w-[250px]">
        <div className="flex items-center gap-2 mb-2">
          <Image src="/images/Checkmark.png" alt="Shield Icon" width={24} height={24} />
          <h3 className="font-semibold text-gray-800 text-center sm:text-left">
       Skills Certifications
          </h3>
        </div>
        <Link href="#" className="text-sm text-blue-500 hover:underline mb-4">
          View 35 document(s)
        </Link>
        <div className="h-[120px] w-[200px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-400 cursor-pointer shadow-sm">
          <span className="text-2xl text-teal-500">+</span>
          <p className="text-xs">Drag & drop</p>
          <p className="text-xs">or</p>
          <p className="text-xs text-teal-500 underline">Click to upload</p>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
   Ludowici Installation Certificate   
        </p>
        <div className="h-[124px] w-[250px] mt-9 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/LC1.jpg"
            alt="RC Certificate"
            width={250}
            height={130}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
      Ludowici Installation Certificate    
        </p>
        <div className="h-[124px] w-[250px] mt-9 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/LC2.jpg"
            alt="NCC Certificate"
            width={250}
            height={130}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</div>


<p className="text-center text-red-600 text-l mt-2">
  Missing safety certifications. Please upload.
</p>

<div className="w-full px-4 sm:px-6 py-6 bg-gray-50">
 <div className="relative max-w-screen-lg mx-auto rounded-2xl border border-red-300 shadow-[0_4px_12px_rgba(255,0,0,0.08)] bg-white p-4 sm:p-6">

    {/* Update Link */}
    

    {/* Certificates Section */}
    <div className="mt-8 flex flex-wrap gap-6 justify-center">
      
      {/* Column 1 */}
      <div className="flex flex-col items-center sm:items-start min-w-[180px] max-w-[250px] -ml-[540px]">
        <div className="flex items-center gap-2 mb-2 ">
          <Image src="/images/Checkmark.png" alt="Shield Icon" width={24} height={24} />
          <h3 className="font-semibold text-gray-800 text-center sm:text-left  ">
       Safety Certifications
          </h3>
        </div>
        <Link href="#" className="text-sm text-blue-500 hover:underline mb-4">
          View 35 document(s)
        </Link>
        <div className="h-[120px] w-[200px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-400 cursor-pointer shadow-sm">
          <span className="text-2xl text-teal-500">+</span>
          <p className="text-xs">Drag & drop</p>
          <p className="text-xs">or</p>
          <p className="text-xs text-teal-500 underline">Click to upload</p>
        </div>
      </div>

      {/* Column 2 */}
     
    </div>
  </div>
</div>

//
  <div className="w-full px-4 sm:px-6 py-6 bg-gray-50">
  <div className="relative max-w-screen-lg mx-auto rounded-2xl shadow-lg shadow-black/60 bg-white p-4 sm:p-6">
    {/* Update Link */}
    <Link href="#" className="absolute top-2 right-4 text-xl text-red-600 hover:underline">
      Update
    </Link>

    {/* Certificates Section */}
    <div className="mt-8 flex flex-wrap gap-6 justify-center">
      
      {/* Column 1 */}
      <div className="flex flex-col items-center sm:items-start min-w-[180px] max-w-[250px]">
        <div className="flex items-center gap-2 mb-2">
          <Image src="/images/Checkmark.png" alt="Shield Icon" width={24} height={24} />
          <h3 className="font-semibold text-gray-800 text-center sm:text-left">
          Government Certifications
          </h3>
        </div>
        <Link href="#" className="text-sm text-blue-500 hover:underline mb-4">
          View 35 document(s)
        </Link>
        <div className="h-[120px] w-[200px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-400 cursor-pointer shadow-sm">
          <span className="text-2xl text-teal-500">+</span>
          <p className="text-xs">Drag & drop</p>
          <p className="text-xs">or</p>
          <p className="text-xs text-teal-500 underline">Click to upload</p>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
        Kansas Minority Business Owner    
        </p>
        <div className="h-[124px] w-[250px] mt-10 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/KS.jpg"
            alt="RC Certificate"
            width={250}
            height={130}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
       SAM.GOV
Registration Certificate       
        </p>
        <div className="h-[124px] w-[250px] mt-10 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/SOM.jpg"
            alt="NCC Certificate"
            width={250}
            height={130}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</div>


<div className="w-full px-4 sm:px-6 py-6 bg-gray-50">
  <div className="relative max-w-screen-lg mx-auto rounded-2xl shadow-lg shadow-black/60 bg-white p-4 sm:p-6">
    {/* Update Link */}
    <Link href="#" className="absolute top-2 right-4 text-xl text-red-600 hover:underline">
      Update
    </Link>

    {/* Certificates Section */}
    <div className="mt-8 flex flex-wrap gap-6 justify-center">
      
      {/* Column 1 */}
      <div className="flex flex-col items-center sm:items-start min-w-[180px] max-w-[250px]">
        <div className="flex items-center gap-2 mb-2">
          <Image src="/images/Checkmark.png" alt="Shield Icon" width={24} height={24} />
          <h3 className="font-semibold text-gray-800 text-center sm:text-left">
         Badges
          </h3>
        </div>
        <Link href="#" className="text-sm text-blue-500 hover:underline mb-4">
          View 35 document(s)
        </Link>
        <div className="h-[120px] w-[200px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-400 cursor-pointer shadow-sm">
          <span className="text-2xl text-teal-500">+</span>
          <p className="text-xs">Drag & drop</p>
          <p className="text-xs">or</p>
          <p className="text-xs text-teal-500 underline">Click to upload</p>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
       Porch Pro Badge    
        </p>
        <div className="h-[124px] w-[250px] mt-9 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/PP.png"
            alt="RC Certificate"
            width={250}
            height={130}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col items-center text-center min-w-[180px] max-w-[250px]">
        <p className="text-sm font-semibold text-gray-500 mb-2">
Google Guaranteed Badge       
        </p>
        <div className="h-[124px] w-[250px] mt-9 rounded-md border overflow-hidden shadow-sm">
          <Image
            src="/images/GG.png"
            alt="NCC Certificate"
            width={250}
            height={130}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</div>
<div className="flex justify-center">
  <button
    type="button"
    className="items-center mt-6 rounded-full bg-red-500 w-full max-w-xs px-6 py-3 text-white text-lg sm:text-2xl font-medium shadow-md transition-colors hover:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
  >
    Save
  </button>
</div>
<div className='my-10'></div>
   
    </>
  );
}







function CredentialSection({ title, viewCount, documents }: CredentialSectionProps) {
  return (
    <section className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center mb-4 space-x-3">
        <CredentialIcon title={title} />
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>

      <p className="text-blue-500 text-xs font-semibold mb-6 cursor-pointer">
        View {viewCount} document{viewCount !== 1 ? "s" : ""}
      </p>

      {documents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {documents.map(({ title, imgSrc, alt, subText }, i) => (
            <div key={i} className="space-y-1">
              <p className="text-xs text-gray-600">{title}</p>
              {subText && <p className="text-xs text-gray-400 italic">{subText}</p>}
              <div className="w-full max-w-xs h-28 bg-gray-200 rounded overflow-hidden relative">
                <img src={imgSrc} alt={alt} className="object-contain w-full h-full" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function CredentialIcon({ title }: { title: string }) {
  // (same SVG logic as before)
  if (title.includes("State Licenses")) { /* SVG */ }
  // ... rest of your icons
  return (
    <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect width={18} height={18} x={3} y={3} rx={2} ry={2} />
    </svg>
  );
}

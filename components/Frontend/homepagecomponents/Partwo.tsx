import React from 'react';
import Image from 'next/image';

export function Protwo() {
  return (
    <section className=" bg-white overflow-hidden">
      {/* Background decorative element */}
     <div className="max-w-8xl mx-auto px-4 py-16 lg:py-20 flex flex-col items-center text-center">
  <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
    {/* Left side - Illustration */}
    <div>
      <Image
        src="/images/9.png"  // You may want to adjust this to use the new illustration if needed
        alt="Professional reviewing credentials"
        width={200}
        height={100}
        className="object-contain" // Adjust class if different styling is needed
        priority
      />
    </div>

    {/* Right side - Heading */}
    <div>
     <h1 className="text-2xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight whitespace-nowrap">
  See for Yourself
</h1>
    </div>
  </div>

  {/* PARAGRAPH BELOW */}
  <div className="max-w-2xl">
    <p className="text-xl text-gray-700 leading-relaxed text-justify">
      Being a good Pro is more than just saying it, it&apos;s about proving it. 
      Before you hire your next Pro, take a look at their 
      <span className="font-bold text-black"> Pro</span>
      <span className="font-bold text-red-500">File™</span> 
      and see their credentials for yourself.
    </p>
  </div>
</div>

     

    </section>
  );
}

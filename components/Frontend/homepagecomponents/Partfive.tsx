import React from 'react';
import Image from 'next/image';
import Link from "next/link";

export function Partfive() {
  return (
    <section className="relative bg-white overflow-hidden py-16 px-4 sm:px-6">
      {/* Heading */}
      <h1 className="text-center text-2xl sm:text-3xl font-medium">
        Verified <span className="text-red-500">Network</span>
      </h1>

      {/* Verified Network Section */}
      <div className="mt-8 mx-auto w-full max-w-[650px] flex flex-col items-center gap-6">
        <Image
          src="/images/17.png"
          alt="Professional reviewing credentials"
          width={350}
          height={150}
          className="object-contain w-full max-w-[350px]"
          priority
        />
        <p className="text-center text-base sm:text-xl text-gray-600 leading-relaxed" >
          Start your next Pro search with the transparent nationwide network of{' '}
          <span className="text-[#010a14]">verified and trusted </span>
          <span className="font-medium text-black">Pro</span>
          <span className="font-medium text-red-500">fer </span>
          <span className="font-medium text-black">Pros</span>.
         
          By letting each Pro show what sets them apart, you can view everything that makes a Pro a Pro, all in one spot.
          Don't hire a contractor who isn't verified in their profession.
        </p>
      </div>

      {/* CTA Link */}
      <Link
        href="/learn-more"
        className="mt-8 block text-center text-lg sm:text-xl font-semibold"
        style={{ color: "#29afb6" }}
      >
        <span className="mr-2">&#8594;</span> Search for Pros
      </Link>

      {/* Spacer */}
      <div className="my-24 sm:my-40" />

      {/* Why Profer Section */}
      <h1 className="text-center text-2xl sm:text-3xl font-bold">Why Profer</h1>
      <div className="mt-8 mx-auto w-full max-w-[650px] flex flex-col items-center gap-6">
        <Image
          src="/images/18.png"
          alt="Why Profer"
          width={400}
          height={200}
          className="object-contain w-full max-w-[400px]"
          priority
        />
        <p className="text-center text-base sm:text-xl text-gray-600 leading-relaxed" >
        <span style={{color:'black'}} >Your property matters.</span> 
           Don't take chances with unverified Pros.
            With the  <span className='font-medium' style={{color:'black'}} >Pro</span><span className='font-medium' style={{color:'red'}} >File</span>™, it's clear to see which Pros stand out and which Pros fall short. 
            Plus, with the<span className='font-medium' style={{color:'black'}} > Project</span><span className='font-medium' style={{color:'red'}} > Auction</span>™, choosing the right Pro for your next project has never been easier.
        </p>
      </div>

      {/* Final CTA */}
      <Link
        href="/learn-more"
        className="mt-8 block text-center text-lg sm:text-xl font-semibold"
        style={{ color: "#29afb6" }}
      >
        <span className="mr-2">&#8594;</span> Learn more
      </Link>
    </section>
  );
}

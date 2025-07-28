'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Partfour() {
  return (
    <section className="relative bg-[rgb(6,13,39)] overflow-hidden py-16 px-4 sm:px-6">
      {/* Heading */}
      <h1 className="text-center text-2xl sm:text-3xl font-bold">
        <span className="text-white">Project</span>
        <span className="text-red-500"> Auction</span>
        <span className="text-white">™</span>
      </h1>

      {/* Paragraph */}
      <div className="mt-4 max-w-2xl mx-auto">
        <p className="text-lg sm:text-xl text-white leading-relaxed text-justify">
          Shopping and comparing bids for your projects has never been easier.
          As a <span className="font-semibold">Class A general contractor</span>, we ensure your project details are accurate.
          With our <span className="font-bold">Job</span><span className="font-bold text-red-500">File</span>™, you confidently compare bids from Pros with the exact same scope.
          Get the best value with our verified and trusted network.
        </p>
      </div>

      {/* Images container */}
      <div className="mt-8 w-full flex justify-center">
        <div className="bg-white w-full max-w-[700px] px-4 py-6 rounded-lg shadow">
          <div className="flex flex-col items-center gap-6">
            <Image
              src="/images/15.jpg"
              alt="Professional reviewing credentials"
              width={650}
              height={350}
              className="object-contain w-full rounded-md shadow-lg"
              priority
            />
            <Image
              src="/images/16.jpg"
              alt="Professional reviewing credentials"
              width={650}
              height={350}
              className="object-contain w-full rounded-md shadow-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Subheading link */}
      <Link
        href="/learn-more"
        className="mt-8 block text-center text-lg sm:text-xl font-semibold text-[#29afb6]"
      >
        <span className="mr-2">&#8594;</span> Start a Project Auction™
      </Link>
    </section>
  );
}

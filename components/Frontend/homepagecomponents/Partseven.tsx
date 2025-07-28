import React from 'react';
import Image from 'next/image';
import Link from "next/link";

export function Partseven() {
  return (
    <section className="relative bg-white overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl text-center text-black font-semibold">
        Are you a Pro?
      </h1>

      <div className="mt-8 mx-auto max-w-2xl flex flex-col items-center text-center sm:text-left">
        <Image
          src="/images/comapny-profile.png"
          alt="Professional reviewing credentials"
          width={300}
          height={200}
          className="object-contain w-full max-w-xs sm:max-w-sm"
          priority
        />

        <div className="my-6" />
        <p className="text-center text-base sm:text-xl text-gray-600 leading-relaxed" >
          Join our verified network and{" "}
          <span className="text-red-500 font-medium">get exclusive free leads</span>. Plus, you get
          invitations to bid in real-time on job opportunities at the{" "}
          <span className="text-black font-semibold">Project</span>{" "}
          <span className="text-red-500 font-semibold">Auction</span>™. Stay on top of your game
          and look more credible with your verified{" "}
          <span className="text-red-500 font-semibold">Pro</span>
          <span className="font-semibold">File</span>™.
        </p>

        <Link
          href="/learn-more"
          className="mt-8 text-xl font-semibold text-[#29afb6] hover:underline"
        >
          <span className="mr-2">&#8594;</span> Learn more
        </Link>
      </div>
    </section>
  );
}

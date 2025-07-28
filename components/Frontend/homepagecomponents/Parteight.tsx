import React from 'react';
import Image from 'next/image';

export function Parteight() {
  return (
    <section className="relative bg-[rgb(184,227,242)] overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-8 mx-auto max-w-xl w-full flex flex-col items-center text-center">
        <Image
          src="/images/9.png"
          alt="Professional reviewing credentials"
          width={300}
          height={200}
          className="object-contain w-full max-w-xs sm:max-w-sm"
          priority
        />

        <h1 className="text-2xl sm:text-3xl font-semibold mt-6 text-black">
          What are you waiting for?
        </h1>

        <button
          type="button"
          className="mt-6 rounded-full bg-red-500 w-full max-w-xs px-6 py-3 text-white text-lg sm:text-2xl font-medium shadow-md transition-colors hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          Join for free today
        </button>
      </div>
    </section>
  );
}

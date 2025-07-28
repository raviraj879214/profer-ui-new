import React from 'react';
import Image from 'next/image';
import Link from "next/link";

export function Partsix() {
  return (
    <section className="relative bg-[rgb(184,227,242)] overflow-hidden py-16 px-4">
      <h1 className="text-3xl text-center text-[rgb(82,82,82)] font-semibold">
        Share a Pro and Earn
      </h1>

      <div className="mt-8 mx-auto max-w-[650px] w-full flex flex-col items-center">
        <Image
          src="/images/19.png"
          alt="Professional reviewing credentials"
          width={250}
          height={150}
          className="object-contain"
          priority
        />

        <div className="my-5" />

        <p className="text-center text-base sm:text-xl text-gray-600 leading-relaxed" >
          Earn points by referring Pros to your family and friends.
          <span className="font-medium text-black"> Pro</span>
          <span className="font-medium text-red-500">fer</span>
          <span className="font-medium text-black"> Points</span> equal real dollars that get paid to the Pro of your choice in a
          <span className="font-medium text-black"> Project</span>
          <span className="font-medium text-red-500"> Auction</span>™.
          You already share Pros, now start earning rewards when you do.
        </p>
      </div>

      <Link
        href="/learn-more"
        className="mt-8 block text-center text-xl font-semibold"
        style={{ color: "#29afb6" }}
      >
        <span className="mr-2">&#8594;</span> How it works
      </Link>
    </section>
  );
}

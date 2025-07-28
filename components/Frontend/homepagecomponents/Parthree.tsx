import React from 'react';
import Image from 'next/image';
import Link from "next/link";

export function Parthree() {
  return (
    <section
      style={{
        position: 'relative',
        backgroundColor: 'white',
        overflow: 'hidden',
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 0,
          lineHeight: 0,
        }}
      >
        <Image
          src="/images/10.jpg"
          alt="Professional reviewing credentials"
          width={700}
          height={450}
          style={{
            display: 'block',
            margin: 0,
            padding: 0,
            lineHeight: 0,
            objectFit: 'contain',
          }}
          priority
        />

        <Image
          src="/images/11.png"
          alt="Professional reviewing credentials"
          width={650}
          height={400}
          style={{
            display: 'block',
            margin: 0,
            padding: 0,
            lineHeight: 0,
            objectFit: 'contain',
          }}
          priority
        />

        <Image
          src="/images/12.png"
          alt="Professional reviewing credentials"
          width={650}
          height={400}
          style={{
            display: 'block',
            margin: 0,
            padding: 0,
            lineHeight: 0,
            objectFit: 'contain',
          }}
          priority
        />

        <Image
          src="/images/13.png"
          alt="Professional reviewing credentials"
          width={650}
          height={400}
          style={{
            display: 'block',
            margin: 0,
            padding: 0,
            lineHeight: 0,
            objectFit: 'contain',
          }}
          priority
        />
        <Link
  href="/learn-more"
  className="mt-8 block text-center text-xl font-semibold"
  style={{ color: "#29afb6" }}
>
  <span className="mr-2">&#8594;</span> Verify a Pro
</Link>
      </div>
      <div className="my-30"></div>
    </section>
  );
}

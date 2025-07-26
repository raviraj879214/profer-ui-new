"use client";



export function Whyprofer() {
  return (
    <>
     

      <main className="font-sans text-gray-900">
        <HeroSection />
        <ProVerifySection />
        <VerificationChecks />
        <ProfileSection />
        <ProjectAuctionSection />
        <PrivacySection />
        <CTASection />
        <FooterNav />
       
      </main>
    </>
  );
}

function HeroSection() {
  return (
    <section className="w-full min-h-[85vh] flex items-center justify-center px-6 py-20 bg-white">
      <div className="flex w-full max-w-7xl overflow-hidden rounded-lg shadow-md">
        {/* Left decorative area */}
        <div className="relative hidden md:flex flex-1 items-center justify-center bg-transparent">
          <div className="absolute inset-0 bg-[#d2edf1] rounded-br-[300px]"></div>
          <h1 className="relative z-10 text-5xl font-bold text-black max-w-xs leading-snug px-10">
            The only <br /> way to Pro
          </h1>
        </div>

        {/* Right content */}
        <div className="flex flex-col flex-1 bg-white px-10 py-16 justify-center">
          <hr className="border-2 border-red-500 w-20 mb-6" />
          <p className="text-lg font-medium text-gray-800 mb-4">
            When it comes to your property, you should use the best.
          </p>
          <p className="text-gray-500 mb-8 max-w-md">
            The Profer Network is built of fully vetted professionals you can rely on. But don’t just take our word for it. See for yourself.
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-7 rounded-full transition duration-300 max-w-max">
            Get started
          </button>
        </div>
      </div>
    </section>
  );
}

function ProVerifySection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 mt-24 flex flex-col md:flex-row items-center justify-between gap-10">
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold text-gray-800">
          Pro<span className="text-red-500">Verify</span>™
        </h2>
        <p className="mt-4 text-gray-600">
          Our <strong>Pro<span className="text-red-500">Verify</span>™</strong> process exceeds that of other pro networks. <span className="font-semibold">We go the extra mile</span>, even tracking local-level registrations and license renewals.
        </p>
      </div>
      <div className="md:w-1/2 flex justify-center">
        <img
          src="https://static.wixstatic.com/media/8de7f9_acbb695fd7e94f47b58c7ef118d8f3a6~mv2.png/v1/crop/x_162,y_0,w_3259,h_1862/fill/w_666,h_374,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8de7f9_acbb695fd7e94f47b58c7ef118d8f3a6~mv2.png"
          alt="Verification"
          className="max-w-sm"
        />
      </div>
    </section>
  );
}

function VerificationChecks() {
  const checks = [
    {
      title: "Identification",
      description:
        "Every pro must present a driver’s license so we can verify they are who they say they are.",
    },
    {
      title: "Criminal Background",
      description:
        "We check federal and state databases. Criminal offenses are a no-go.",
    },
    {
      title: "Business Background",
      description:
        "We verify they are a registered business in good standing with state regulations.",
    },
    {
      title: "License and Credentials Verification",
      description:
        "We verify all required licenses, even at the local level.",
    },
  ];

  return (
    <section className="mt-24 bg-gray-900 text-gray-100 rounded-t-3xl rounded-b-[5rem] px-6 md:px-10 py-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-5xl mx-auto">
        {checks.map((check, i) => (
          <CheckItem key={i} {...check} />
        ))}
      </div>
    </section>
  );
}

function CheckItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex space-x-4">
      <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <div>
        <h4 className="font-semibold text-lg">{title} Check</h4>
        <p className="text-sm text-gray-300 mt-1 max-w-xs">{description}</p>
      </div>
    </div>
  );
}


function ProfileSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 mt-24 flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-r from-sky-50 to-white rounded-3xl py-14">
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold text-gray-800">
          Pro<span className="text-red-500">File</span>™
        </h2>
        <p className="mt-4 text-gray-600 max-w-lg">
          Other services claim background checks but don’t show proof. Our ProFile™ shows everything you need before hiring a Pro.
        </p>
      </div>
      <div className="md:w-1/2 flex justify-center">
        <img
          src="https://static.wixstatic.com/media/8de7f9_a475934549414d12803e989f5c350563~mv2.png/v1/fill/w_717,h_432,al_c,lg_1,q_85,enc_avif,quality_auto/8de7f9_a475934549414d12803e989f5c350563~mv2.png"
          alt="ProFile UI"
          className="max-w-full rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}

function ProjectAuctionSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 mt-24 flex flex-col-reverse md:flex-row items-center justify-between gap-10 bg-gradient-to-r from-white to-sky-50 rounded-3xl py-14">
      <div className="md:w-1/2 flex justify-center">
        <img
          src="https://static.wixstatic.com/media/8de7f9_d83cde33ca654a418df97e591e4ade9c~mv2.png/v1/fill/w_715,h_605,al_c,lg_1,q_90,enc_avif,quality_auto/8de7f9_d83cde33ca654a418df97e591e4ade9c~mv2.png"
          alt="Project Auction UI"
          className="max-w-full rounded-lg shadow-lg"
        />
      </div>
      <div className="md:w-1/2 text-gray-800">
        <h2 className="text-3xl font-bold">
          Project <span className="text-red-500">Auction</span>™
        </h2>
        <p className="mt-4 text-gray-600 max-w-lg">
          Want the best Pro at the best value? Get trusted bids with Project Auction™. Every Pro is verified and qualified. <span className="font-semibold">When the Pros compete, you win.</span>
        </p>
      </div>
    </section>
  );
}

function PrivacySection() {
  return (
    <section className="max-w-3xl mx-auto px-6 text-center mt-28">
      <h3 className="text-2xl font-semibold mb-4">We care about your privacy</h3>
      <div className="flex justify-center mb-4">
        <img
          src="https://static.wixstatic.com/media/8de7f9_401b0cb567e141a394e247e080138625~mv2.png/v1/fill/w_158,h_146,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8de7f9_401b0cb567e141a394e247e080138625~mv2.png"
          alt="Privacy icon"
          className="w-16 h-16"
        />
      </div>
      <p className="text-gray-500 max-w-md mx-auto">
        Your account is secure. We only use your info to match you with trusted Pros and improve your experience.
      </p>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-sky-200 mt-24 py-20 text-center rounded-t-3xl rounded-b-3xl">
      <h3 className="text-2xl font-semibold mb-6">What are you waiting for?</h3>
      <div className="mx-auto max-w-xs flex flex-col items-center gap-6">
        <img
          src="https://static.wixstatic.com/media/09611d_0afb18e40a43475e88baa1586bf90381~mv2.png/v1/fill/w_588,h_440,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/sign%20up%20lady.png"
          alt="Join Profer"
          className="w-28 h-28"
        />
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-full">
          Join for free today
        </button>
      </div>
    </section>
  );
}

function FooterNav() {
  return (
    <nav className="mt-12 text-center text-sm text-gray-600 mb-12">
      Are you a home service pro?{" "}
      <a href="#" className="text-sky-600 hover:underline font-medium">
        Learn what Profer can do for you.
      </a>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 py-10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        <a href="#" className="flex items-center space-x-1">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-900 via-indigo-600 to-indigo-900 rounded-sm flex items-center justify-center text-white font-bold text-xl">
            P
          </div>
          <span className="font-bold text-lg">
            Pro<span className="text-red-500">fer</span>
          </span>
        </a>
        <ul className="flex space-x-8 text-xs font-medium opacity-70">
          <li><a href="#" className="hover:underline">Terms</a></li>
          <li><a href="#" className="hover:underline">Privacy</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
        </ul>
      </div>
      <img
        src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2dc16d0d-ca04-4af2-a7b7-f506fad50e66.png"
        alt="Footer illustration"
        className="absolute right-4 bottom-0 w-36 h-36 opacity-60"
      />
    </footer>
  );
}

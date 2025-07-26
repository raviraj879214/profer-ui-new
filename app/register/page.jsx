"use client";
import Image from "next/image";
import signupimage from "../../public/images/signup.png"; // Corrected import
import Link from "next/link";

const Signup = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow relative">
        {/* Curved Top Background */}
        <div className="absolute top-0 w-full h-56 bg-[#D5F1F1] rounded-b-[80px]"></div>

        {/* Signup Card */}
        <div className="relative z-10 w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          {/* Illustration */}
          <div className="flex justify-center mb-4">
            <Image
              src={signupimage}
              alt="Signup Illustration"
              width={120}
              height={120}
              priority
            />
          </div>
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Sign Up
          </h2>
          <form>
            <input
              type="email"
              placeholder="Email"
              className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              required
            />
            <label className="flex items-center mb-4 text-gray-600 text-sm">
              <input type="checkbox" required className="mr-2" />
              I agree with the terms and conditions.
            </label>
            <button
              type="submit"
              className="w-full p-3 bg-[#0C0C2D] text-white rounded font-semibold hover:bg-[#1E1E3E]"
            >
              Submit
            </button>
          </form>
          <p className="mt-4 text-center text-[#18A2AC] font-medium">
            Are you a Pro?{" "}
            <Link href="/email-verify" className="underline">
              Sign up here
            </Link>
          </p>
        </div>
      </main>

    
    </div>
  );
};

export default Signup;

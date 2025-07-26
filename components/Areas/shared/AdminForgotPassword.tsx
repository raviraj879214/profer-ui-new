"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import signupimage from "../../../public/images/signup.png";

export function AdminForgotPassword() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [message, setMessage] = useState("");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (message) {
      const fadeTimeout = setTimeout(() => setFade(true), 5000);
      const hideTimeout = setTimeout(() => {
        setMessage("");
        setFade(false);
      }, 6000);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [message]);

  const handleSubmitForm = async (data: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin-forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email }),
    });

    if (res.ok) {
      const result = await res.json();
      setMessage(result.message);
      reset();
    } else {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow relative">
        {/* Curved Top Background */}
        <div className="absolute top-0 w-full h-56 bg-[#D5F1F1] rounded-b-[80px]"></div>

        {/* Forgot Password Card */}
        <div className="relative z-10 w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          {/* Illustration */}
          <div className="flex justify-center mb-4">
            <Image
              src={signupimage}
              alt="Forgot Password Illustration"
              width={120}
              height={120}
              priority
            />
          </div>

          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Forgot Password
          </h2>

          {message && (
            <p className={`mb-4 text-center text-sm ${fade ? "opacity-0 transition-opacity duration-1000" : "text-green-600"}`}>
              {message}
            </p>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(handleSubmitForm)}>
            <input
              type="email"
              placeholder="Email address"
              className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}

            <button
              type="submit"
              className="w-full p-3 bg-[#0C0C2D] text-white rounded font-semibold hover:bg-[#1E1E3E]"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link href="/admin-login" className="text-sm text-[#18A2AC] hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminForgotPassword;

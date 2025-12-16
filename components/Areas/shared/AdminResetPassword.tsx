"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import signupimage from "../../../public/images/signup.png";
import { useRouter } from "next/navigation";

interface AdminResetPasswordFormProps {
  passwordresetlink: string;
}

export function AdminReset({ passwordresetlink }: AdminResetPasswordFormProps) {
  const [message, setMessage] = useState("");
  const [fade, setFade] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Token verification on mount
  useEffect(() => {
    const verifyToken = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/reset-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwordresetlink }),
      });

      const result = await res.json();

      if (res.ok && result.status === 200) {
        setTokenValid(true);
      } else {
        setMessage("Token expired or invalid. Please try again.");
      }
    };
    verifyToken();
  }, [passwordresetlink]);

  // Fade out success/error messages
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

  // Password reset submission
  const onSubmit = async (data: any) => {
    if (data.newpassword !== data.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: data.newpassword,
          passwordresetlink,
        }),
      });

      debugger;
      const result = await res.json();
      if (res.ok && result.status == 200) {
        setMessage("Password reset successful. You can now log in.");
        reset();
        router.push(result.urlredirect);

      } else {
        setMessage(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow relative">
        {/* Curved Top Background */}
        <div className="absolute top-0 w-full h-56 bg-[#D5F1F1] rounded-b-[80px]"></div>

        {/* Reset Password Card */}
        <div className="relative z-10 w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          {/* Illustration */}
          <div className="flex justify-center mb-4">
            <Image
              src={signupimage}
              alt="Reset Password Illustration"
              width={120}
              height={120}
              priority
            />
          </div>

          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Reset Password
          </h2>

          {message && (
            <p
              className={`mb-4 text-center text-sm ${
                fade ? "opacity-0 transition-opacity duration-1000" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          {tokenValid && (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="password"
                placeholder="New Password"
                className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                {...register("newpassword", { required: "New password is required" })}
              />
              {errors.newpassword && (
                <p className="text-red-500 text-sm">{errors.newpassword.message as string}</p>
              )}

              <input
                type="password"
                placeholder="Confirm Password"
                className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                {...register("confirmPassword", { required: "Please confirm your password" })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message as string}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 rounded font-semibold text-white ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0C0C2D] hover:bg-[#1E1E3E]"
                }`}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#18A2AC] hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

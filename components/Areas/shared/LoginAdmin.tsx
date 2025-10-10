"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import signupimage from "../../../public/images/signup.png";
import { Logo } from "./Logo";

export function LoginAdminFrontend() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();




  const onSubmit = async (data: any) => {

console.log('STRIPE_SECRET_KEY:', process.env.NEXT_PUBLIC_URL ? '✅ set' : '❌ undefined');

    
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Login failed");

      if (result.status === 200) {

        // localStorage.setItem("Role", JSON.stringify(result.user.role.name));
        // localStorage.setItem("token", result.token);
        // localStorage.setItem("LoginStatus", "true");
        // document.cookie = `role=${result.user.role.name}; path=/; max-age=${7 * 24 * 60 * 60}`;


        localStorage.setItem("AdminRole", JSON.stringify(result.user.role.name));
        localStorage.setItem("Admintoken", result.token);
        localStorage.setItem("AdminLoginStatus", "true");
        document.cookie = `Adminrole=${result.user.role.name}; path=/; max-age=${7 * 24 * 60 * 60}`;

         
         window.location.href = ("/admin/dashboard");
      } else {
        throw new Error(result.error || "Invalid credentials");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Logo Section */}
      {/* <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Logo />
        </Link>
      </div> */}

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow relative">
        {/* Curved Top Background */}
        <div className="absolute top-0 w-full h-56 bg-[#D5F1F1] rounded-b-[80px]"></div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          {/* Illustration */}
          <div className="flex justify-center mb-4">
            <Image
              src={signupimage}
              alt="Admin Login Illustration"
              width={120}
              height={120}
              priority
            />
          </div>

          <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Admin Login
          </h1>

          {errorMsg && <p className="mb-4 text-center text-red-600">{errorMsg}</p>}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              placeholder="Email"
              className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message as string}</p>}

            <input
              type="password"
              placeholder="Password"
              className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message as string}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-[#0C0C2D] text-white rounded font-semibold hover:bg-[#1E1E3E] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Forgot password */}
          <div className="flex justify-end mt-3">
            <Link href="/admin-forgot-password" className="text-sm text-[#18A2AC] hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginAdminFrontend;

"use client";
import Image from "next/image";
import signupimage from "../../../public/images/signup.png";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";



const SignIn = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  
  const onSubmit = async (data) => {
  setLoading(true);
  setErrorMsg(""); // clear previous errors

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/pro-login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailaddress: data.emailaddress,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(result.error || "Login failed. Please try again.");
    }

    if (result.status === 200) {
      // Save login details
      localStorage.setItem("FrontendRole", JSON.stringify(result.user.role));
      localStorage.setItem("Frontendtoken", result.token);
      localStorage.setItem("FrontendLoginStatus", "true");
      localStorage.setItem("token",result.token);
      localStorage.setItem("UserID",result.user.id);
      console.log("Login successful", result);
     
      if(result.user.role == "Pro"){
        
          if(result.user.status == "0"){
            router.push('/pro/step-1');
          }
          else if(result.user.status == "1"){
              router.push('/pro/step-2');
          }
          else if(result.user.status == "2"){
              router.push('/pro/step-3');
          }

      }
      else{
         window.location.href = "/admin/dashboard";
      }



    } else {
      throw new Error(result.error || "Invalid credentials");
    }
  } catch (err) {
    console.log("Login error:", err);
    setErrorMsg(err.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
    reset();
  }
};






  

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
            Sign In
          </h2>
          {errorMsg && (
            <p className="mb-4 text-center text-red-600">{errorMsg}</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              placeholder="Email"
              className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              {...register("emailaddress", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
              })}
            />
            {errors.emailaddress && (
              <p className="text-red-500 text-sm mb-2">{errors.emailaddress.message}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
            )}

            <button
              type="submit"
              className="w-full p-3 bg-[#0C0C2D] text-white rounded font-semibold hover:bg-[#1E1E3E] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="mt-4 text-center text-[#18A2AC] font-medium">
            Create new account?{" "}
            <Link href="/email-verify" className="underline">
              Sign up here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignIn;

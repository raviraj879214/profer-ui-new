"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import signupimage from "../../../public/images/contact-us.png";
// import { Logo } from "./Logo";

export function ContactUs() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setLoading(true); 
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/contactus`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ContactName: data.ContactName,
    ContactEmail: data.ContactEmail,
    ContactPhone: data.ContactPhone,
    ContactSubject: data.ContactSubject,
    ContactMsg: data.ContactMsg,
  }),
});

const contentType = response.headers.get("content-type");

if (!contentType || !contentType.includes("application/json")) {
  const text = await response.text();
  console.error("Expected JSON but got:", text); // This will likely show the HTML error page
  throw new Error("Unexpected response format");
}

const result = await response.json();
 if (response.ok && result.status === 200) {
      setSuccessMsg(result.message || "Form submitted successfully!");
    } else {
      throw new Error(result.error || "Failed to submit");
    }
    setTimeout(() => {
    setSuccessMsg(null);
    }, 5000); 
      
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white mt-20">
      {/* Top Logo Section */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          {/* <Logo /> */}
        </Link>
      </div>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow relative">
        {/* Curved Top Background */}
        <div className="absolute top-0 w-full h-56 bg-[#D5F1F1] rounded-b-[80px]"></div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg">
          {/* Illustration */}
          <div className="flex justify-center mb-4">
            <Image
              src={signupimage}
              alt="ContactUs Illustration"
              width={100}
              height={100}
              priority
            />
          </div>

          <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
           Contact Us
          </h1>
          {successMsg && <p className="mb-4 text-center text-green-600">{successMsg}</p>}
          {errorMsg && <p className="mb-4 text-center text-red-600">{errorMsg}</p>}

          {/* Form */}
         
          <form onSubmit={handleSubmit(onSubmit)}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <input
              type="text"
              placeholder="Name"
              className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              {...register("ContactName", {
                required: "Name is required"
              })}
            />
            {errors.ContactName && <p className="relative text-red-500 text-sm -top-3 mb-1">{errors.ContactName.message as string}</p>}
         </div>

          <div>
           <input
              type="email"
              placeholder="Email"
              className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              {...register("ContactEmail", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
              })}
            />
            {errors.ContactEmail && <p className="relative text-red-500 text-sm -top-3 mb-1">{errors.ContactEmail.message as string}</p>}
          </div>

          <div>
          <input
               type="text"
               placeholder="Phone"
               className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
               {...register("ContactPhone", {
                required: "Phone number is required",
                pattern: {
             value: /^(\+?\d{1,3}[- ]?)?\d{10}$/,
             message: "Invalid phone number"
               }
           })}
          />
            {errors.ContactPhone && <p className="relative text-red-500 text-sm -top-3 mb-1">{errors.ContactPhone.message as string}</p>}
       </div>

           <div>
            <input
              type="text"
              placeholder="Subject"
              className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              {...register("ContactSubject", {
                required: "Subject is required"
              })}
            />
            {errors.ContactSubject && <p className="relative text-red-500 text-sm -top-3 mb-1">{errors.ContactSubject.message as string}</p>}
          </div>
          </div>

          <div className="mt-4">
            <textarea
             placeholder="Message"
             className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
             {...register("ContactMsg", {
             required: "Message is required"
             })}
                />
          
            {errors.ContactMsg && <p className="relative text-red-500 text-sm -top-3 mb-1">{errors.ContactMsg.message as string}</p>}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-[#0C0C2D] text-white rounded font-semibold hover:bg-[#1E1E3E] disabled:opacity-50"
            >
              {loading ? "Loading..." : "ContactUs"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ContactUs;

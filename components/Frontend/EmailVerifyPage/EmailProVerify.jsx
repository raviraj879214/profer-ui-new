"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from "next/image";
import signupImage from "../../../public/images/signup.png";

export function EmailProVerify() {
  const { register, handleSubmit, formState: { errors }, getValues, setError } = useForm();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState(false);
  const [otpSize, setOtpSize] = useState(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const inputsRef = useRef([]);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    await sendOtpEmail(data.email);
    setLoading(false);
  };

  const sendOtpEmail = async (email) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-user-and-send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailaddress: email, status: "0" }),
      });

      const result = await res.json();
      if (res.ok && result.status === 200) {
        setOtp(result.otp);
        localStorage.setItem("tempemailuser", result.email);
        setMessage("OTP sent to your email address. Please check your inbox.");
        setStage(true);
        setOtpSize(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      } else if (result.status === 400) {
        setMessage("Email already exists. Please try another.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Error sending OTP. Please try again later.");
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpSize];
    newOtp[index] = value;
    setOtpSize(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.join("").length === 6) {
      handleSubmitOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpSize[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const pasteArray = pasteData.split("");
      setOtpSize(pasteArray);
      handleSubmitOtp(pasteData);
    }
    e.preventDefault();
  };

  const handleSubmitOtp = (manualOtp) => {
    const enteredOtp = manualOtp || otpSize.join("");
    setVerifying(true);

    setTimeout(() => {
      if (enteredOtp === otp) {
        router.push("/payment-page");
      } else {
        setMessage("Invalid OTP. Please try again.");
        setVerifying(false);
      }
    }, 1200); // 1.2 sec for feedback animation
  };

  const handleResend = async () => {
    const email = getValues("email");
    if (!email) {
      setError("email", { type: "manual", message: "Please enter your email address to resend OTP." });
      return;
    }
    await sendOtpEmail(email);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#D5F1F1] to-white px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Illustration */}
        <div className="flex justify-center mb-4">
          <Image src={signupImage} alt="Email Verification" width={100} height={100} priority />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
          Email Verification
        </h1>
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:outline-none text-sm sm:text-base"
              {...register("email", {
                required: "Email address is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
              })}
              disabled={stage}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* OTP Section */}
          {stage && (
            <div className="space-y-6">
              <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
                {otpSize.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    ref={(el) => (inputsRef.current[index] = el)}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#6C63FF] transition"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleResend}
                className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                disabled={verifying}
              >
                <ArrowPathIcon className={`w-4 h-4 ${verifying ? "animate-spin" : ""}`} />
                Resend OTP
              </button>
              <button
                type="button"
                onClick={() => handleSubmitOtp()}
                className="w-full bg-[#0C0C2D] text-white py-2 px-4 rounded-lg hover:bg-[#1E1E3E] transition flex items-center justify-center gap-2"
                disabled={verifying}
              >
                {verifying && <ArrowPathIcon className="w-5 h-5 animate-spin" />}
                {verifying ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </div>
          )}

          {/* Terms & Conditions */}
  <div className="flex items-start space-x-2 text-sm text-gray-600">
    <input
      type="checkbox"
      id="terms"
      {...register("terms", { required: "You must agree to continue" })}
      className="mt-1"
    />
    <label htmlFor="terms" className="leading-5">
      I agree to the{" "}
      <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
        Terms & Conditions
      </a>{" "}
      
      
    </label>
  </div>
  {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}
          {/* Initial Verify Button */}
          {!stage && (
            <button
              type="submit"
              className="w-full bg-[#0C0C2D] hover:bg-[#1E1E3E] text-white font-medium py-2 px-4 rounded-lg transition"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Verify Email"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

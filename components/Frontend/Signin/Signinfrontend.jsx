"use client";

import Image from "next/image";
import signupimage from "../../../public/images/signup.png";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import { loadStripe } from "@stripe/stripe-js";
import { getStripeActivePlan } from "../../../lib/stripeactiveplan/store";
import {TermsConditionModal} from "../../../components/Frontend/Signin/TermsConditionModal";
const SignIn = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userId, setUserId] = useState(null); // ✅ inside component
  const [modalUserId, setModalUserId] = useState(null);
  const [price, setPrice] = useState(null);  


  const [isOpenterms, setIsOpenterms] = useState(false);
  const [termuserid,settermuserid] = useState(0);

  const router = useRouter();

  // Load UserID on mount
  useEffect(() => {
    const storedId = localStorage.getItem("UserID");
    if (storedId) setUserId(Number(storedId));
  }, []);

  // Optional: update userId whenever modal opens
  useEffect(() => {
    if (modalOpen) {
      const storedId = localStorage.getItem("UserID");
      if (storedId) setUserId(Number(storedId));
    }
  }, [modalOpen]);

  useEffect(() => {
        async function fetchPrice() {
          try {
            const res = await fetch("/api/stripe-price"); // works in localhost and production
            const data = await res.json();
            setPrice(data);
          } catch (error) {
            console.error("Error fetching price:", error);
          }
        }
        fetchPrice();
      }, []);

  // Redirect if already logged in
  useEffect(() => {
    const loginStatus = localStorage.getItem("FrontendLoginStatus");
    if (loginStatus === "true") {
      router.push("/pro/pro-dashboard");
    }
  }, []);

  // Login function
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/pro-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailaddress: data.emailaddress,
            password: data.password,
          }),
        }
      );

      const result = await response.json();

      const id = result.user?.id;
        if (id) {
          localStorage.setItem("UserID", id);
          localStorage.setItem("FrontendEmail", result.user.email || "");
          setUserId(Number(id));
        }

        if (response.status === 403) {
          setModalMessage(result.error || "Subscription required");

          // Make sure the backend returns a proper `user.id`
          if (result.user?.id) {
            setModalUserId(Number(result.user.id));
          } else {
            console.error("No user id returned in result");
          }

          setModalOpen(true);
          return;
        }
        else if(response.status === 409){
          setIsOpenterms(true);
          setModalUserId(Number(result.user.id));
        }

        



      if (!response.ok) throw new Error(result.error || "Login failed");

      if (result.status === 200 && result.user) {
        localStorage.setItem("FrontendRole", JSON.stringify(result.user.role));
        localStorage.setItem("Frontendtoken", result.token || "");
        localStorage.setItem("FrontendLoginStatus", "true");
        
        localStorage.setItem("token", result.token || "");

        document.cookie = `role=${result.user.role}; path=/; max-age=${
          7 * 24 * 60 * 60
        }`;

        // Redirect based on role and status
        if (result.user.role === "Pro") {
          switch (result.user.status) {
             case "-1":
              window.location.href = "/pro/step-1";
              break;
            case "0":
              window.location.href = "/pro/step-1";
              break;
            case "1":
              window.location.href = "/pro/step-2";
              break;
            case "2":
              window.location.href = "/pro/step-3";
              break;
            case "4":
              window.location.href = "/pro/pro-dashboard";
              break;
            default:
              window.location.href = "/";
          }
        } else {
          window.location.href = "/admin/dashboard";
        }
      } else {
        throw new Error(result.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      reset();
    }
  };

  // Renew subscription
const handleRenewSubscription = async () => {
  try {
    const userId = modalUserId; // coming from your modal state
    if (!userId) {
      alert("User ID not found");
      return;
    }
    //from stripe
    const paymentid = await getStripeActivePlan();
    const res = await fetch("/api/stripe/renew-stripe-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId, 
        priceId: paymentid
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // redirect to Stripe Checkout
    }
  } catch (error) {
    console.error("Checkout error:", error.message);
  }
};


  return (
    <>
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex flex-col items-center justify-center flex-grow relative">
          <div className="absolute top-0 w-full h-56 bg-[#D5F1F1] rounded-b-[80px]"></div>

          <div className="relative z-10 w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
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
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.emailaddress && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.emailaddress.message}
                </p>
              )}

              <input
                type="password"
                placeholder="Password"
                className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.password.message}
                </p>
              )}

              <button
                type="submit"
                className="w-full p-3 bg-[#0C0C2D] text-white rounded font-semibold hover:bg-[#1E1E3E] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="flex justify-end mt-3">
              <Link
                href="/forgot-password"
                className="text-sm text-[#18A2AC] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <p className="mt-4 text-center text-[#18A2AC] font-medium">
              Create new account?{" "}
              <Link href="/email-verify" className="underline">
                Sign up here
              </Link>
            </p>
          </div>
        </main>
      </div>

      {/* Modal */}
            <Modal
  isOpen={modalOpen}
  onRequestClose={() => setModalOpen(false)}
  contentLabel="Subscription Error"
  ariaHideApp={false}
  className="relative bg-white p-8 rounded-lg max-w-md mx-auto shadow-lg z-50 max-h-[90vh] overflow-auto"
  overlayClassName="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
>
  {/* Close Icon */}
  <button
    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
    onClick={() => setModalOpen(false)}
  >
    &times;
  </button>

  <div className="flex flex-col space-y-6 text-center">
    {/* Title */}
    <h2 className="text-2xl font-semibold text-gray-900">
      Renew Your Subscription
    </h2>

    {/* Message */}
    <p className="text-gray-700 text-lg">
      Thank you for being a valued member of <span className="font-semibold">Profer</span>.
      To continue enjoying uninterrupted access to all premium features and benefits, please renew your subscription.
    </p>

    {/* Price Block - Stripe Style */}
    <div className="bg-gray-50 rounded-xl p-6 shadow-sm border">
      <p className="text-5xl font-extrabold text-gray-900 tracking-tight">
        $ {price ? price.amount : "..."} 
        <span className="text-lg font-medium text-gray-600">/year</span>
      </p>
      
    </div>

    {/* Duration Info */}
    <p className="text-gray-800 text-base">
      If you subscribe now, your subscription will be valid from{" "}
      <span className="font-semibold">{new Date().toLocaleDateString()}</span> until{" "}
      <span className="font-semibold">
        {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}
      </span>.
    </p>

    {/* Renew Button */}
    {modalUserId && (
      <div className="mt-4">
        <button
          className="bg-[#0C0C2D] hover:bg-[#1E1E3E] text-white w-full py-4 rounded-lg transition text-xl font-semibold shadow-md"
          onClick={() => handleRenewSubscription(modalUserId)}
        >
          Renew Subscription
        </button>
      </div>
    )}
  </div>
</Modal>

<div className="flex justify-center items-center min-h-screen  ">
      {/* Button to open modal */}
      <button
        onClick={() => setIsOpenterms(true)}
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
        focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
        dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Toggle Modal
      </button>

      {/* Modal */}
     <TermsConditionModal
        isOpen={isOpenterms}
        onClose={() => setIsOpenterms(false)}
        
        userid = {modalUserId}
      />
      
    </div>
    </>
  );
};

export default SignIn;

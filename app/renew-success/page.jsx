"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function RenewSuccess() {
  const [message, setMessage] = useState("Updating subscription...");
  const router = useRouter();

  useEffect(() => {
    const confirmSubscription = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id"); // ✅ comes from Stripe redirect
      const userId = localStorage.getItem("UserID");

      if (!sessionId || !userId) {
        setMessage("Missing payment details.");
        return;
      }

      try {
        // 1️⃣ Fetch full Stripe session details from backend
        const sessionRes = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/stripe/get-session?session_id=${sessionId}`
        );
        const sessionData = await sessionRes.json();

        if (!sessionData || !sessionData.subscription) {
          setMessage("⚠️ Invalid Stripe session.");
          return;
        }

        // 2️⃣ Call backend to create subscription in DB
       const res = await fetch(
  `${process.env.NEXT_PUBLIC_URL}/api/create-subscription`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      sessionId: sessionData.id, // Checkout Session ID
      planName: sessionData.plan?.name || "P",
      planType: sessionData.plan?.type || "Y",
      amount: sessionData.amount_total / 100,
      currency: sessionData.currency || "U",
     // optional: keep Stripe Price ID
    }),
  }
);

        const data = await res.json();

        if (res.ok && data.status === "exists") {
          setMessage(
            " Payment already confirmed! Thank you for renewing your subscription."
          );
        } else if (res.ok && data.status === "created") {
          setMessage(
            " Payment successful! Thank you for renewing your subscription — we’re excited to have you with us for another year of premium benefits!"
          );
        } else {
          setMessage("⚠️ Payment succeeded but DB update failed.");
        }
      } catch (err) {
        console.error(err);
        setMessage(" Error updating subscription.");
      }
    };

    confirmSubscription();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6">
          <CheckCircleIcon className="w-20 h-20 text-[#21afbc] animate-bounce" />
        <h2 className="mt-6 text-3xl font-bold text-[#21afbc]">
          Payment Successful
        </h2>

        <p className="mt-4 text-[#21afbc] text-lg max-w-md">
         
          {message}
        </p>

        <button
          onClick={() => router.push('/sign-in')}
          className="mt-8 bg-gray-900 shadow-lg text-white py-3 px-10 rounded-full text-base font-semibold  transition transform "
        >
          Log In to Continue
        </button>

        {/* Extra touch: link back to home */}
        <p
          onClick={() => router.push('/')}
          className="mt-4 text-sm text-gray-500 hover:underline cursor-pointer"
        >
          Go back to Home
        </p>
      </main>
    </div>
  );
}

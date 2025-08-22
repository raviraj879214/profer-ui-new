"use client";
import { useEffect, useState } from "react";

export default function RenewSuccess() {
  const [message, setMessage] = useState("Updating subscription...");

  useEffect(() => {
    const confirmSubscription = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");
      const userId = localStorage.getItem("UserID");

      if (!sessionId || !userId) {
        setMessage("Missing payment details.");
        return;
      }

      try {
        // 1️⃣ Fetch session details from your backend
        const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/stripe/get-session?session_id=${sessionId}`);
        const sessionData = await sessionRes.json();

        if (!sessionData || !sessionData.subscription) {
          setMessage("⚠️ Invalid Stripe session.");
          return;
        }

        // 2️⃣ Call backend to create subscription
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-subscription`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId,
    stripeSubscriptionId: sessionData.id,
    planName: sessionData.line_items?.[0]?.description || "Pro Plan",
    planType: "Yearly",
    amount: sessionData.amount_total / 100,
    currency: sessionData.currency.toUpperCase(),
  }),
});


        if (res.ok) {
  setMessage(
  " Payment successful!|Thank you for renewing your subscription — we’re excited to have you with us for another year of premium benefits!"
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
    <>
<div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
  <div className="bg-white p-12 rounded-2xl shadow-xl w-full max-w-md text-center flex flex-col justify-center space-y-8 border border-gray-200">
  <h1 className="text-3xl font-bold text-gray-800 whitespace-pre-line text-justify">
 {message && (
  <div>
    <h1 className="text-3xl font-bold text-green-600 text-center mb-4">
      {message.split("|")[0]}
    </h1>
    <p className="text-xl text-gray-800 text-justify">
      {message.split("|")[1]}
    </p>
  </div>
)}

</h1>


    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <a
        href="/"
        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
      >
        <i className="fas fa-home"></i>
        Go to Home
      </a>

      <a
        href="/sign-in"
        className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
      >
        <i className="fas fa-sign-in-alt"></i>
        Sign In
      </a>
    </div>
  </div>
</div>






   
    </>
  );
}

"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function PaymentForm() {

  
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) return;
  setIsLoading(true);

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: { return_url: `https://profer-ui.vercel.app/company-profile` },
   // redirect: "if_required",
  });

  // Handle error
  if (error) {
    if (error.payment_intent && error.payment_intent.status === "succeeded") {
      // Payment succeeded despite error, redirect
      router.push("/company-profile");
      return;
    }
    setMessage(error.message || "Something went wrong. Please try again.");
    setDetailedError(JSON.stringify(error, null, 2));
    if (error.payment_intent) setPaymentStatus(error.payment_intent.status);
  } 
  // Handle success
  else if (paymentIntent) {
    setPaymentStatus(paymentIntent.status);
    if (paymentIntent.status === "succeeded") {
      router.push("/company-profile"); // Instant redirect
    } else {
      setMessage(`Unexpected status: ${paymentIntent.status}`);
      setDetailedError(JSON.stringify(paymentIntent, null, 2));
    }
  }

  setIsLoading(false);
};


  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        id="payment-element"
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#030316ff",
              fontFamily: "Inter, sans-serif",
              "::placeholder": { color: "#a0aec0" },
            },
            invalid: { color: "#e53e3e" },
          },
        }}
      />

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full bg-[#0a113c] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#080d2b] transition disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Pay now"}
      </button>

      {message && (
        <div id="payment-message" className="text-red-600 text-sm text-center mt-2">
          {message}
        </div>
      )}

      {paymentStatus && (
        <div className="text-xs text-center text-gray-600">
          PaymentIntent status: <strong>{paymentStatus}</strong>
        </div>
      )}

      {detailedError && process.env.NODE_ENV === "development" && (
        <div className="bg-red-50 text-red-800 text-xs p-3 rounded mt-3 border border-red-200">
          <strong>Debug Details:</strong>
          <pre className="whitespace-pre-wrap break-words mt-1">{detailedError}</pre>
        </div>
      )}

      {paymentStatus && ["succeeded", "canceled"].includes(paymentStatus) && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
        >
          Retry with new payment session
        </button>
      )}
    </form>
  );
}

export default function CheckoutForm({ clientSecret }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="w-full max-w-md mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Complete Your Membership
        </h2>
        <PaymentForm />
      </div>
    </Elements>
  );
}

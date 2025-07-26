"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `https://profer-ui.vercel.app/company-profile` },
      redirect: "if_required", // Stay on page to show errors instead of redirecting
    });

    if (error) {
      // Main error message
      setMessage(error.message || "Something went wrong. Please try again.");

      // Extract detailed error info (if available)
      if (error.payment_intent && error.payment_intent.last_payment_error) {
        setDetailedError(error.payment_intent.last_payment_error.message);
      } else if (paymentIntent && paymentIntent.last_payment_error) {
        setDetailedError(paymentIntent.last_payment_error.message);
      } else {
        setDetailedError(JSON.stringify(error, null, 2)); // fallback to raw error object
      }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");
      setDetailedError(null);
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

      {detailedError && (
        <div className="bg-red-50 text-red-800 text-xs p-3 rounded mt-3 border border-red-200">
          <strong>Details:</strong>
          <pre className="whitespace-pre-wrap break-words mt-1">{detailedError}</pre>
        </div>
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

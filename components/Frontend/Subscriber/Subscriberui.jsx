"use client";

import { useState } from "react";

export function SubscriberForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Subscribed successfully!");
        setError(false);
        setEmail("");
      } else {
        setMessage(data.message || "Failed to subscribe.");
        setError(true);
      }

      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
      setError(true);
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    }

    setSubmitting(false);
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch gap-3"
      >
        {/* Email input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border-2 border-gray-300 dark:border-gray-600 p-3 rounded-xl sm:rounded-l-2xl sm:rounded-r-none focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition"
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-red-500 text-white font-semibold px-5 py-3 rounded-xl sm:rounded-r-2xl sm:rounded-l-none hover:bg-red-600 hover:scale-105 transform transition-all shadow-md disabled:opacity-60"
        >
          {submitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {/* Success / Error message */}
      <p
        className={`mt-2 text-sm transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        } ${error ? "text-red-600" : "text-green-600"}`}
      >
        {message}
      </p>
    </div>
  );
}

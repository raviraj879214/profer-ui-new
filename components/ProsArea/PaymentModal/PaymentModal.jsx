"use client";
import { useEffect, useState } from "react";
import { getStripeActivePlan } from "../../../lib/stripeactiveplan/store";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Crown } from "lucide-react"; // lucide icons

export function UpgradeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchCheckUserFreePro();
  }, []);

  const fetchCheckUserFreePro = async () => {
    const storedId = localStorage.getItem("UserID");

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/check-user-free-pro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserID: storedId }),
    });

    if (res.ok) {
      const result = await res.json();

      if (result.status == 201) {
       
        if (pathname === "/pro/step-3") {
          router.push("/pro/pro-credentials");
        }
        setIsOpen(true);
      }
    }
  };

const handleCheckout = async () => {
  try {
    setLoading(true);

    const userId = localStorage.getItem("UserID");
    if (!userId) {
      alert("User ID not found");
      setLoading(false);
      return;
    }

    const paymentid = await getStripeActivePlan();
    console.log("paymentid",paymentid);
    const res = await fetch("/api/stripe/renew-stripe-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, priceId: paymentid }),
    });

    if (!res.ok) {
      console.error("Checkout API failed:", res.status, res.statusText);
      setLoading(false);
      return;
    }

    const data = await res.json();
    console.log("Stripe Redirect Response:", data); // <---- log it fully

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.log("No redirect URL found in response");
      setLoading(false);
    }

  } catch (error) {
    console.log("Checkout error:", error); // <--- full object
    setLoading(false);
  }
};




  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl transform transition-transform duration-300 scale-95 animate-scaleIn">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-2xl"
            >
              &times;
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full shadow-md">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
              Unlock Pro Features
            </h2>

            {/* Description */}
            <p className="mb-6 text-gray-600 text-lg leading-relaxed">
              Get access to all premium tools, remove limitations, and elevate your workflow with <span className="font-semibold text-blue-500">Pro</span>.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Redirecting...
                </>
              ) : (
                "Upgrade to Pro"
              )}
            </button>
          </div>

          {/* Loader Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-700 font-medium">
                  Preparing secure payment...
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function UpgradeModal() {
  const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(true);
        if (pathname === "/pro/step-3") 
        {
          setTimeout(() => {
            router.push("/pro/pro-credentials");
          }, 3000);
        } 
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl transform transition-transform duration-300 scale-95 animate-scaleIn">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Unlock Pro Features</h2>
            <p className="mb-6 text-gray-600">
              Upgrade to the Pro version to access all premium features, remove
              limitations, and enjoy a seamless experience.
            </p>

            <button
              onClick={() => alert("Redirect to payment")}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

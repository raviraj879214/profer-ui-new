"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export function Companyprofile({ paymentIntentId }) {
  const [prosName, setProsName] = useState("");

  // Fetch Pros Details



  
  const getProsDetails = async () => {
    const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;

    if (!email) {
      console.error("No email found in localStorage");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-pros-details/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          console.log(result);
          setProsName(result.data.firstname);
        } else {
          console.warn("Unexpected response:", result);
        }
      } else {
        console.error("Failed to fetch:", res.status);
      }
    } catch (error) {
      console.error("Error fetching pros details:", error);
    }
  };

  // Update Payment Details
  const updatePaymentDetails = async (paymentIntentId) => {
    try {
      console.log("Payment Intent ID:", paymentIntentId);
      const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;

      if (!email) {
        console.error("No email found in localStorage");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/update-pros-payment-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailaddress: email,
          paymentintentid: paymentIntentId,
          status : "2"
        }),
      });

      if (res.ok) {
        console.log("Payment details updated successfully");
      } else {
        console.error("Failed to update payment details:", res.status);
      }
    } catch (error) {
      console.error("Error updating payment details:", error);
    }
  };

  // On Mount: Fetch details & update payment
  useEffect(() => {
    getProsDetails();

    if (paymentIntentId) {

      updatePaymentDetails(paymentIntentId);
      
    }
    transfertempusertosubscription();
  }, [paymentIntentId]);





  const transfertempusertosubscription = async ()=>{

     const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/activate-user-tempuser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }, // <-- Add this
          body: JSON.stringify({ emailaddress: email }),
        });

      if(res.ok){
        const result= await res.json();
        if(result.status == 200){
          console.log("user transfered successfully");

        }
      }
  };











  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-6 sm:px-12 py-20 flex flex-col items-center text-center">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-16 w-full">
          <div className="flex-shrink-0 max-w-xs md:max-w-sm">
            <img
              src="./images/comapny-profile.png"
              alt="Vector illustration of a man wearing a red cap and teal vest working on a laptop, flat style"
              className="w-full h-auto mx-auto"
            />
          </div>
          <div className="mt-10 md:mt-0 text-left max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-900">
              Hi, {prosName || "there"}.
            </h2>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Congratulations on your Pro Membership! Get started by entering your business details. Click Next to save and proceed.
            </p>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="mt-20 w-full flex items-center justify-between max-w-lg mx-auto">
          <button
            className="text-gray-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 rounded"
            aria-label="Skip"
          >
            Skip
          </button>

          <div className="flex space-x-3 items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 block"></span>
            <span className="w-3 h-3 rounded-full bg-gray-300 block"></span>
            <span className="w-3 h-3 rounded-full bg-gray-300 block"></span>
          </div>

          <button
            className="bg-[#0A0B27] shadow-lg text-white py-2 px-6 rounded-full text-sm font-semibold hover:bg-[#131533] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            aria-label="Next"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

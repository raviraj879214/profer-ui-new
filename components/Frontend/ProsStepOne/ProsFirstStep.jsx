"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Image from "next/image";

export function Companyprofile({ paymentIntentId }) {
  const [prosName, setProsName] = useState("");
  const router =  useRouter();
 const [isReady, setIsReady] = useState(false);



  useEffect(() => {
    const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;
    if (!email) {
      router.replace("/"); // redirect immediately
      return;
    }
    setIsReady(true); // only render page when email exists
  }, [router]);

  // Fetch Pros Details
  const getProsDetails = async () => {
    const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;
    if (!email) return router.push("/");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-pros-details/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (res.ok && result.status === 200) {
        setProsName(result.data.firstname);
      } else {
        console.warn("Unexpected response:", result);
      }
    } catch (error) {
      console.error("Error fetching pros details:", error);
    }
  };

  // Update Payment Details
  const updatePaymentDetails = async (paymentIntentId) => {
    const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;
    if (!email) return console.error("No email found in localStorage");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/update-pros-payment-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailaddress: email,
          paymentintentid: paymentIntentId,
          status: "2",
        }),
      });

      if (!res.ok) return console.error("Failed to update payment details:", res.status);
      console.log("Payment details updated successfully");
    } catch (error) {
      console.error("Error updating payment details:", error);
    }
  };

  // Transfer Temp User to Subscription
  const transfertempusertosubscription = async (paymentIntentId) => {
    debugger;
    const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;
    if (!email) return console.error("No email found in localStorage");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/activate-user-tempuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailaddress: email, paymentIntentId : paymentIntentId }),
      });

      const result = await res.json();
      if (res.ok && result.status === 200) {
        console.log("User transferred successfully");
      }
    } catch (error) {
      console.error("Error transferring user:", error);
    }
  };

  // Sign In External
  const signinexternal = async () => {
    debugger;
    debugger;
    const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;
    const temppassword = typeof window !== "undefined" ? localStorage.getItem("temppassword") : null;
    if (!email || !temppassword) return console.error("Missing login credentials");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/pro-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailaddress: email, password: temppassword }),
      });

      const result = await response.json();
      console.log("Logged from Company profile" , result);
      localStorage.clear();
      // Save login details
      localStorage.setItem("FrontendRole", JSON.stringify(result.user.role));
      localStorage.setItem("Frontendtoken", result.token);
      localStorage.setItem("FrontendLoginStatus", "true");

      console.log("Login successful", result);
      // localStorage.setItem("tempemailuser","");
      // localStorage.setItem("temppassword","");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // On Mount: Fetch details & update payment
  useEffect(() => {
    getProsDetails();
    if (paymentIntentId) updatePaymentDetails(paymentIntentId);
    transfertempusertosubscription(paymentIntentId);
    // signinexternal();
  }, [paymentIntentId]);


   useEffect(() => {
    const onLoad = () => {
      localStorage.setItem("tempemailuser", "");
      localStorage.setItem("temppassword", "");
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);


  
  return (
  <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-white">
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6">
        
        {/* Success Icon */}
       {/* <CheckCircleIcon className="w-20 h-20 text-[#21afbc] animate-bounce" /> */}

      
        {/* Heading */}
        <h2 className="mt-6 text-3xl font-bold text-[#21afbc]">
          Payment Successful 
        </h2>

        {/* Description */}
        <p className="mt-4 text-[#21afbc] text-lg max-w-md">
          Your pro membership is now active! Login to explore and start using your new features right away.
        </p>

        {/* Action Button */}
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

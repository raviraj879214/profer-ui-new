"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const transfertempusertosubscription = async () => {
    const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;
    if (!email) return console.error("No email found in localStorage");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/activate-user-tempuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailaddress: email }),
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
    transfertempusertosubscription();
    signinexternal();
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
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-6 sm:px-12 py-20 flex flex-col items-center text-center">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-16 w-full">
          <div className="flex-shrink-0 max-w-xs md:max-w-sm">
            <img
              src="./images/comapny-profile.png"
              alt="Company profile illustration"
              className="w-full h-auto mx-auto"
            />
          </div>
          <div className="mt-10 md:mt-0 text-left max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-900">Hi, {prosName || "there"}.</h2>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Congratulations on your Pro Membership! Get started by entering your business details. Click Next to save and proceed.
            </p>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="mt-20 w-full flex items-center justify-between max-w-lg mx-auto">
          <button className="text-gray-400 text-sm font-semibold focus:outline-none">Skip</button>
          <div className="flex space-x-3 items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 block"></span>
            <span className="w-3 h-3 rounded-full bg-gray-300 block"></span>
            <span className="w-3 h-3 rounded-full bg-gray-300 block"></span>
          </div>
          <button onClick={()=>{
            router.push('/pro/step-2')
          }}  className="bg-[#0A0B27] shadow-lg text-white py-2 px-6 rounded-full text-sm font-semibold hover:bg-[#131533] transition">
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from "next/navigation";
export function CreateAccount() {

    const [success , setsuccess] = useState(false);
    const router = useRouter();
     
      useEffect(() => {
        const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;
        createfreeaccount(email);
      },[]);


      const createfreeaccount= async (email)=>{

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-free-account`,
          {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({
              "emailaddress" : email
            })
          },
        );
        if(res.ok)
        {
          const result = await res.json();
          if(result.status == 200){
            localStorage.setItem("tempemailuser", "");
            setsuccess(true);
          }
        }
      }




  return (<>
 
    {success ? (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-white">
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6">
        
        {/* Success Icon */}
       <CheckCircleIcon className="w-20 h-20 text-[#21afbc] animate-bounce" />

      
        {/* Heading */}
        <h2 className="mt-6 text-3xl font-bold text-[#21afbc]">
          Account Created Successful 
        </h2>

        {/* Description */}
        <p className="mt-4 text-[#21afbc] text-lg max-w-md">
  Your Free Membership is now active! Thank you for signing up. 
  Log in to explore, and consider upgrading your plan to unlock even more features.
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
) : (
  // ⏳ Loading state
  <div className="min-h-screen flex items-center justify-center">
    <div className="bg-white p-8 rounded-2xl shadow-lg flex items-center gap-4">
      {/* Spinner */}
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />

      {/* Label */}
      <div>
        <p className="text-lg font-semibold text-gray-700">
          Creating your account...
        </p>

        {/* Sub-label */}
        <p className="text-sm text-gray-500">
          Please wait a moment
        </p>
      </div>
    </div>
  </div>
)}









 
 </>);
}

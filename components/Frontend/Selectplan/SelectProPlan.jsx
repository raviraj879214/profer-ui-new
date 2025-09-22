"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStripeActivePlan } from "../../../lib/stripeactiveplan/store";
import Cookies from "js-cookie";


export function SelectProPlan(){
    const router = useRouter();


    const [price, setPrice] = useState(null);
    const handleplan=()=>{
        Cookies.set("FreeTrial", "pro", { expires: 7, path: "/" });
        router.push("/email-verify");
    }

    const freeplan=()=>{
       Cookies.set("FreeTrial", "free", { expires: 7, path: "/" });
       router.push("/email-verify");
    }



        useEffect(() => {
        async function fetchPrice() {
          try {
            const res = await fetch("/api/stripe-price"); // works in localhost and production
            const data = await res.json();
            setPrice(data);
          } catch (error) {
            console.error("Error fetching price:", error);
          }
        }
        fetchPrice();
      }, []);



    return(<>
    
     <section className="max-w-7xl mx-auto mt-12 px-6 mt-30">
        <div className="bg-blue-100 rounded-r-3xl py-8 px-12 flex flex-col md:flex-row md:justify-between md:items-center max-md:space-y-4">
          <h2 className="text-3xl font-semibold text-gray-900 max-w-md">
            Choose your plan
          </h2>
          <div className="text-gray-700 max-w-lg text-base leading-relaxed">
            <p>
              With Profer on your side, you'll be able to show your credibility
              and grow your business.
            </p>
            <p className="mt-2 text-gray-500">
              Take a look at our plans to find one that's right for you.
            </p>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="flex flex-col md:flex-row gap-12 mt-10 max-w-5xl mx-auto">
          {/* Profer Pro Membership */}
          <div className="flex-1 space-y-4">
            <h3 className="font-semibold text-lg">Profer Pro Membership</h3>
            <ul className="text-gray-700 list-disc list-inside space-y-2">
              <li>All benefits of the free version</li>
              <li>
                Verified credentials and publicly verified{" "}
                <span className="font-semibold">ProFile™</span>
              </li>
              <li>
                <span className="text-red-500">Free leads</span>
              </li>
              <li>
                Access to our bid network where we send you jobs to bid on. You
                pay 10% when you win the job.
              </li>
            </ul>
            <p className="text-blue-400 font-semibold">$ {price ? price.amount : "..."}  per year</p>
            <button onClick={handleplan}
                className="bg-red-500 text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-red-600 transition">
              Select
            </button>
          </div>

          {/* Free Pro Membership */}
          <div className="flex-1 space-y-4">
            <h3 className="font-semibold text-lg">Free Pro Membership</h3>
            <ul className="text-gray-700 list-disc list-inside space-y-2">
              <li>
                Store and house your professional credentials all in one spot.
              </li>
              <li>
                Receive licensing and certification renewal reminders and stay
                on top of all upcoming renewals.
              </li>
            </ul>
            <p className="text-blue-400 font-semibold">Free to use</p>
            <button
            onClick={()=>[
              freeplan()
            ]}
            
            className="bg-red-500 text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-red-600 transition">
              Select
            </button>
          </div>
        </div>
      </section>

      {/* Never Pay for Leads Section */}
      <section className="bg-gray-900 mt-16 text-white py-12" style={{ backgroundColor: "oklch(0.26 0.04 281.35)" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
          <div className="flex-shrink-0 w-40 md:w-52">
            <img
              src="./images/pro-select-plan.jpg"
              alt="Handshake illustration"
              width={208}
              height={208}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="max-w-lg">
            <h3 className="text-lg font-normal mb-4">Never pay for leads</h3>
            <p className="font-mono text-sm leading-relaxed mb-2">
              That's our promise. No gimmicks. Join to gain access to project
              bid opportunities. We drive clients straight to your ProFile
              where they can contact you directly. We even let you know when and
              who views your{" "}
              <span className="font-semibold text-red-500">ProFile™.</span>
            </p>
            <a
              href="#"
              className="inline-flex items-center text-blue-400 hover:text-blue-500 transition text-sm font-semibold"
            >
              → Choose Profer Pro Plan
            </a>
          </div>
        </div>
      </section>

     

      {/* Contact Section */}
      <section className="bg-blue-100 py-8 mt-16 text-center">
        <p className="font-semibold text-lg">Questions about Profer?</p>
        <p className="text-gray-500 mt-2">
          Give us a shout. We are happy to help.
        </p>
        <p className="text-red-500 mt-1 font-semibold">
          800-813-4021 <span className="text-gray-700 mx-2">|</span>{" "}
          <a href="mailto:info@profer.com" className="hover:underline">
            info@profer.com
          </a>
        </p>
      </section>
    
    </>);
}
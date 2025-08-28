"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CheckoutForm from "../../checkout";
import Link from "next/link";
import { getStripeActivePlan } from "../../../lib/stripeactiveplan/store";
import Cookies from "js-cookie";
import { CreditCard, Gift } from "lucide-react"; // if using lucide-react icons

export function ProsCheckout({ clientSecret, amount }) {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();
  const [button, setbutton] = useState(false);
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // NEW: password visibility state
  const [activeTab, setActiveTab] = useState("pro");
   

    useEffect(()=>{
      const trialStatus = Cookies.get("FreeTrial");
      setActiveTab(trialStatus);
    },[]);


  const onSubmit = async (data) => {
    try {
      setbutton(true);
      const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;
      console.log("Form Data:", email);
      localStorage.setItem("temppassword", data.password);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: data.firstName,
          lastname: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          emailaddress: email,
          password: data.password,
          status: "1"
        }),
      });
      const result = await res.json();

      if (res.ok && result.status === 200) {
        console.log("Payment successful:", result);
         const priceId = await getStripeActivePlan();
         if(activeTab == "free"){
            handleFreeregistration();
         }
         else if(activeTab == "pro"){
            handleCheckout(`${priceId}`);
         }
        
      }
    }
    catch (error) {
      console.log("Error during payment:", error);
    }
      setbutton(false);
  };



  const handleFreeregistration=()=>{
    
    router.push("/create-free-account")

  }




  const handleCheckout = async (priceId) => {


    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    window.location.href = data.url;
    
  };

  const fetchprodetails = async () => {
    const email = typeof window !== "undefined" ? localStorage.getItem("tempemailuser") : null;
    setEmail(email); // set email for readonly field
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-pros-details/${email}`, {
      method: "GET"
    });

    if (res.ok) {
      const result = await res.json();
      if (result.status == 200) {
        console.log("pros data", result);
        setValue("firstName", result.data.firstname);
        setValue("lastName", result.data.lastname);
        setValue("address", result.data.address);
        setValue("city", result.data.city);
        setValue("state", result.data.state);
        setValue("zipCode", result.data.zipCode);
      }
    }
  };

  useEffect(() => {
    fetchprodetails();
  }, []);





  return (
    <main className="max-w-xl mx-auto px-6 py-20 text-gray-800 relative">
      <h1 className="text-3xl font-semibold mb-10">Personal Details</h1>

      <form className="space-y-8 text-sm" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          {/* Readonly Email Field */}
          <div className="flex flex-col w-full">
            <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Password Field with show/hide */}
          <div className="flex flex-col w-full mt-6 relative">
            <label className="mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message: "Password must include uppercase, lowercase, number, and special character"
                }
              })}
            />
            {/* Toggle visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

            {errors.password && (
              <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
            )}
          </div>

          {/* First & Last Name */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-6">
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col w-full mt-6">
            <label className="mb-1 text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <span className="text-red-500 text-xs mt-1">{errors.address.message}</span>
            )}
          </div>

          {/* City, State, Zip */}
          <div className="flex flex-col md:flex-row md:space-x-4 mt-6 space-y-4 md:space-y-0">
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <span className="text-red-500 text-xs mt-1">{errors.city.message}</span>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("state", { required: "State is required" })}
              />
              {errors.state && (
                <span className="text-red-500 text-xs mt-1">{errors.state.message}</span>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-gray-700">Zip Code</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("zipCode", { required: "Zip code is required" })}
              />
              {errors.zipCode && (
                <span className="text-red-500 text-xs mt-1">{errors.zipCode.message}</span>
              )}
            </div>
          </div>
              
         
            <PlanSelector activeTab ={activeTab} setActiveTab = {setActiveTab} />

            
          

                

          {/* Terms & Conditions */}
          <div className="flex flex-col mt-6">
              <div className="flex items-start">
  <input
    id="terms"
    type="checkbox"
    className="mt-1 mr-2 rounded border-gray-300 focus:ring-indigo-500"
    {...register("terms", { required: "You must agree to the terms and conditions" })}
  />
        <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">
        I agree with the{" "}
        <Link
          href="/terms"
          className="text-blue-600 underline hover:text-blue-800"
          target="_blank"
        >
          terms and conditions
        </Link>{" "}
        of the Pro Purchase Agreement
      </label>
          </div>


            {errors.terms && (
              <span className="text-red-500 text-xs mt-1">{errors.terms.message}</span>
            )}
          </div>


          <button
                type="submit"
                className="mt-4 w-full bg-[#0a113c] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#080d2b] transition"
                disabled={button}>
               {button 
                  ? "Processing..." 

                  : activeTab === "pro" 
                    ? "Proceed To Payment" 
                    : "Click To Register"
                }
          </button>
        </fieldset>

       

      
      </form>

      <div className="flex items-center justify-center h-screen">
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => { setIsOpen(false); setbutton(false); }}></div>
            <div className="bg-white rounded-lg shadow-lg z-10 w-100 ">
              {/* <CheckoutForm clientSecret={clientSecret} amount={amount} /> */}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}




function PlanSelector({ activeTab, setActiveTab }) {
const [price, setPrice] = useState(null);
    
  useEffect(()=>{
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
  },[]);
  return (
    <div className="w-full mt-5">
      {/* Label */}
      <p className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-600" />
        Select Account Method
      </p>

      {/* Toggle Buttons */}
      <ul className="flex w-full text-sm font-medium text-gray-600 dark:text-gray-300 gap-3">
        {/* Pro Plan Tab */}
       {/* Pro Plan Tab */}
<li className="w-1/2">
  <button
    type="button"   // <-- ADD THIS
    onClick={() => setActiveTab("pro")}
    className={`flex flex-col items-center justify-center w-full px-4 py-3 rounded-xl border transition shadow-sm ${
      activeTab === "pro"
        ? "border-blue-600 text-blue-600 bg-blue-50 font-semibold shadow-md"
        : "border-gray-300 hover:border-blue-400 hover:text-blue-500"
    }`}
  >
    <CreditCard className="w-5 h-5 mb-1" />
    Current Plan $ {price ? price.amount : "..."}
  </button>
</li>

{/* Free Version Tab */}
<li className="w-1/2">
  <button
    type="button"   // <-- ADD THIS
    onClick={() => setActiveTab("free")}
    className={`flex flex-col items-center justify-center w-full px-4 py-3 rounded-xl border transition shadow-sm ${
      activeTab === "free"
        ? "border-blue-600 text-blue-600 bg-blue-50 font-semibold shadow-md"
        : "border-gray-300 hover:border-blue-400 hover:text-blue-500"
    }`}
  >
    <Gift className="w-5 h-5 mb-1" />
    Free Version
  </button>
</li>

      </ul>
    </div>
  );
}

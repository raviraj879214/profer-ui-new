"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";





export function AdminForgotPassword() { 


    const {register, handleSubmit, formState: { errors },reset} = useForm();
     const [message, setMessage] = useState("");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (message) {
      // Start fading after 5 seconds
      const fadeTimeout = setTimeout(() => {
        setFade(true);
      }, 5000);

      // Remove message after fade (6 seconds total)
      const hideTimeout = setTimeout(() => {
        setMessage("");
        setFade(false); // Reset fade for future messages
      }, 6000);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [message]);


    


    const handleSubmitForm = async (data: any) => {
       
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin-forgot-password`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: data.email }),
        });

        if(res.ok){
            const result= await res.json();

            if(result.status == 200){
                setMessage(result.message);
                reset();
            }
            else{
                setMessage(result.message);
                reset();
            }
        }   
    }



    return(<>
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-8 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Forgot Password</h2>
            <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
                <div>
                    {message}
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                    </label>
                    <input
                        id="email"
                       
                        type="email"
                        autoComplete="email"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="you@example.com"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address"
                            }
                        })}
                    />
                     {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                )}
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                    Send Reset Link
                </button>
            </form>
            <div className="mt-6 text-center">
                <a href="/admin-login" className="text-blue-600 hover:underline text-sm">
                    Back to login
                </a>
            </div>
        </div>
    </div>
        
    </>);
}

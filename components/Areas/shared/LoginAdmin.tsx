"use client"
import { useState } from "react";
import { set, useForm } from "react-hook-form";




export  function LoginAdminFrontend() {


    const {register,handleSubmit,reset,formState: { errors }} = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    
    const onSubmit =async (data: any) => {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email : data.email,
          password : data.password
        })
      });
      if(response.ok){
        const result = await response.json();
        localStorage.setItem("token", result.token);
        console.log("Login successful", result);
        if(result.status == 200)
        {

          localStorage.setItem("Role", JSON.stringify(result.user.role.name));
          localStorage.setItem("token", result.token);
          localStorage.setItem("LoginStatus", "true");
          window.location.href = "/admin/dashboard";
        }
        else{
          setError(result.error);
        }
      }
      setLoading(false);
      reset();
    }
    return (
        <>
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center"> Admin</h1>
            <p>{error}</p>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
                )}
              </div>
              <button
              disabled={loading}
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                {}{loading ? "Logging in..." : "Login"}
              </button>
            </form>
           <div className="flex justify-end mt-2">
  <a href="/admin-forgot-password" className="text-sm text-blue-600 hover:underline">
    Forgot Password?
  </a>
</div>

            </div>
          </div>
        </>
    );
}
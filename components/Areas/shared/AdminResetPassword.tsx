"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface AdminResetPasswordFormProps {
  passwordresetlink: string;
}

export function AdminReset({ passwordresetlink }: AdminResetPasswordFormProps) {
  const [message, setMessage] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Token verification on mount
  useEffect(() => {
    const verifyToken = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/reset-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passwordresetlink }),
      });

      const result = await res.json();

      if (res.ok && result.status === 200) {
        setTokenValid(true);
      } else {
        setMessage("Token expired or invalid. Please try again.");
      }
    };

    verifyToken();
  }, [passwordresetlink]);

  // Password reset submission
  const onSubmit = async (data: any) => {
    
    if (data.newpassword !== data.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    
  


  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Reset Password
        </h2>

        {message && (
          <div className="mb-4 rounded bg-red-100 px-4 py-2 text-center text-sm text-red-700">
            {message}
          </div>
        )}

        {tokenValid && (
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newpassword"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                {...register("newpassword", { required: "New password is required" })}
              />
              {errors.newpassword && (
                <p className="text-sm text-red-500 mt-1">{errors.newpassword.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                {...register("confirmPassword", { required: "Please confirm your password" })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

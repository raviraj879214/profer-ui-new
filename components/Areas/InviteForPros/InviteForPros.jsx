"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import ListOfPros from "@/components/Areas/InviteForPros/ListOfPros"; 

export const InviteForm = ({ onSuccess }) => {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/add-pros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        throw new Error("Unexpected response format");
      }

      const result = await res.json();

      if (res.ok) {
        reset(); // Reset the form
        setSubmitMessage(result.message || "Invitation added successfully!");
        if (onSuccess) onSuccess();
        setTimeout(() => {
    setSubmitMessage(""); 
  }, 3000);
        // Optional: router.push(`/admin/invitepros?refresh=${Date.now()}`);
        //window.location.reload();
      } else {
        if (result.error?.includes("already exists")) {
          setSubmitError("Email ID already exists.");
        } else {
          throw new Error(result.error || "Failed to submit");
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 ">
      <div className="bg-white rounded-2xl space-y-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-gray-800">Invite Pro</h2>

        {submitMessage && (
          <div className="text-green-600 font-medium">{submitMessage}</div>
        )}
        {submitError && (
          <div className="text-red-600 font-medium">{submitError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter name"
              {...register("name", { required: "Name is required." })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">
              Email ID
            </label>
            <input
              id="emailId"
              type="email"
              placeholder="Enter email"
              {...register("emailId", {
                required: "Email Address is required.",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address.",
                },
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
            {errors.emailId && <p className="text-red-600 text-sm mt-1">{errors.emailId.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteForm;

"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {tokendecryptor} from "../../../lib/tokendecryptor";

export function AdminDetails() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(0);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setSuccess(true);


    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/update-user-details`, {
        method: "POST",
       headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        body: JSON.stringify({
          id : id,
          firstname : data.firstname,
          lastname : data.lastname
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === 200) {
        setMessage("User details updated successfully!");
      } else {
        setMessage(result.message || "Failed to update user.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setSuccess(false);
    }
  };

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-user-details/${userId}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
      const result = await res.json();
      if (res.ok && result.status === 200) {
        reset(result.data);  // Automatically fills all fields
        setId(result.data.id); // Syncs id from API
      } else {
        setMessage("User not found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setMessage("Error fetching user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     const id = tokendecryptor();
     setId(id);
    fetchUserData(id);
  }, []);

  











  if (loading) return <p className="p-4">Loading user details...</p>;

  return (
    <>
      <h3 className="text-lg font-semibold mb-1">General Settings</h3>
      <p className="text-sm text-gray-500 mb-4">Configure basic application settings and preferences</p>

      {message && <p className="mb-2 text-sm text-green-600">{message}</p>}

      <form className="space-y-4 max-w-lg" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("firstname", { required: "Firstname is required" })}
          />
          {errors.firstname && <p className="text-red-500 text-sm mb-2">{errors.firstname.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("lastname", { required: "Lastname is required" })}
          />
          {errors.lastname && <p className="text-red-500 text-sm mb-2">{errors.lastname.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            disabled={true}
            type="text"
            {...register("email")}
            className="w-full border border-gray-300 rounded-md p-3 text-sm bg-gray-100"
          />
        </div>

        <button
          disabled={success}
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {!success ? "Save Changes" : "Saving..."}
        </button>
      </form>
    </>
  );
}

"use client";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";

export default function ProjectSubmit() {
  const fileInputRef = useRef(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullname: "",
      phonenumber: "",
      email: "",
      contactMethod: "",
      propertyType: "",
      propertySize: "",
      address: "",
      buildingAge: "",
      serviceNeeded: "",
      roofType: "",
      problemDescription: "",
      urgency: "",
      photos: undefined,
      consent: false
    }
  });
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    setSuccess("");
    setErrorMsg("");

    if (!data.consent) {
      setErrorMsg("You must agree to the Terms & Privacy Policy");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", data.fullname);
    formData.append("phone", data.phonenumber);
    formData.append("email", data.email);
    formData.append("contactMethod", data.contactMethod);
    formData.append("propertyType", data.propertyType);
    if (data.propertySize) formData.append("propertySize", data.propertySize);
    if (data.address) formData.append("address", data.address);
    if (data.buildingAge) formData.append("buildingAge", String(data.buildingAge));
    if (data.serviceNeeded) formData.append("serviceNeeded", data.serviceNeeded);
    if (data.roofType) formData.append("roofType", data.roofType);
    if (data.problemDescription) formData.append("problemDescription", data.problemDescription);
    if (data.urgency) formData.append("urgency", data.urgency);

    if (data.photos && data.photos.length > 0) {
      formData.append("photos", data.photos[0]); // Single file only
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-roof-request`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.status === 200) {
        setSuccess("Your request has been submitted successfully!");
       
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setErrorMsg(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again later.");
    }
     reset();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Roofing Service Request</h2>
      {success && <p className="text-green-600 text-center mb-4">{success}</p>}
      {errorMsg && <p className="text-red-600 text-center mb-4">{errorMsg}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal / Contact Info */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Personal / Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input type="text" className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" 
                {...register("fullname", { required: "Full Name is required" })} />
              {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input type="tel" className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" 
                {...register("phonenumber", { required: "Phone Number is required" })} />
              {errors.phonenumber && <p className="text-red-500 text-sm">{errors.phonenumber.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input type="email" className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" 
                {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email address" } })} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Contact Method *</label>
              <select className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200"
                {...register("contactMethod", { required: "Preferred Contact Method is required" })}>
                <option value="">Select</option>
                <option value="Call">Call</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Any">Any</option>
              </select>
              {errors.contactMethod && <p className="text-red-500 text-sm">{errors.contactMethod.message}</p>}
            </div>
          </div>
        </section>

        {/* Property Information */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Property Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Property Type</label>
              <select className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" {...register("propertyType")}>
                <option value="">Select</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Industrial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Property Size (sq. ft.)</label>
              <input type="text" className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" {...register("propertySize")} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Property Address</label>
              <input type="text" className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" {...register("address")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Building Age (Years)</label>
              <input type="number" className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" {...register("buildingAge")} />
            </div>
          </div>
        </section>

        {/* Roofing Project Details */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Roofing Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service Needed</label>
              <select className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" {...register("serviceNeeded")}>
                <option value="">Select</option>
                <option>Roof Installation (New)</option>
                <option>Roof Replacement</option>
                <option>Roof Repair</option>
                <option>Inspection & Maintenance</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Roof Type / Material</label>
              <select className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" {...register("roofType")}>
                <option value="">Select</option>
                <option>Asphalt Shingles</option>
                <option>Metal Roofing</option>
                <option>Tile</option>
                <option>Flat Roof</option>
                <option>Other / Not Sure</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Describe the Problem or Request</label>
              <textarea className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" rows={4} {...register("problemDescription")}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Urgency Level</label>
              <select className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" {...register("urgency")}>
                <option value="">Select</option>
                <option>ASAP</option>
                <option>Within a Month</option>
                <option>Just Exploring</option>
              </select>
            </div>
          </div>
        </section>

        {/* Uploads */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Upload (Optional)</h3>
          <input 
            type="file" 
            className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200" 
            {...register("photos")}
            ref={(e) => {
              register("photos").ref(e);
              fileInputRef.current = e;
            }}
          />
        </section>

        {/* Consent */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="w-5 h-5" {...register("consent")} />
          <label className="text-sm text-gray-600">I agree to the Terms & Privacy Policy</label>
        </div>

        {/* Submit */}
        <button type="submit" className="w-full bg-red-600 text-white p-4 rounded-lg text-lg font-semibold transition">
          Submit Request
        </button>
      </form>
    </div>
  );
}

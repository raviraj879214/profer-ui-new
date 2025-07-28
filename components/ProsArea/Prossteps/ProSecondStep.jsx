"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export function ProsStepBusinessDetails({ userId  }) {
  const router = useRouter();
  const successRef = useRef(null);

  const serviceOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const qualificationOptions = ["Level 1", "Level 2", "Level 3"];
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedQualifications, setSelectedQualifications] = useState([]);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isQualificationOpen, setIsQualificationOpen] = useState(false);

  const [companyLogo, setCompanyLogo] = useState(null);
  const [ownerLicense, setOwnerLicense] = useState(null);
  const [previewCompanyLogo, setPreviewCompanyLogo] = useState(null);
  const [previewOwnerLicense, setPreviewOwnerLicense] = useState(null);

  const [successMessage, setSuccessMessage] = useState(""); 

  const { register, handleSubmit, setValue } = useForm();

  const toggleOption = (setState, selected, option) => {
    setState((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Fully flatten nested JSON/string arrays into clean array
  const safeParse = (val) => {
    if (!val) return [];
    let parsed = val;
    try {
      while (typeof parsed === "string") parsed = JSON.parse(parsed);
      if (Array.isArray(parsed)) {
        return parsed
          .flat(Infinity)
          .map((s) => String(s).replace(/['"]+/g, "").trim())
          .filter(Boolean);
      }
      return [];
    } catch {
      return String(val)
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((s) => s.replace(/['"]+/g, "").trim())
        .filter(Boolean);
    }
  };

  // Load existing data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-pros-business-request/${userId}`);
        if (res.ok) {
          const { business } = await res.json();
          if (!business) return;

          Object.keys(business).forEach((key) => {
            if (!["services", "qualifications"].includes(key)) setValue(key, business[key] || "");
          });

          setSelectedServices(safeParse(business.services));
          setSelectedQualifications(safeParse(business.qualifications));

          if (business.companyLogo) setPreviewCompanyLogo(business.companyLogo);
          if (business.ownerLicense) setPreviewOwnerLicense(business.ownerLicense);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [userId, setValue]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Submit handler
  const onSubmit = async (data) => {
    if (selectedServices.length === 0) return alert("Please select at least one service");
    if (selectedQualifications.length === 0) return alert("Please select at least one qualification");

    // Remove duplicates
    const cleanServices = [...new Set(selectedServices)];
    const cleanQualifications = [...new Set(selectedQualifications)];

    const formData = new FormData();
    formData.append("userId", String(userId));
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    // Save as comma-separated (not JSON)
    formData.append("services", cleanServices.join(","));
    formData.append("qualifications", cleanQualifications.join(","));
    if (companyLogo) formData.append("companyLogo", companyLogo);
    if (ownerLicense) formData.append("ownerLicense", ownerLicense);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-pros-business-request`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.business) {
        if (result.business.companyLogo) setPreviewCompanyLogo(result.business.companyLogo);
        if (result.business.ownerLicense) setPreviewOwnerLicense(result.business.ownerLicense);

        setSuccessMessage(result.isNew ? "Business details created successfully!" : "Business details updated successfully!");
        setTimeout(() => {
          successRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          successRef.current?.focus();
        }, 100);
      }
    } catch (err) {
      alert("Error saving data");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Success Banner */}
      {successMessage && (
        <div
          ref={successRef}
          tabIndex="-1"
          className="mb-6 p-4 text-center font-medium"
        >
          {successMessage}
        </div>
      )}

      <h2 className="text-center font-semibold text-lg mb-8">Business Details</h2>

      <form className="space-y-8 max-w-4xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
          {/* Company Info */}
          <input {...register("companyName", { required: "Company name is required" })} placeholder="Company Name" className="w-full border p-2 rounded" />
          <input {...register("companyPhone", { required: "Company phone is required" })} placeholder="Company Phone" className="w-full border p-2 rounded" />
          <input {...register("companyEmail", { required: "Company email is required" })} placeholder="Company Email" className="w-full border p-2 rounded" />
          <input {...register("ownerEmail", { required: "Owner email is required" })} placeholder="Owner Email" className="w-full border p-2 rounded" />
          <input {...register("ownerFirstName", { required: "Owner first name is required" })} placeholder="Owner First Name" className="w-full border p-2 rounded" />
          <input {...register("ownerLastName", { required: "Owner last name is required" })} placeholder="Owner Last Name" className="w-full border p-2 rounded" />
          <input {...register("streetAddress", { required: "Street address is required" })} placeholder="Street Address" className="w-full border p-2 rounded col-span-2" />
          <div className="grid grid-cols-3 gap-4 col-span-2">
            <input {...register("city", { required: "City is required" })} placeholder="City" className="w-full border p-2 rounded" />
            <input {...register("state", { required: "State is required" })} maxLength={2} placeholder="State" className="w-full border p-2 rounded" />
            <input {...register("zip", { required: "Zip is required" })} placeholder="Zip" className="w-full border p-2 rounded" />
          </div>
          <input {...register("ein", { required: "EIN is required" })} placeholder="EIN" className="w-full border p-2 rounded" />

          {/* Multi-selects */}
          <div className="col-span-2 grid grid-cols-2 gap-x-10">
            {/* Services */}
            <div>
              <label className="block text-xs mb-1 text-gray-600">Services</label>
              <div className="relative">
                <div className="border p-2 rounded cursor-pointer bg-white" onClick={() => setIsServiceOpen(!isServiceOpen)}>
                  {selectedServices.length > 0 ? selectedServices.join(", ") : "Select options"}
                </div>
                {isServiceOpen && (
                  <div className="absolute w-full border bg-white mt-1 rounded shadow z-10">
                    {serviceOptions.map((option) => (
                      <label key={option} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                        <input type="checkbox" checked={selectedServices.includes(option)} onChange={() => toggleOption(setSelectedServices, selectedServices, option)} className="mr-2" />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-xs mb-1 text-gray-600">Qualifications</label>
              <div className="relative">
                <div className="border p-2 rounded cursor-pointer bg-white" onClick={() => setIsQualificationOpen(!isQualificationOpen)}>
                  {selectedQualifications.length > 0 ? selectedQualifications.join(", ") : "Select options"}
                </div>
                {isQualificationOpen && (
                  <div className="absolute w-full border bg-white mt-1 rounded shadow z-10">
                    {qualificationOptions.map((option) => (
                      <label key={option} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                        <input type="checkbox" checked={selectedQualifications.includes(option)} onChange={() => toggleOption(setSelectedQualifications, selectedQualifications, option)} className="mr-2" />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="col-span-2 flex gap-10">
            {/* Company Logo */}
            <div>
              <label className="block text-xs mb-2 text-gray-600">Company Logo</label>
              <div className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                {companyLogo ? (
                  <img src={URL.createObjectURL(companyLogo)} className="w-full h-full object-cover rounded-md" />
                ) : previewCompanyLogo ? (
                  <img src={previewCompanyLogo} className="w-full h-full object-cover rounded-md" />
                ) : <span className="text-gray-400 text-3xl">+</span>}
                <input type="file" accept="image/*" onChange={(e) => setCompanyLogo(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            {/* Owner License */}
            <div>
              <label className="block text-xs mb-2 text-gray-600">Owner License</label>
              <div className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                {ownerLicense ? (
                  <img src={URL.createObjectURL(ownerLicense)} className="w-full h-full object-cover rounded-md" />
                ) : previewOwnerLicense ? (
                  <img src={previewOwnerLicense} className="w-full h-full object-cover rounded-md" />
                ) : <span className="text-gray-400 text-3xl">+</span>}
                <input type="file" accept="image/*" onChange={(e) => setOwnerLicense(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-12 flex justify-between items-center max-w-4xl mx-auto">
          <button type="button" className="text-[#00BBD1] underline text-sm font-semibold hover:text-[#008a9a]">
            Back
          </button>
          <button type="submit" className="bg-[#FF3B30] text-white font-bold py-2 px-10 rounded-full shadow-md">
            Save
          </button>
          <button onClick={() => router.push("/pro/step-3")} type="button" className="bg-[#0B0E26] text-white font-mono py-3 px-8 rounded-full shadow-md">
            Next
          </button>
        </div>
      </form>
    </main>
  );
}

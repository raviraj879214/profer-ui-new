"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { MultiSelect } from "../../ProsArea/Prossteps/MultiSelectDropdown";

export function ProsStepBusinessDetails({ userId }) {
  const router = useRouter();
  const successRef = useRef(null);

  const [serviceOptions, SetserviceOptions] = useState([]);
  const [qualificationOptions, SetqualificationOptions] = useState([]);

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedQualifications, setSelectedQualifications] = useState([]);

  const [companyLogo, setCompanyLogo] = useState(null);
  const [ownerLicense, setOwnerLicense] = useState(null);
  const [previewCompanyLogo, setPreviewCompanyLogo] = useState(null);
  const [previewOwnerLicense, setPreviewOwnerLicense] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue } = useForm();

  const fetchqualification = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/qualification/getnames`
    );
    if (res.ok) {
      const result = await res.json();
      const names = result.map((item) => item.name);
      SetqualificationOptions(names);
    }
  };

  const fetchservices = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/services/get-services`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      const result = await res.json();
      const names = result.map((item) => item.name);
      SetserviceOptions(names);
    }
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/create-pros-business-request/${userId}`
        );
        if (res.ok) {
          const { business } = await res.json();
          if (!business) return;

          Object.keys(business).forEach((key) => {
            if (!["services", "qualifications"].includes(key)) {
              setValue(key, business[key] || "");
            }
          });

          setSelectedServices(safeParse(business.services));
          setSelectedQualifications(safeParse(business.qualifications));

          if (business.companyLogo) setPreviewCompanyLogo(business.companyLogo);
          if (business.ownerLicense)
            setPreviewOwnerLicense(business.ownerLicense);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
    fetchqualification();
    fetchservices();
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
    setLoading(true);

    const cleanServices = [...new Set(selectedServices)];
    const cleanQualifications = [...new Set(selectedQualifications)];

    const formData = new FormData();
    formData.append("userId", String(userId));

    // only append fields that have values (don’t overwrite old values with empty)
    Object.keys(data).forEach((key) => {
      if (
        data[key] !== "" &&
        data[key] !== null &&
        data[key] !== undefined
      ) {
        formData.append(key, data[key]);
      }
    });

    if (cleanServices.length > 0) {
      formData.append("services", cleanServices.join(","));
    }
    if (cleanQualifications.length > 0) {
      formData.append("qualifications", cleanQualifications.join(","));
    }
    if (companyLogo) formData.append("companyLogo", companyLogo);
    if (ownerLicense) formData.append("ownerLicense", ownerLicense);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/create-pros-business-request`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await res.json();

      if (result.business) {
        if (result.business.companyLogo)
          setPreviewCompanyLogo(result.business.companyLogo);
        if (result.business.ownerLicense)
          setPreviewOwnerLicense(result.business.ownerLicense);

        setSuccessMessage(
          result.isNew
            ? "Business details created successfully!"
            : "Business details updated successfully!"
        );
        setTimeout(() => {
          successRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          successRef.current?.focus();
        }, 100);
      }
    } catch (err) {
      alert("Error saving data");
    }
    setLoading(false);
  };

  const submitbusinessdetails = () => {
    if (!loading) {
      router.push("/pro/step-3");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 mt-20">
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

      <h2 className="text-center font-semibold text-lg mb-8">
        Business Details
      </h2>

      <form
        className="space-y-8 max-w-4xl mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
          {/* Company Info */}
          <input {...register("companyName")} placeholder="Company Name" className="w-full border p-2 rounded" />
          <input {...register("companyPhone")} placeholder="Company Phone" className="w-full border p-2 rounded" />
          <input {...register("companyEmail")} placeholder="Company Email" className="w-full border p-2 rounded" />
          <input {...register("ownerEmail")} placeholder="Owner Email" className="w-full border p-2 rounded" />
          <input {...register("ownerFirstName")} placeholder="Owner First Name" className="w-full border p-2 rounded" />
          <input {...register("ownerLastName")} placeholder="Owner Last Name" className="w-full border p-2 rounded" />
          <input {...register("streetAddress")} placeholder="Street Address" className="w-full border p-2 rounded col-span-2" />
          <div className="grid grid-cols-3 gap-4 col-span-2">
            <input {...register("city")} placeholder="City" className="w-full border p-2 rounded" />
            <input {...register("state")} maxLength={2} placeholder="State" className="w-full border p-2 rounded" />
            <input {...register("zip")} placeholder="Zip" className="w-full border p-2 rounded" />
          </div>
          <input {...register("ein")} placeholder="EIN" className="w-full border p-2 rounded" />
          <input {...register("experienceYears")} placeholder="Established Year" className="w-full border p-2 rounded" />

          <div className="grid grid-cols-2 gap-4 col-span-2">
            <MultiSelect
              label="Services"
              options={serviceOptions}
              selected={selectedServices}
              setSelected={setSelectedServices}
            />
            <MultiSelect
              label="Qualifications"
              options={qualificationOptions}
              selected={selectedQualifications}
              setSelected={setSelectedQualifications}
            />
          </div>

          <div className="col-span-2 flex gap-10">
            {/* Company Logo */}
            <div>
              <label className="block text-xs mb-2 text-gray-600">
                Company Logo
              </label>
              <div className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                {companyLogo ? (
                  <img
                    src={URL.createObjectURL(companyLogo)}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : previewCompanyLogo ? (
                  <img
                    src={previewCompanyLogo}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-400 text-3xl">+</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCompanyLogo(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Owner License */}
            <div>
              <label className="block text-xs mb-2 text-gray-600">
                Owner License
              </label>
              <div className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                {ownerLicense ? (
                  <img
                    src={URL.createObjectURL(ownerLicense)}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : previewOwnerLicense ? (
                  <img
                    src={previewOwnerLicense}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-400 text-3xl">+</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setOwnerLicense(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="col-span-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Links to your:
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <input {...register("phone")} placeholder="Phone" className="w-full border p-2 rounded" />
              <input {...register("website")} placeholder="Website" className="w-full border p-2 rounded" />
              <input {...register("maps")} placeholder="Google Maps Link" className="w-full border p-2 rounded" />
              <input {...register("facebook")} placeholder="Facebook" className="w-full border p-2 rounded" />
              <input {...register("googlebusinesslisting")} placeholder="Google Business Listing" className="w-full border p-2 rounded" />
              <input {...register("bingbusinesslisting")} placeholder="Bing Business Listing" className="w-full border p-2 rounded" />
              <input {...register("linkedin")} placeholder="LinkedIn" className="w-full border p-2 rounded" />
              <input {...register("linktoyourwebsite")} placeholder="Link to your Website" className="w-full border p-2 rounded" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-12 flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/pro/step-1")}
            type="button"
            className="text-[#00BBD1] underline text-sm font-semibold hover:text-[#008a9a]"
          >
            Back
          </button>
          <button
            onClick={() => submitbusinessdetails()}
            type="submit"
            className="bg-[#0B0E26] text-white font-mono py-3 px-8 rounded-full shadow-md"
          >
            {loading ? "saving ..." : "Save & Next"}
          </button>
        </div>
      </form>
    </main>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export function Backgroundcheck() {
  const router = useRouter();
  const successRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [userstatus, setUserstatus] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    backgroundusergetdetails();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const isAdult = (dob) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const fillTestData = () => {
    reset({
      first_name: "John",
      last_name: "Doe",
      date_of_birth: "1990-01-01",
      email: "testuser@example.com",
      address: "123 Main St",
      city: "Seattle",
      county: "King",
      province_state: "WA",
      postal_code: "98101",
      country: "US",
      sin_ssn: "123456789",
      position_location_address: "500 Market St",
      position_location_city: "Seattle",
      position_location_county: "King",
      position_location_state: "WA",
      position_location_postal: "98104",
      position_location_country: "US",
    });
  };

  const onSubmit = async (form) => {
    setError(null);
    setResponse(null);
    setLoading(true);

    if (!isAdult(form.date_of_birth)) {
      setError("Applicant must be 18 or older.");
      setLoading(false);
      return;
    }

    try {
      const body = {
        request_us_criminal_record_check_tier_1: true,
        email: form.email || "example@certn.co",
        information: {
          first_name: form.first_name,
          last_name: form.last_name,
          date_of_birth: form.date_of_birth,
          addresses: [
            {
              address: form.address,
              city: form.city,
              county: form.county || "",
              province_state: form.province_state,
              country: form.country,
              postal_code: form.postal_code,
              current: true,
            },
          ],
          sin_ssn: form.sin_ssn || "123456789",
          us_criminal_consent_given: true,
        },
        position_or_property_location: {
          location_type: "Position Location",
          address: form.position_location_address,
          city: form.position_location_city,
          county: form.position_location_county || "",
          province_state: form.position_location_state,
          country: form.position_location_country,
          postal_code: form.position_location_postal,
        },
      };

      const res = await fetch("/api/certn/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.error) throw new Error(JSON.stringify(data.error));

      setResponse(data);
      await updateApplicationId(data.id);

      setSuccessMessage("Background check submitted successfully!");
      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth" });
        successRef.current?.focus();
      }, 100);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const backgroundusergetdetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-user-certn`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch user details.");
      const result = await res.json();
      if (result.status === 200) {
        if (result.data.verifiedStatus === "1") {
          router.push("/pro/pro-credentials");
        }
        else if (result.data.certapplicationid) {
          setUserstatus(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateApplicationId = async (appid) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/update-user-certn`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ applicationid: appid }),
      });
      if (!res.ok) throw new Error("Failed to update application ID.");
      const result = await res.json();
      if (result.status === 200) setUserstatus(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {successMessage && (
        <div
          ref={successRef}
          tabIndex="-1"
          className="mb-6 p-4 text-center bg-green-100 text-green-800 rounded font-medium"
        >
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 text-center bg-red-100 text-red-800 rounded font-medium">
          {error}
        </div>
      )}

      {userstatus ? (
        <div className="text-center py-12">
          <img src="/images/certn-logo.jpg" alt="Certn Logo" className="mx-auto w-40" />
          <p className="text-lg font-medium text-yellow-600 animate-pulse mt-4">
            Waiting for verification...
          </p>
          <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Your background check request has been submitted. Certn will contact you by email
            shortly — please check your inbox (and spam folder) for instructions. Verification may
            take some time, and you will be notified once it is complete.
          </p>

          <div className="mt-12 flex justify-between items-center max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => router.push("/pro/step-2")}
              className="text-blue-600 underline text-sm font-semibold hover:text-blue-800"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => router.push("/pro/pro-credentials")}
              className="bg-[#0B0E26] text-white font-mono py-3 px-6 rounded-full shadow-md hover:bg-gray-600"
            >
              NEXT
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-10">
            <img src="/images/certn-logo.jpg" alt="Certn Logo" className="mx-auto w-40 mb-4" />
            <h2 className="font-semibold text-xl">Run US Criminal Record Check </h2>
            <p className="text-gray-600 text-sm mt-2 max-w-xl mx-auto">
              Enter your basic details below. Once submitted, Certn will contact you by email.
              (You can also click <b>Fill Test Data</b> to auto-fill sample data for sandbox use.)
            </p>
            <button
              type="button"
              onClick={fillTestData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
              Fill Test Data
            </button>
          </div>

          <form className="space-y-12 max-w-4xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
            {/* Applicant Information */}
            <section>
              <h3 className="text-lg font-medium mb-4">Applicant Information</h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <input {...register("first_name", { required: true })} placeholder="First Name" className="w-full border p-2 rounded" />
                <input {...register("last_name", { required: true })} placeholder="Last Name" className="w-full border p-2 rounded" />
                <input type="date" {...register("date_of_birth", { required: true })} className="w-full border p-2 rounded" />
                <input type="email" {...register("email", { required: true })} placeholder="Email" className="w-full border p-2 rounded col-span-2" />
                <input {...register("sin_ssn", { required: true })} placeholder="SSN (9 digits)" className="w-full border p-2 rounded col-span-2" />
                <input {...register("address", { required: true })} placeholder="Street Address" className="w-full border p-2 rounded col-span-2" />
                <input {...register("city", { required: true })} placeholder="City" className="w-full border p-2 rounded" />
                <input {...register("county")} placeholder="County" className="w-full border p-2 rounded" />
                <input {...register("province_state", { required: true })} placeholder="State" className="w-full border p-2 rounded" />
                <input {...register("postal_code", { required: true })} placeholder="ZIP Code" className="w-full border p-2 rounded" />
              </div>
            </section>

            {/* Position / Property Location */}
            <section>
              <h3 className="text-lg font-medium mb-4">Position / Property Location</h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <input {...register("position_location_address", { required: true })} placeholder="Street Address" className="w-full border p-2 rounded col-span-2" />
                <input {...register("position_location_city", { required: true })} placeholder="City" className="w-full border p-2 rounded" />
                <input {...register("position_location_county")} placeholder="County" className="w-full border p-2 rounded" />
                <input {...register("position_location_state", { required: true })} placeholder="State" className="w-full border p-2 rounded" />
                <input {...register("position_location_postal", { required: true })} placeholder="ZIP Code" className="w-full border p-2 rounded" />
                <input {...register("position_location_country")} placeholder="Country" className="w-full border p-2 rounded" />
              </div>
            </section>

            {/* Buttons */}
            <div className="mt-12 flex justify-between items-center max-w-4xl mx-auto">
              <button
                type="button"
                onClick={() => router.push("/pro/step-2")}
                className="text-blue-600 underline text-sm font-semibold hover:text-blue-800"
              >
                Back
              </button>

              {!userstatus && (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0B0E26] text-white font-mono py-3 px-8 rounded-full shadow-md disabled:opacity-50 mx-4"
                >
                  {loading ? "Submitting..." : "Submit Check"}
                </button>
              )}

              <button
                type="button"
                onClick={() => router.push("/pro/pro-credentials")}
                className="bg-gray-500 text-white font-mono py-3 px-6 rounded-full shadow-md hover:bg-gray-600"
              >
                Skip & Continue
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export function Backgroundcheck() {
  const router = useRouter();
  const successRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [userstatus, setUserstatus] = useState(false);
  const [verified, setVerified] = useState(false);
  const [applicantEmail, setapplicationemail] = useState("");

  const [jsonResult, setJsonResult] = useState(null);
  const [certapplicationid, setcertapplicationid] = useState(null);

  // ✅ Ref guard to stop double execution in React Strict Mode
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
      backgroundusergetdetails();
      effectRan.current = true;
    }
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const sendInvite = async (emailaddress) => {
    debugger;
    setError(null);
    setLoading(true);

    try {
      const body = {
        email: emailaddress,
        request_us_criminal_record_check_tier_1: true,
      };

      const res = await fetch("/api/certn/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setJsonResult(data);
      if (data.error) throw new Error(JSON.stringify(data.error));

      await updateApplicationId(data.id);
      setSuccessMessage("Background check invite sent again successfully!");
      successRef.current?.scrollIntoView({ behavior: "smooth" });
      successRef.current?.focus();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const backgroundusergetdetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-user-certn`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch user details.");
      const result = await res.json();
      console.log("result verified", result);
      debugger;
      setcertapplicationid(result.data.certapplicationid);

      if (result.status === 200) {
        setapplicationemail(result.data.email);

        if (result.data.certapplicationid == "null") {
          sendInvite(result.data.email);
        }

        if (result.data.verifiedStatus === "1") {
          setVerified(true);
          // Delay 2 seconds before redirect
          setTimeout(() => {
            router.push("/pro/pro-credentials");
          }, 2000);
        } else if (result.data.certapplicationid) {
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/update-user-certn`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ applicationid: appid }),
        }
      );
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

      {verified ? (
        <div className="text-center mb-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-16 h-16 text-green-600 mx-auto mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75l2.25 2.25 4.5-4.5m5.25 
                 1.5a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="font-semibold text-xl text-green-700">
            Background Check Completed
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Redirecting you to credentials page...
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-10">
            <img
              src="/images/certn-logo.jpg"
              alt="Certn Logo"
              className="mx-auto w-40 mb-4"
            />

            <h2 className="font-semibold text-xl">US Criminal Record Check</h2>

            <p className="text-gray-600 text-sm mt-2 max-w-xl mx-auto">
              We’ve sent a background check invitation to:
            </p>

            <div className="flex items-center justify-center gap-2 mt-3 text-gray-700 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 
                   0 01-2.25 2.25H4.5a2.25 2.25 
                   0 01-2.25-2.25V6.75m19.5 
                   0A2.25 2.25 0 0019.5 4.5h-15A2.25 
                   2.25 0 002.25 6.75m19.5 0v.243a2.25 
                   2.25 0 01-1.07 1.916l-7.5 
                   4.615a2.25 2.25 0 01-2.36 
                   0l-7.5-4.615a2.25 2.25 0 
                   01-1.07-1.916V6.75"
                />
              </svg>
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-700">
                {applicantEmail}
              </span>
            </div>

            <p className="text-gray-600 text-sm mt-4 max-w-xl mx-auto">
              Please check your inbox (and spam folder) to verify and complete
              the process.
            </p>
          </div>

          <div className="mt-12 flex justify-between items-center max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => router.push("/pro/step-2")}
              className="text-blue-600 underline text-sm font-semibold hover:text-blue-800"
            >
              Back
            </button>

            {/* Optional resend button */}
            {/* <button
              type="button"
              onClick={() => sendInvite(applicantEmail)}
              disabled={loading}
              className="bg-[#0B0E26] text-white font-mono py-3 px-8 rounded-full shadow-md disabled:opacity-50 mx-4"
            >
              {loading ? "Resending..." : "Resend Invite"}
            </button> */}

            <button
              type="button"
              onClick={() => router.push("/pro/pro-credentials")}
              className="bg-[#0B0E26] text-white font-mono py-3 px-8 rounded-full shadow-md disabled:opacity-50 mx-4"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

 "use client";

import React, { useState } from "react";

export const InviteForm = () => {
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setSubmitError("");
    setSubmitMessage("");

    if (!name.trim()) {
      setNameError("Name is required.");
      isValid = false;
    }
    if (!emailId.trim()) {
      setEmailError("Email Address is required.");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(emailId)) {
      setEmailError("Enter a valid email address.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");

   try {
  try {

  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/add-pros`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",  // optional token
    },
    body: JSON.stringify({
      name: name.trim(),
      emailId: emailId.trim(),
    }),
  });

  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Expected JSON but got:", text);
    throw new Error("Unexpected response format");
  }

  const result = await res.json();

  if (res.ok) {
    setName("");
    setEmailId("");
    setSubmitMessage(result.message || "Invitation added successfully!");
    setNameError("");
    setEmailError("");
    setSubmitError("");
     setTimeout(() => {
    window.location.reload();
  }, 1000);
  } else {
    if (result.error?.includes("already exists")) {
      setEmailError("Email ID already exists.");
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

} catch (err) {
  console.error("Submit error:", err);
  setSubmitError(err.message || "Something went wrong. Please try again.");
} finally {
  setSubmitting(false);
}

  };

  return (
    <div className="px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-gray-800">Invite Pro</h2>
        {submitMessage && (
          <div className="text-green-600 font-medium">{submitMessage}</div>
        )}
        {submitError && (
          <div className="text-red-600 font-medium">{submitError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
            {nameError && <p className="text-red-600 text-sm mt-1">{nameError}</p>}
          </div>

          <div>
            <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">
              Email ID
            </label>
            <input
              id="emailId"
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="Enter email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteForm;

"use client";
import { useState } from "react";

export  function NotificationTestForm() {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendNotification = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("http://localhost:8000/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId), message }),
      });

      if (res.ok) {
        setStatus("Notification sent!");
        setUserId("");
        setMessage("");
      } else {
        setStatus("Failed to send notification.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error sending notification.");
    }
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Send Test Notification</h2>
      <form onSubmit={sendNotification} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">User ID</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Send Notification
        </button>
        {status && <p className="text-sm text-center mt-2 text-gray-600">{status}</p>}
      </form>
    </div>
  );
}

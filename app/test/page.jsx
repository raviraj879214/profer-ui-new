"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Bell } from "lucide-react";

const socket = io("http://localhost:8000");

export default function FormPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  // ✅ WebSocket setup
  useEffect(() => {
    socket.on("newNotification", () => {
      // When new notification received, refetch all
      fetchNotifications();
    });

    return () => socket.off("newNotification");
  }, []);

  // ✅ Fetch notifications from backend
  const fetchNotifications = async () => {
    const res = await fetch("http://localhost:8000/api/notifications/all");
    const data = await res.json();
    setNotifications(data);
  };

  // ✅ Toggle popup & fetch on open
  const togglePopup = () => {
    if (!showPopup) {
      fetchNotifications();
    }
    setShowPopup(!showPopup);
  };

  // ✅ Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/api/form/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message }),
    });

    const result = await res.json();
   alert(result.message);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="p-8 max-w-md mx-auto relative">
      {/* ✅ Notification Bell */}
     {/* ✅ Notification Bell */}
<div className="fixed top-30 right-6 z-50">
  <button
    onClick={togglePopup}
    className="relative p-2 rounded-full hover:bg-gray-200 transition"
  >
    <Bell className="w-6 h-6 text-gray-800" />
    {notifications.length > 0 && (
      <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
    )}
  </button>

  {/* ✅ Popup for notifications */}
{showPopup && (
  <div
    ref={popupRef}
    className="absolute right-0 mt-2 w-80 bg-white shadow-xl border border-gray-200 rounded-xl z-50"
  >
    <div className="p-4 max-h-60 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications yet</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((note) => (
            <li
              key={note.id}
              className={`p-3 rounded-md transition-all duration-200 border hover:shadow-md ${
                note.isRead
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold text-gray-800">Title:{note.title}</div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    note.isRead
                      ? "text-green-600 bg-green-100"
                      : "text-blue-600 bg-blue-100 font-semibold"
                  }`}
                >
                  {note.isRead ? "Read" : "Unread"}
                </span>
              </div>
              <div className="text-black-600 text-l mt-1">Message:{note.message}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}

</div>


      {/* ✅ Form */}
      <div className="min-h-screen flex items-center justify-center">
  <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
    <h1 className="text-2xl text-red-800 font-bold mb-4 text-center">Form</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full p-2 border rounded"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button
        className="bg-red-500 text-white px-4 py-2 hover:bg-red-800 rounded w-full"
        type="submit"
      >
        Submit
      </button>
    </form>
  </div>
</div>

    </div>
  );
}

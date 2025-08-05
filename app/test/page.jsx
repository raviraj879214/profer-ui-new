"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function NotificationBell({ userId = 1 }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Connect to backend
    const socket = io("http://localhost:8000", {
      transports: ["websocket"], // ensure websocket transport
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // When connected
    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
      socket.emit("join", userId);
    });

    // When connection fails
    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    // Receive notifications
    socket.on("notification", (data) => {
      console.log("🔔 Notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    // Cleanup
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, [userId]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-blue-600 text-white p-2 rounded-full"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg">
          <ul>
            {notifications.map((n, i) => (
              <li key={i} className="p-2 border-b">
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

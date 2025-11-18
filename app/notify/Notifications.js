"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CheckCircle, Circle } from "lucide-react";

let socket;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from API
  const fetchNotifications = () => {
    const userid = localStorage.getItem("AdminID");

    fetch(
      `${process.env.NEXT_PUBLIC_URL}/notifications/all?userId=${userid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNotifications(); // initial load

    // Connect to Socket
    socket = io(`${process.env.NEXT_PUBLIC_URL}`);

    // Update when new notification arrives
    socket.on("new_notification", () => {
      fetchNotifications();
    });

    return () => socket.disconnect();
  }, []);

  // Mark as Read API call
  const markAsRead = async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/notifications/${id}/read`, {
        method: "PATCH",
      });
      fetchNotifications(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Notifications</h2>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 && (
          <p className="text-gray-400 text-center py-6">No notifications yet</p>
        )}

        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-4 rounded-xl border flex justify-between items-center transition hover:shadow-md ${
                n.isRead
                  ? "bg-gray-100 border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Dot Indicator */}
                <span>
                  {n.isRead ? (
                    <Circle size={14} className="text-gray-400" />
                  ) : (
                    <Circle size={14} className="text-blue-500" />
                  )}
                </span>

                <div>
                  <p className="font-semibold text-gray-900">{n.title}</p>
                  <p className="text-sm text-gray-700">{n.message}</p>

                  {n.url && (
                    <a
                      href={n.url}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </a>
                  )}
                </div>
              </div>

              {/* Icon: Mark as read */}
              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-green-600 hover:text-green-700"
                  title="Mark as read"
                >
                  <CheckCircle size={22} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

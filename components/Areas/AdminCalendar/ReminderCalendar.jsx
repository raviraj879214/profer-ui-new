"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Tiny notification component
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      {message}
    </div>
  );
}

export function Calendar() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [newEvent, setNewEvent] = useState({
    id: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    reminderTime: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);

  // 📌 Fetch tasks from backend
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ➡️ Add or Update
  const handleSaveEvent = async () => {
    if (!newEvent.title.trim()) {
      setToast("⚠️ Please enter a task title.");
      return;
    }

    const date = selectedDate.split("T")[0];
    const eventToAdd = {
      title: newEvent.title,
      description: newEvent.description,
      start: `${date}T${newEvent.startTime}`,
      end: newEvent.endTime ? `${date}T${newEvent.endTime}` : null,
      reminder: newEvent.reminderTime
        ? `${date}T${newEvent.reminderTime}`
        : null,
    };

    try {
      if (isEditing) {
        await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/tasks/${newEvent.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventToAdd),
          }
        );
        setToast("✅ Task updated successfully.");
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventToAdd),
        });
        setToast("✅ Task added successfully.");
      }
      await fetchEvents();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving task:", err);
      setToast("❌ Failed to save task.");
    }
  };

  // ➡️ Delete
  const handleDeleteEvent = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/tasks/${newEvent.id}`,
        { method: "DELETE" }
      );
      await fetchEvents();
      setIsModalOpen(false);
      setToast("🗑️ Task deleted.");
    } catch (err) {
      console.error("Error deleting task:", err);
      setToast("❌ Failed to delete task.");
    }
  };

  // ⏰ Reminder notifications
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().toISOString().slice(0, 16);
      events.forEach((event) => {
        if (event.reminder && event.reminder.slice(0, 16) === now) {
          if (Notification.permission === "granted") {
            new Notification(`Reminder: ${event.title}`, {
              body: event.description,
            });
          }
        }
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [events]);

  // 🔔 Notify tasks for tomorrow when app loads
  useEffect(() => {
    if (!events.length) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const tomorrowTasks = events.filter((ev) =>
      ev.start.startsWith(tomorrowStr)
    );

    if (tomorrowTasks.length > 0) {
      setToast(`📅 You have ${tomorrowTasks.length} task(s) scheduled for tomorrow.`);
    }
  }, [events]);

  // Ask permission for notifications
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="p-4">
    

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        dateClick={(info) => {
          setSelectedDate(info.dateStr);
          setNewEvent({
            id: "",
            title: "",
            description: "",
            startTime: "",
            endTime: "",
            reminderTime: "",
          });
          setIsEditing(false);
          setIsModalOpen(true);
        }}
        eventClick={(info) => {
          const event = info.event;
          setSelectedDate(event.startStr.split("T")[0]);
          setNewEvent({
            id: event.id,
            title: event.title,
            description: event.extendedProps.description,
            startTime: event.startStr.split("T")[1]?.slice(0, 5) || "",
            endTime: event.endStr
              ? event.endStr.split("T")[1].slice(0, 5)
              : "",
            reminderTime: event.extendedProps.reminder
              ? event.extendedProps.reminder.split("T")[1].slice(0, 5)
              : "",
          });
          setIsEditing(true);
          setIsModalOpen(true);
        }}
        events={events}
        eventContent={(eventInfo) => (
          <div>
            <b>{eventInfo.event.title}</b>
            <p className="text-xs text-gray-500">
              {eventInfo.event.extendedProps.description}
            </p>
          </div>
        )}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Task" : "Add Task"} for {selectedDate}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time:
                </label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={newEvent.startTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startTime: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time:
                </label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={newEvent.endTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endTime: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Reminder Time:
                </label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={newEvent.reminderTime}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      reminderTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              {isEditing && (
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  onClick={handleDeleteEvent}
                >
                  Delete
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  onClick={handleSaveEvent}
                >
                  {isEditing ? "Update Task" : "Save Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

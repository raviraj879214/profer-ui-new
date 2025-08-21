"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Check, CheckCheck } from "lucide-react";
dayjs.extend(relativeTime);

export default function ChatSystem({ currentUserId = 1 }) {
  const API_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:8000";

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
    const statusInterval = setInterval(fetchUserStatus, 5000); // poll every 5s
    return () => clearInterval(statusInterval);
  }, []);

  const fetchUsers = async () => {
    const userid = localStorage.getItem("UserID");
    currentUserId = userid;
    try {
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data.filter(u => u.id !== currentUserId) : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/status`);
      const data = await res.json();

      let statusArray = [];

      if (Array.isArray(data)) {
        // API returned array
        statusArray = data;
      } else if (typeof data === "object" && data !== null) {
        // API returned object: { "1": "ONLINE", "2": "OFFLINE" }
        statusArray = Object.entries(data).map(([id, status]) => ({
          id: Number(id),
          status,
        }));
      } else {
        console.warn("Unexpected user status format:", data);
        return;
      }

      setUsers(prev =>
        prev.map(u => ({
          ...u,
          status: statusArray.find(s => s.id === u.id)?.status || "OFFLINE",
        }))
      );
    } catch (err) {
      console.error("Error fetching user status:", err);
    }
  };

  // Fetch messages repeatedly
  useEffect(() => {
    if (!selectedUser) return;
    fetchMessages();
    markAsSeen();

    const interval = setInterval(() => {
      fetchMessages();
      markAsSeen();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(
        `${API_URL}/api/messages/${currentUserId}/${selectedUser.id}`
      );
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;
    try {
      await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          senderId: currentUserId,
          receiverId: selectedUser.id,
        }),
      });
      setText("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const markAsSeen = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`${API_URL}/api/messages/seen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: selectedUser.id,
          receiverId: currentUserId,
        }),
      });
    } catch (err) {
      console.error("Error marking messages as seen:", err);
    }
  };

  const renderStatus = status => {
    if (status === "SENT") return <Check size={14} className="text-gray-400" />;
    if (status === "DELIVERED")
      return <CheckCheck size={14} className="text-gray-400" />;
    if (status === "SEEN") return <CheckCheck size={14} className="text-blue-500" />;
    return null;
  };

  const UserAvatar = ({ user }) => (
    <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
      {user?.firstname?.charAt(0).toUpperCase() || "?"}
      {user?.status === "ONLINE" && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex gap-4 font-semibold">
            <button className="text-blue-600">Chats</button>
          </div>
          <button>⋮</button>
        </div>

        <div className="p-3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border p-2 text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map(u => (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
                selectedUser?.id === u.id ? "bg-gray-100" : ""
              }`}
            >
              <UserAvatar user={u} />
              <div className="flex-1">
                <div className="font-semibold">
                  {u.firstname} {u.lastname}
                </div>
                <div
                  className={`text-sm truncate ${
                    u.status === "ONLINE" ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {u.status === "ONLINE" ? "Online" : "Offline"}
                </div>
              </div>
              <div className="text-xs text-gray-400">{dayjs().format("HH:mm")}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <UserAvatar user={selectedUser} />
                <div>
                  <div className="font-semibold">
                    {selectedUser.firstname} {selectedUser.lastname}
                  </div>
                  <div
                    className={`text-xs ${
                      selectedUser.status === "ONLINE" ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {selectedUser.status === "ONLINE" ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50">
              <ul className="space-y-5">
                {messages.map(m =>
                  m.senderId === currentUserId ? (
                    // Sent
                    <li key={m.id} className="flex ms-auto gap-x-2 sm:gap-x-4">
                      <div className="grow text-end space-y-3">
                        <div className="inline-flex flex-col justify-end">
                          <div className="inline-block bg-blue-600 rounded-2xl p-4 shadow">
                            <p className="text-sm text-white">{m.text}</p>
                          </div>
                          <span className="mt-1.5 ms-auto flex items-center gap-x-1 text-xs">
                            {renderStatus(m.status)}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 inline-flex items-center justify-center size-9 rounded-full bg-gray-600">
                        <span className="text-sm font-medium text-white">ME</span>
                      </span>
                    </li>
                  ) : (
                    // Received
                    <li key={m.id} className="max-w-lg flex gap-x-2 sm:gap-x-4 me-11">
                      <UserAvatar user={selectedUser} />
                      <div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow">
                          <p className="text-sm text-gray-800">{m.text}</p>
                        </div>
                        <span className="mt-1.5 flex items-center gap-x-1 text-xs text-gray-400">
                          {renderStatus(m.status)}
                        </span>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t">
              <input
                className="flex-1 border rounded-lg p-2 text-sm"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600"
              >
                ➤
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chat
          </div>
        )}
      </div>
    </div>
  );
}

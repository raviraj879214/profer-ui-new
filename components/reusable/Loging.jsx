"use client";
import { useEffect, useState } from "react";

export function ActivityLog() {
  const [log, setLog] = useState([]);

  const fetchLog = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-activity-log`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
      },
    });

    if (res.ok) {
      const result = await res.json();
      // Sort in descending order by createdAt
      const sortedLogs = (result.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLog(sortedLogs);
    }
  };

  useEffect(() => {
    fetchLog();
  }, []);

  return (
    <div>
      {log.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No activity found</p>
      ) : (
        <div className="relative">
          {/* Vertical Line (gradient & thicker) */}
          <div className="absolute top-0 left-5 w-1 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full h-full"></div>

          {/* Scrollable Container */}
          <div className="max-h-80 overflow-y-auto pr-4">
            <ul className="space-y-8">
              {log.map((entry) => (
                <li
                  key={entry.id}
                  className="relative flex items-start pl-14 group"
                >
                  {/* Glowing Dot with Ring */}
                  <div className="absolute left-0 flex items-center justify-center w-6 h-6 bg-white border-4 border-blue-500 rounded-full shadow-md group-hover:scale-110 transition-transform"></div>
                  {/* Content */}
                  <div className="bg-gray-50 rounded-lg p-3 shadow-sm border group-hover:bg-white transition">
                    <p className="text-gray-800 font-medium">{entry.action}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

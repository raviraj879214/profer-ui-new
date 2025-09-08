"use client";

import { useEffect, useState } from "react";
import {formatDateToUS} from "../../../lib/utils/dateFormatter";




export  function SubscriberTable() {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableMessage, setTableMessage] = useState({ text: "", type: "" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const totalPages = Math.ceil(filteredSubscribers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedSubscribers = filteredSubscribers.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (tableMessage.text) {
      const timer = setTimeout(() => setTableMessage({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [tableMessage]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/subscribers`);
      if (!res.ok) throw new Error("Failed to fetch subscribers");
      const data = await res.json();
      setSubscribers(data);
      setFilteredSubscribers(data);
    } catch (err) {
      console.error(err);
      setTableMessage({ text: "Failed to fetch subscribers", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = subscribers.filter((sub) =>
      sub.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSubscribers(filtered);
    setCurrentPage(1);
  };

  const deleteSubscriber = async (id) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/subscribers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete subscriber");
      setTableMessage({ text: "Subscriber deleted successfully", type: "success" });
      const updated = subscribers.filter((sub) => sub.id !== id);
      setSubscribers(updated);
      setFilteredSubscribers(updated.filter((sub) =>
        sub.email.toLowerCase().includes(search.toLowerCase())
      ));
    } catch (err) {
      console.error(err);
      setTableMessage({ text: "Error deleting subscriber", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {tableMessage.text && (
        <div className={`mb-4 text-sm ${tableMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {tableMessage.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Subscribers</h2>

        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={handleSearch}
          className="w-full sm:w-1/2 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Created At</th>
                <th className="px-2 py-2 text-center">Actions</th>
              </tr>
            </thead>

            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={3} className="text-center py-6">
                    <div className="inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-100">
                {paginatedSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">{sub.email}</td>
                    <td className="px-2 py-2">{formatDateToUS(sub.createdAt)}</td>
                    <td className="px-2 py-2 flex justify-center">
                      <button
                        onClick={() => deleteSubscriber(sub.id)}
                        disabled={submitting}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        {submitting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedSubscribers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-6">
                      No subscribers found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

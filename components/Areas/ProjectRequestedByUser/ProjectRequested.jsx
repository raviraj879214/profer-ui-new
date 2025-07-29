"use client";
import React, { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export function ProjectRequest() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleterow, setDeleterow] = useState(false);
  const [messgae, setMessage] = useState("");

  const [users, setUsers] = useState([]);

  const filteredUsers = users.filter(
    (user) =>
      (filter === "All" || user.status === filter) &&
      ((user.fullName ?? "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedUsers.map((u) => u.id));
    }
  };

  const deleteSelected = async () => {
    setDeleterow(true);
    if (selectedIds.length === 0) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/delete-roofing-request/${selectedIds}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
          setSelectedIds([]);
          setMessage("Selected requests deleted successfully.");
        }
      }
    } catch (err) {
      console.error("Error deleting requests:", err);
    }
    setDeleterow(false);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const fetchRoofRequest = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-roofing-requests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const result = await res.json();
      if (result.status === 200) {
        setUsers(result.data);
      } else {
        console.error("Unexpected response:", result);
      }
    } catch (error) {
      console.error("Error fetching roofing requests:", error);
    }
  };

  useEffect(() => {
    fetchRoofRequest();
  }, []);

  useEffect(() => {
    if (messgae) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [messgae]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Project Requested
          </h1>
          {selectedIds.length > 0 && (
            <button
              onClick={deleteSelected}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
              disabled={deleterow}
            >
              {deleterow ? "Loading..." : `Delete Selected (${selectedIds.length})`}
            </button>
          )}
        </div>
        <p style={{ color: "green" }}>{messgae}</p>

        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === paginatedUsers.length &&
                      paginatedUsers.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Property Type</th>
                <th className="px-4 py-3">Posted Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                    />
                  </td>
                  <td className="px-4 py-4 font-semibold">
                    {user.fullName || "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-pre-line">
                    <span className="text-xs text-gray-600">
                      {user.phone || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-blue-600">
                    {user.email || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {user.propertyType || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-4 space-x-2">
                    <button
                      onClick={() => handleView(user)}
                      className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-xs hover:bg-gray-100"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-6">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Rows per page:</label>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Request Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {selectedUser.fullName && (
                  <div className="border rounded-lg p-4">
                    <dt className="font-semibold text-gray-900">Name</dt>
                    <dd className="text-gray-700">
                      {selectedUser.fullName || "N/A"}
                    </dd>
                  </div>
                )}
                {selectedUser.email && (
                  <div className="border rounded-lg p-4">
                    <dt className="font-semibold text-gray-900">Email</dt>
                    <dd className="text-gray-700">
                      {selectedUser.email || "N/A"}
                    </dd>
                  </div>
                )}
                {selectedUser.phone && (
                  <div className="border rounded-lg p-4">
                    <dt className="font-semibold text-gray-900">Phone</dt>
                    <dd className="text-gray-700">
                      {selectedUser.phone || "N/A"}
                    </dd>
                  </div>
                )}
                {selectedUser.propertyType && (
                  <div className="border rounded-lg p-4">
                    <dt className="font-semibold text-gray-900">
                      Property Type
                    </dt>
                    <dd className="text-gray-700">
                      {selectedUser.propertyType || "N/A"}
                    </dd>
                  </div>
                )}
                {selectedUser.serviceNeeded && (
                  <div className="border rounded-lg p-4">
                    <dt className="font-semibold text-gray-900">
                      Service Needed
                    </dt>
                    <dd className="text-gray-700">
                      {selectedUser.serviceNeeded || "N/A"}
                    </dd>
                  </div>
                )}
                {selectedUser.problemDescription && (
                  <div className="border rounded-lg p-4 sm:col-span-2">
                    <dt className="font-semibold text-gray-900">
                      Description
                    </dt>
                    <dd className="text-gray-700">
                      {selectedUser.problemDescription || "N/A"}
                    </dd>
                  </div>
                )}
                {selectedUser.photoUrls && selectedUser.photoUrls.length > 0 && (
                  <div className="border rounded-lg p-4 sm:col-span-2">
                    <dt className="font-semibold text-gray-900 mb-2">Files</dt>
                    <dd className="space-y-2">
                      {selectedUser.photoUrls.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                          Download File {idx + 1}
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

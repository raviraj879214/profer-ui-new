"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateToUS } from "../../../lib/utils/dateFormatter.js";

export function ProjectRequest() {
  const router = useRouter();

  // ----------------------------
  // STATE
  // ----------------------------
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ----------------------------
  // FETCH ROOFING REQUESTS
  // ----------------------------
  const fetchRoofRequest = async (page = currentPage, limit = pageSize) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        search: searchTerm,
        filter: filter !== "All" ? filter : "",
      }).toString();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-roofing-requests?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const result = await res.json();
      if (result.status === 200) {
        setUsers(result.data);
        setTotalPages(result.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching roofing requests:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoofRequest();
  }, [currentPage, pageSize, searchTerm, filter]);

  // ----------------------------
  // SELECT HANDLERS
  // ----------------------------
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  // ----------------------------
  // DELETE SELECTED
  // ----------------------------
  const deleteSelected = async () => {
    if (!confirm("Are you sure you want to delete the selected item(s)?")) return;
    if (selectedIds.length === 0) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/delete-roofing-request/${selectedIds}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          setMessage("Selected requests deleted successfully.");
          setSelectedIds([]);
          fetchRoofRequest(); // refresh data
        }
      }
    } catch (err) {
      console.error("Error deleting requests:", err);
    }
    setDeleteLoading(false);
  };

  // ----------------------------
  // CREATE PROJECT
  // ----------------------------
  const createProject = async (id) => {
    if (!confirm("Are you sure you want to create this project?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/create-project-request/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
          },
        }
      );
      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) router.push(`/admin/create-project/${result.data}`);
      }
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  // ----------------------------
  // PAGE SIZE CHANGE
  // ----------------------------
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // ----------------------------
  // MESSAGE TIMER
  // ----------------------------
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Project Requested</h1>
          {selectedIds.length > 0 && (
            <button
              onClick={deleteSelected}
              disabled={deleteLoading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              {deleteLoading ? "Deleting..." : `Delete Selected (${selectedIds.length})`}
            </button>
          )}
        </div>

        {message && <p className="text-green-600 mb-4">{message}</p>}

        {/* SEARCH */}
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search by request id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3">RequestID</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Project Title</th>
                <th className="px-4 py-3">Posted Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan="9" className="text-center text-gray-400 py-6">
                    No projects found.
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                    />
                  </td>
                  <td className="text-center py-6 font-semibold">{user.RequestID}</td>
                  <td className="px-4 py-4 font-semibold">{user.fullName || "N/A"}</td>
                  <td className="px-4 py-4 text-xs text-gray-600">{user.phoneNumber || "N/A"}</td>
                  <td className="px-4 py-4 text-xs text-blue-600">{user.emailAddress || "N/A"}</td>
                  <td className="px-4 py-4">{user.projectTitle || "N/A"}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{formatDateToUS(user.createdAt)}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{user.status || "N/A"}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button onClick={() => router.push(`/admin/project-requested/${user.id}`)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td colSpan="9" className="text-center py-6">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Rows per page:</label>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>

              
              <option value={20}>20</option>
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
    </div>
  );
}

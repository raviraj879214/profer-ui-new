"use client";
import React, { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { RejectPopup } from "../../Areas/ProjectRequestedByUser/RejectPopup.jsx";
import { NotesTimeLine } from "../../Areas/ProjectRequestedByUser/Notesmanagent.jsx";
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
  const [pageSize, setPageSize] = useState(5);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [approveCreate, setApproveCreate] = useState(false);
  const [rejectPopup, setRejectPopup] = useState(false);
  const [requestInfo, setRequestInfo] = useState(false);

  // ----------------------------
  // FILTER + PAGINATION
  // ----------------------------
  const filteredUsers = users.filter(
    (user) =>
      (filter === "All" || user.status === filter) &&
      ((user.RequestID ?? "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1); // reset page when search/filter changes
  }, [searchTerm, filter]);

  // ----------------------------
  // FETCH ROOFING REQUESTS
  // ----------------------------
  const fetchRoofRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-roofing-requests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const result = await res.json();
      if (result.status === 200) setUsers(result.data);
    } catch (error) {
      console.error("Error fetching roofing requests:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoofRequest();
  }, []);

  // ----------------------------
  // SELECT HANDLERS
  // ----------------------------
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

  // ----------------------------
  // DELETE SELECTED
  // ----------------------------
  const deleteSelected = async () => {
    if (!confirm("Are you sure you want to delete the selected item(s)?")) return;
    setDeleteLoading(true);
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
    setDeleteLoading(false);
  };

  // ----------------------------
  // CREATE PROJECT
  // ----------------------------
  const createProject = async (id) => {
    if (!confirm("Are you sure you want to create this project?")) return;
    setApproveCreate(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/create-project-request/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    setApproveCreate(false);
  };

  // ----------------------------
  // MODAL HANDLER
  // ----------------------------
  const handleView = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDataFromChild = (value) => {
    setIsModalOpen(false);
    setRejectPopup(false);
    if (value === "reject") setMessage("Project Rejected Successfully");
    if (value === "rejected") fetchRoofRequest();
  };

  // ----------------------------
  // PAGE SIZE CHANGE
  // ----------------------------
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // ----------------------------
  // GROUP FILES BY TYPE
  // ----------------------------
  const groupFilesByType = (files = []) =>
    files.reduce((acc, file) => {
      acc[file.fileType] = acc[file.fileType] || [];
      acc[file.fileType].push(file);
      return acc;
    }, {});

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
                    checked={selectedIds.length === paginatedUsers.length && paginatedUsers.length > 0}
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

            {loading ? (
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td colSpan="9" className="text-center py-6">
                    <div role="status" className="flex justify-center">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 
                          50 100.591C22.3858 100.591 0 78.2051 
                          0 50.5908C0 22.9766 22.3858 0.59082 
                          50 0.59082C77.6142 0.59082 100 22.9766 
                          100 50.5908ZM9.08144 50.5908C9.08144 
                          73.1895 27.4013 91.5094 50 91.5094C72.5987 
                          91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 
                          27.9921 72.5987 9.67226 50 9.67226C27.4013 
                          9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 
                          33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 
                          15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 
                          1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 
                          41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 
                          9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 
                          55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 
                          17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 
                          88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
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
                    <td className="text-center py-6 font-semibold">{user.RequestID}</td>
                    <td className="px-4 py-4 font-semibold">{user.fullName || "N/A"}</td>
                    <td className="px-4 py-4 text-xs text-gray-600">{user.phoneNumber || "N/A"}</td>
                    <td className="px-4 py-4 text-xs text-blue-600">{user.emailAddress || "N/A"}</td>
                    <td className="px-4 py-4">{user.projectTitle || "N/A"}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{formatDateToUS(user.createdAt)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {(() => {
                        const statusMap = {
                          "0": { label: "Need Review", color: "bg-yellow-100 text-yellow-800" },
                          "1": { label: "Created / Approved", color: "bg-green-100 text-green-800" },
                          "2": { label: "Rejected", color: "bg-red-100 text-red-800" },
                        };
                        const status = statusMap[user.status];
                        return status ? (
                          <p className={`${status.color} px-2 py-1 rounded inline-block text-sm font-medium`}>
                            {status.label}
                          </p>
                        ) : null;
                      })()}
                    </td>
                    <td className="px-4 py-4 space-x-2" >
                      <button onClick={() => router.push(`/admin/project-requested/${user.id}`)} style={{ cursor: "pointer" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-gray-400 py-6">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Rows per page:</label>
            <select value={pageSize} onChange={handlePageSizeChange} className="border rounded px-2 py-1 text-sm">
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

      {/* APPROVE LOADING */}
      {approveCreate && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 z-50">
          <svg
            aria-hidden="true"
            className="w-12 h-12 mb-4 text-gray-200 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <p className="text-white text-xl font-semibold">Creating Project...</p>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Modal content */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {(() => {
                  const statusMap = {
                    "0": "Request Need Review",
                    "1": "Request Created / Approved",
                    "2": "Request Rejected",
                  };
                  return `${statusMap[selectedUser.status]} : ${selectedUser.RequestID}`;
                })()}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-lg">✕</button>
            </div>

            {/* Modal body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Full details + files... */}
              {/* ...same as before... */}
            </div>

            {/* Modal actions */}
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              {selectedUser.status === "0" && (
                <>
                  <button
                    onClick={() => createProject(selectedUser.id)}
                    className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-[#1E1E3E] transition"
                  >
                    Approve & Create Project
                  </button>
                  <button
                    onClick={() => setRequestInfo(true)}
                    className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-[#1E1E3E] transition"
                  >
                    Request More Info
                  </button>
                  <button
                    onClick={() => setRejectPopup(true)}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                  >
                    Reject
                  </button>
                </>
              )}
              {(selectedUser.status === "1" || selectedUser.status === "2") && (
                <button
                  onClick={() => setRequestInfo(true)}
                  className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-[#1E1E3E] transition"
                >
                  Requested Logs
                </button>
              )}
            </div>
          </div>

          {rejectPopup && <RejectPopup sendData={handleDataFromChild} id={selectedUser.id} />}
          {requestInfo && (
            <NotesTimeLine
              companyid={selectedUser.id}
              setrequestinfo={setRequestInfo}
              projectstatus={selectedUser.status}
            />
          )}
        </div>
      )}
    </div>
  );
}

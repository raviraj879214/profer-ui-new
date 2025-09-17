"use client";
import React, { useEffect, useState } from "react";

export function Adminservice() {
  const [name, setName] = useState("");
  const [qualifications, setQualifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // <-- for add/update button
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = Math.ceil(qualifications.length / pageSize);
  const [deleterow, setDeleteRow] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [updateMessage, setUpdateMessage] = useState({ text: "", type: "" });
  const [nameError, setNameError] = useState("");

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedQualifications = qualifications.slice(
    startIndex,
    startIndex + pageSize
  );

  useEffect(() => {
    fetchQualifications();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (updateMessage.text) {
      const timer = setTimeout(() => {
        setUpdateMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  const fetchQualifications = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/services/get-services`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setQualifications(data);
        } else if (data.services && Array.isArray(data.services)) {
          setQualifications(data.services);
        } else {
          setQualifications([]);
        }
      })
      .catch((err) => console.error("Error fetching qualifications:", err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setUpdateMessage({
        text: "No auth token found. Please login.",
        type: "error",
      });
      return;
    }

    if (!name.trim()) {
      setNameError("Name is required");
      setTimeout(() => setNameError(""), 5000);
      return;
    }

    setNameError("");
    setSubmitting(true);

    try {
      if (editId) {
        // Update
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/admin/services/update-services/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUpdateMessage({
            text: "Service updated successfully!",
            type: "success",
          });
          setName("");
          setEditId(null);
          fetchQualifications();
        } else {
          setUpdateMessage({
            text: data.message || "Error updating service",
            type: "error",
          });
        }
      } else {
        // Add
        const nameExists = qualifications.some(
          (q) => q.name.toLowerCase() === name.trim().toLowerCase()
        );
        if (nameExists) {
          setUpdateMessage({
            text: "Service name already exists",
            type: "error",
          });
          setSubmitting(false);
          return;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/admin/services/add-services`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: name.trim() }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUpdateMessage({
            text: "Service added successfully!",
            type: "success",
          });
          setName("");
          fetchQualifications();
        } else {
          setUpdateMessage({
            text: data.message || "Error adding service",
            type: "error",
          });
        }
      }
    } catch (err) {
      console.error(err);
      setUpdateMessage({ text: "Server error", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (q) => {
    setEditId(q.id);
    setName(q.name);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedQualifications.map((q) => q.id)); // only visible rows
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (ids) => {
    if (ids.length === 0) {
      setMessage({ text: "No items selected", type: "error" });
      return;
    }

    if (!window.confirm("Are you sure you want to delete the selected services?")) {
      return; // cancel deletion
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ text: "No auth token found. Please login.", type: "error" });
      return;
    }

    setDeleteRow(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/services/delete-services`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids }),
        }
      );

      if (res.ok) {
        setMessage({ text: "Deleted successfully!", type: "success" });
        setQualifications((prev) => prev.filter((q) => !ids.includes(q.id)));
        setSelectedIds([]);
      } else {
        const data = await res.json();
        setMessage({ text: data.message || "Error deleting", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Server error", type: "error" });
    } finally {
      setDeleteRow(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Services</h2>

        {updateMessage.text && (
          <div
            className={`mt-2 mb-4 ${
              updateMessage.type === "success"
                ? "text-green-600"
                : "text-red-800"
            }`}
          >
            {updateMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter service name"
              className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          {nameError && (
            <p className="text-red-600 text-sm mt-1">{nameError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className=" p-3 bg-[#0C0C2D] text-white rounded font-semibold hover:bg-[#1E1E3E] disabled:opacity-50"
          >
            {submitting
              ? editId
                ? "Updating..."
                : "Adding..."
              : editId
              ? "Update"
              : "Add"}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            List of Services
          </h2>

          {selectedIds.length > 0 && (
            <button
              onClick={() => handleDelete(selectedIds)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm mt-4 md:mt-0"
              disabled={deleterow}
            >
              {deleterow
                ? "Deleting..."
                : `Delete Selected (${selectedIds.length})`}
            </button>
          )}
        </div>

        {message.text && (
          <div
            className={`mt-2 mb-2 ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200 text-sm text-left table-fixed">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-2 text-center w-12">
                <input
                  type="checkbox"
                  checked={
                    paginatedQualifications.length > 0 &&
                    paginatedQualifications.every((q) =>
                      selectedIds.includes(q.id)
                    )
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3 w-1/2">Name</th>
              <th className="px-4 py-3 w-1/4 text-center">Edit</th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              <tr>
                <td colSpan={3} className="text-center py-6">
                  <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-gray-100">
              {paginatedQualifications.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="p-2 text-center w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(q.id)}
                      onChange={() => handleSelectOne(q.id)}
                    />
                  </td>
                  <td className="px-4 py-4 w-1/2">{q.name}</td>
                  <td className="px-4 py-4 w-1/4 text-center">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-blue-600 rounded-md p-1 hover:bg-blue-50"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedQualifications.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 py-6">
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-3 py-2 text-sm cursor-pointer"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-700">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";

export function Adminqualification() {
  const [name, setName] = useState("");
  const [qualifications, setQualifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleterow, setDeleteRow] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [updateMessage, setUpdateMessage] = useState({ text: "", type: "" });
  const [nameError, setNameError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = Math.ceil(qualifications.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedQualifications = qualifications.slice(
    startIndex,
    startIndex + pageSize
  );

  // Fetch qualifications on mount
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
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/qualification/getnames`)
      .then((res) => res.json())
      .then((data) => setQualifications(data))
      .catch((err) => console.error("Error fetching qualifications:", err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Name is required");
      setTimeout(() => setNameError(""), 5000);
      return;
    } else {
      setNameError("");
    }

    setSubmitting(true);

    try {
      if (editId) {
        // Update flow
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/admin/qualification/updatename/${editId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          setUpdateMessage({
            text: "Qualification updated successfully!",
            type: "success",
          });
          setName("");
          setEditId(null);
          fetchQualifications();
        } else {
          setUpdateMessage({
            text: data.message || "Error updating qualification",
            type: "error",
          });
        }
      } else {
        // Frontend duplicate check
        const nameExists = qualifications.some(
          (q) => q.name.toLowerCase() === name.trim().toLowerCase()
        );
        if (nameExists) {
          setUpdateMessage({
            text: "Qualification name already exists",
            type: "error",
          });
          return;
        }

        // Add flow
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/admin/qualification/addname`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim() }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          setUpdateMessage({
            text: "Qualification added successfully!",
            type: "success",
          });
          setName("");
          fetchQualifications();
        } else {
          setUpdateMessage({
            text: data.message || "Error adding qualification",
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
      setSelectedIds(paginatedQualifications.map((q) => q.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async (ids) => {
    if (ids.length === 0) {
      setMessage({ text: "No items selected", type: "error" });
      return;
    }

    if (!window.confirm("Are you sure you want to delete the selected items?")) {
      return;
    }

    setDeleteRow(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/qualification/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Qualification</h2>
        </div>

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

        {/* Form */}
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
              placeholder="Enter qualification name"
              className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          {nameError && <p className="text-red-600 text-sm mt-1">{nameError}</p>}

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

      <br />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            List of Qualification
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
            className={`${
              message.type === "success" ? "text-green-600" : "text-red-600"
            } mt-2 mb-2`}
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
                    selectedIds.length === paginatedQualifications.length
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
                      aria-label="Edit"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedQualifications.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-gray-400 py-6"
                  >
                    No qualifications found.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 space-y-3 sm:space-y-0">
          {/* Rows per page */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
            <label
              htmlFor="rowsPerPage"
              className="text-sm text-gray-700"
            >
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-3 py-2 text-sm cursor-pointer"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center space-x-3 text-sm text-gray-700 justify-center w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="min-w-[100px] text-center">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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

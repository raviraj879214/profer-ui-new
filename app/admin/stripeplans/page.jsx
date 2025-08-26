"use client";
import { useEffect, useState } from "react";
import Link from "next/link";





export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [priceId, setPriceId] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleterow, setDeleteRow] = useState(false);
  const [tableMessage, setTableMessage] = useState({ text: "", type: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = Math.ceil(plans.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPlans = plans.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (tableMessage.text) {
      const timer = setTimeout(() => {
        setTableMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [tableMessage]);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ text: "No auth token found. Please login.", type: "error" });
        return;
      }

      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/plans`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      if (data.success) setPlans(data.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setMessage({ text: "Error fetching plans", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ text: "No auth token found. Please login.", type: "error" });
      return;
    }

    if (!priceId.trim()) return setMessage({ text: "Price ID is required", type: "error" });
    setSubmitting(true);

    try {
      const url = editId 
        ? `${process.env.NEXT_PUBLIC_URL}/api/plans/${editId}` 
        : `${process.env.NEXT_PUBLIC_URL}/api/plans`;
      
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ 
          text: editId ? "Plan updated successfully!" : "Plan added successfully!", 
          type: "success" 
        });
        setPriceId("");
        setEditId(null);
        fetchPlans();
      } else {
        setMessage({ text: data.error || "Error saving plan", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Server error", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (plan) => {
    setEditId(plan.id);
    setPriceId(plan.priceId);
  };

  // Checkbox logic
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedPlans.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete selected
  const handleDelete = async (ids) => {
    if (!ids.length) {
      return setTableMessage({ text: "No plans selected", type: "error" });
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setTableMessage({ text: "No auth token found. Please login.", type: "error" });
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${ids.length} plan(s)?`
    );
    if (!confirmDelete) return;

    setDeleteRow(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/plans/delete`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTableMessage({ text: "Deleted successfully!", type: "success" });
        setPlans((prev) => prev.filter((p) => !ids.includes(p.id)));
        setSelectedIds([]);
      } else {
        setTableMessage({ text: data.error || "Error deleting plans", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setTableMessage({ text: "Server error", type: "error" });
    } finally {
      setDeleteRow(false);
    }
  };

  // Toggle plan status
  const handleToggleStatus = async (plan) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTableMessage({ text: "No auth token found. Please login.", type: "error" });
      return;
    }

    const confirmToggle = window.confirm(
      `Do you want to ${plan.status === "active" ? "deactivate" : "activate"} this plan?`
    );
    if (!confirmToggle) return;

    // Update the status in UI immediately (optional)
    const newStatus = plan.status === "active" ? "inactive" : "active";
    setPlans((prev) =>
      prev.map((p) => (p.id === plan.id ? { ...p, status: newStatus } : p))
    );

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/plans/${plan.id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await res.json();
      
      if (!data.success) {
        alert(data.error || "Failed to update status");
        // Revert UI change if failed
        setPlans((prev) =>
          prev.map((p) => (p.id === plan.id ? { ...p, status: plan.status } : p))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
      // Revert UI change if failed
      setPlans((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, status: plan.status } : p))
      );
    }
  };

  return (
    <>
       <nav className="flex mt-10 ml-5" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <Link
                  href="#"
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                >
                 Plans
                </Link>
              </div>
            </li>
          </ol>
        </nav>
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Add / Update Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">{editId ? "Update Plan" : "Add Plan"}</h2>

        {message.text && (
          <div className={`mt-2 mb-4 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={priceId}
            onChange={(e) => setPriceId(e.target.value)}
            placeholder="Enter Price ID"
            className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <br/>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {submitting ? (editId ? "Updating..." : "Adding...") : editId ? "Update" : "Add Plan"}
          </button>
        </form>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Plans</h2>

          {selectedIds.length > 0 && (
            <button
              onClick={() => handleDelete(selectedIds)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm mt-4 md:mt-0"
              disabled={deleterow}
            >
              {deleterow ? "Deleting..." : `Delete Selected (${selectedIds.length})`}
            </button>
          )}
        </div>
       
        {/* Table Messages */}
        {tableMessage.text && (
          <div className={`mt-2 mb-4 ${tableMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {tableMessage.text}
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200 text-sm text-left table-fixed">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-2 text-center w-12">
                <input
                  type="checkbox"
                  checked={paginatedPlans.length > 0 && paginatedPlans.every((p) => selectedIds.includes(p.id))}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3">Price ID</th>
              <th className="px-4 py-3">Product ID</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Interval</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3 w-1/4 text-center">Edit</th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              <tr>
                <td colSpan={12} className="text-center py-6">
                  <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-gray-100">
              {paginatedPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="p-2 text-center w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(plan.id)}
                      onChange={() => handleSelectOne(plan.id)}
                    />
                  </td>
                  <td className="px-4 py-4">{plan.priceId}</td>
                  <td className="px-4 py-4">{plan.productId}</td>
                  <td className="px-4 py-4">{plan.productName}</td>
                  <td className="px-4 py-4">{plan.amount}</td>
                  <td className="px-4 py-4">{plan.currency}</td>
                  <td className="px-4 py-4">{plan.interval}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleStatus(plan)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        plan.status === "active" ? "bg-green-500" : "bg-gray-300"
                      }`}
                      title={plan.status === "active" ? "Deactivate plan" : "Activate plan"}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          plan.status === "active" ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-4">{plan.type || "-"}</td>
                  <td className="px-4 py-4">
                    {plan.image ? <img src={plan.image} alt={plan.productName} className="h-8 w-8 object-contain rounded" /> : "-"}
                  </td>
                  <td className="px-4 py-4">{new Date(plan.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => handleEdit(plan)} className="text-blue-600 rounded-md p-1 hover:bg-blue-50">✏️</button>
                  </td>
                </tr>
              ))}
              {paginatedPlans.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center text-gray-400 py-6">No plans found.</td>
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
    </>
  );
}
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";




export  function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [priceId, setPriceId] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleterow, setDeleteRow] = useState(false);
  const [tableMessage, setTableMessage] = useState({ text: "", type: "" });
 const [submitError, setSubmitError] = useState("");
 const [submitMessage, setSubmitMessage] = useState("");
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = Math.ceil(plans.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPlans = plans.slice(startIndex, startIndex + pageSize);

  const {
    register,
    reset,
    formState: { errors },
     setValue,
  } = useForm();

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

  const handleFetchPlans = async (data) => {
    setSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/plans/fetch-stripe-products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        }
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        throw new Error("Unexpected response format");
      }

      const result = await res.json();

      if (res.ok) {
        reset();
        setSubmitMessage(result.message);

        setTimeout(() => {
          setSubmitMessage("");
        }, 3000);
         fetchPlans();
      } else {
         setSubmitError(result.error || "Failed to fetch plans.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
       
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Add / Update Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* <h2 className="text-2xl font-semibold text-gray-800">{editId ? "Update Plan" : "Add Plan"}</h2> */}

        {submitMessage && (
          <div className="text-green-600 font-medium">{submitMessage}</div>
        )}
        {submitError && (
          <div className="text-red-600 font-medium">{submitError}</div>
        )}
        {/* {message.text && (
          <div className={`mt-2 mb-4 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </div>
        )} */}
        <div className="space-y-4">
          <button
            onClick={handleFetchPlans}
            disabled={submitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {submitting ? "Fetching..." : "Fetch Plans"}
          </button>
        </div>

        {/* <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={priceId}
            onChange={(e) => setPriceId(e.target.value)}
            placeholder="Enter Price ID ex:price_XXXXXXXXXXXXX"
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
        </form> */}
      </div>

      {/* Plans Table */}
   
<div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-6 mt-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Plans</h2>

    {selectedIds.length > 0 && (
      <button
        onClick={() => handleDelete(selectedIds)}
        className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-red-700 text-xs sm:text-sm mt-4 md:mt-0"
        disabled={deleterow}
      >
        {deleterow ? "Deleting..." : `Delete Selected (${selectedIds.length})`}
      </button>
    )}
  </div>

  {/* Table Messages */}
  {tableMessage.text && (
    <div className={`mt-2 mb-4 text-xs sm:text-sm ${tableMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
      {tableMessage.text}
    </div>
  )}

  {/* Scrollable Table Container */}
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm text-left">
      <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
        <tr>
          <th className="p-2 text-center w-10 sm:w-12">
            <input
              type="checkbox"
              checked={paginatedPlans.length > 0 && paginatedPlans.every((p) => selectedIds.includes(p.id))}
              onChange={handleSelectAll}
            />
          </th>
          <th className="px-2 py-2 sm:px-4 sm:py-3">Price ID</th>
          <th className="px-2 py-2 sm:px-4 sm:py-3">Product Name</th>
          <th className="px-2 py-2 sm:px-4 sm:py-3">Amount</th>
          <th className="px-2 py-2 sm:px-4 sm:py-3">Interval</th>
          <th className="px-2 py-2 sm:px-4 sm:py-3">Status</th>
          <th className="px-2 py-2 sm:px-4 sm:py-3">Image</th>
          <th className="px-2 py-2 sm:px-4 sm:py-3">Created At</th>
          <th className="px-2 py-2 sm:px-4 sm:py-3">Description</th>
          {/* <th className="px-2 py-2 sm:px-4 sm:py-3 w-20 sm:w-1/4 text-center">Edit</th> */}
        </tr>
      </thead>

      {loading ? (
        <tbody>
          <tr>
            <td colSpan={10} className="text-center py-6">
              <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody className="divide-y divide-gray-100">
          {paginatedPlans.map((plan) => (
            <tr key={plan.id} className="hover:bg-gray-50">
              <td className="p-2 text-center w-10 sm:w-12">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(plan.id)}
                  onChange={() => handleSelectOne(plan.id)}
                />
              </td>
              <td className="px-2 py-2 sm:px-4 sm:py-4">{plan.priceId}</td>
              <td className="px-2 py-2 sm:px-4 sm:py-4">{plan.productName}</td>
              <td className="px-2 py-2 sm:px-4 sm:py-4">${plan.amount}</td>
              <td className="px-2 py-2 sm:px-4 sm:py-4">{plan.interval}</td>
              <td className="px-2 py-2 sm:px-4 sm:py-4">
                <button
                  onClick={() => handleToggleStatus(plan)}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    plan.status === "active" ? "bg-green-500" : "bg-gray-300"
                  }`}
                  title={plan.status === "active" ? "Deactivate plan" : "Activate plan"}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      plan.status === "active" ? "translate-x-5 sm:translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </td>
              <td className="px-2 py-2 sm:px-4 sm:py-4">
                {plan.image ? (
                  <img src={plan.image} alt={plan.productName} className="h-6 w-6 sm:h-8 sm:w-8 object-contain rounded" />
                ) : (
                  "-"
                )}
              </td>
              <td className="px-2 py-2 sm:px-4 sm:py-4">
                {new Date(plan.createdAt).toLocaleString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </td>
              <td className="px-2 py-2 sm:px-4 sm:py-4 align-middle">
                <div className="max-w-[200px] sm:max-w-[350px] text-gray-700 text-xs sm:text-sm">
                  {plan.description || "-"}
                </div>
              </td>
              {/* <td className="px-2 py-2 sm:px-4 sm:py-4 text-center">
                <button onClick={() => handleEdit(plan)} className="text-blue-600 rounded-md p-1 hover:bg-blue-50">✏️</button>
              </td> */}
            </tr>
          ))}
          {paginatedPlans.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center text-gray-400 py-6 text-xs sm:text-sm">No plans found.</td>
            </tr>
          )}
        </tbody>
      )}
    </table>
  </div>

  {/* Pagination */}
  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 space-y-3 sm:space-y-0">
    <div className="flex items-center space-x-2">
      <label className="text-xs sm:text-sm text-gray-700">Rows per page:</label>
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
          setCurrentPage(1);
        }}
        className="border rounded px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm cursor-pointer"
      >
        {[5, 10, 20, 50].map((size) => (
          <option key={size}>{size}</option>
        ))}
      </select>
    </div>
    <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-700">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="px-2 py-1.5 sm:px-3 sm:py-2 border rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="px-2 py-1.5 sm:px-3 sm:py-2 border rounded disabled:opacity-50"
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
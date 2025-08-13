"use client";
import React, { useEffect, useState } from "react";

export function Adminservice () {
  const [name, setName] = useState("");
  const [qualifications, setQualifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editId, setEditId] = useState(null); // <-- store ID of item being edited
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = Math.ceil(qualifications.length / pageSize);
const [deleterow, setDeleteRow] = useState(false);
 const [message, setMessage] = useState({ text: "", type: "" }); 
 const [updateMessage, setUpdateMessage] = useState({ text: "", type: "" });
 const [nameError, setNameError] = useState("");



// type can be "success" or "error"



const startIndex = (currentPage - 1) * pageSize;
const paginatedQualifications = qualifications.slice(startIndex, startIndex + pageSize);

  // Fetch qualifications on mount
  useEffect(() => {
    fetchQualifications();
  }, []);
useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);

      return () => clearTimeout(timer); // cleanup if message changes before timeout
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
  if (!token) {
    console.error("No auth token found");
    return;
  }

  setLoading(true);

  fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/services/get-services`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      console.log("Response status:", res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Data received:", data);
      if (Array.isArray(data)) {
        setQualifications(data);
      } else if (data.services && Array.isArray(data.services)) {
        setQualifications(data.services);
      } else {
        setQualifications([]);
        console.error("Unexpected data format from API");
      }
    })
    .catch((err) => {
      console.error("Error fetching qualifications:", err);
    })
    .finally(() => setLoading(false));
};


const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    setUpdateMessage({ text: "No auth token found. Please login.", type: "error" });
    return;
  }

  if (!name.trim()) {
    setNameError("Name is required");

    // Clear error after 5 seconds
    setTimeout(() => {
      setNameError("");
    }, 5000);

    return; // stop form submission
  } else {
    setNameError(""); // Clear if valid
  }

  try {
    if (editId) {
      // Update flow
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
        setUpdateMessage({ text: "Service updated successfully!", type: "success" });
        setName("");
        setEditId(null);
        fetchQualifications();
      } else {
        setUpdateMessage({ text: data.message || "Error updating service", type: "error" });
      }
    } else {
      // Frontend duplicate check before add
      const nameExists = qualifications.some(
        (q) => q.name.toLowerCase() === name.trim().toLowerCase()
      );

      if (nameExists) {
        setUpdateMessage({ text: "Service name already exists", type: "error" });
        return; // Prevent submission
      }

      // Add flow
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
        setUpdateMessage({ text: "Service added successfully!", type: "success" });
        setName("");
        fetchQualifications();
      } else {
        setUpdateMessage({ text: data.message || "Error adding service", type: "error" });
      }
    }
  } catch (err) {
    console.error(err);
    setUpdateMessage({ text: "Server error", type: "error" });
  }
};





  const handleEdit = (q) => {
    setEditId(q.id);
    setName(q.name);
  
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(qualifications.map((q) => q.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };
const handleDelete = async (ids) => {
  if (ids.length === 0) {
    setMessage({ text: "No items selected", type: "error" });
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    setMessage({ text: "No auth token found. Please login.", type: "error" });
    return;
  }

  setDeleteRow(true);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/services/delete-services`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });

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




const handlePageSizeChange = (e) => {
  setPageSize(Number(e.target.value));
  setCurrentPage(1); // reset to first page when page size changes
};


  const isAllSelected =
    qualifications.length > 0 &&
    selectedIds.length === qualifications.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
  <h2 className="text-2xl font-semibold text-gray-800">Services</h2>
</div>

{updateMessage.text && (
  <div
    className={`mt-2 mb-4 ${
      updateMessage.type === "success"
        ? "text-green-600"   // changed success color to green for clarity
        : updateMessage.type === "error"
        ? "text-red-800"
        : "text-blue-800"
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
  placeholder="Enter service name"
  className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
/>

          </div>
          { nameError && (
  <p className="text-red-600 text-sm mt-1">{nameError}</p>
)}


          <button
            type="submit"
            className={`${
              editId
                ? "bg-blue-500 hover:bg-green-700"
                : "bg-blue-500 hover:bg-red-700"
            } text-white px-4 py-2 rounded-lg`}
          >
            {editId ? "Update" : "Submit"}
          </button>
        </form>
      </div>
      <br/>

      {/* Table */}
  <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Header */}
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
    {deleterow ? "Deleting..." : `Delete Selected (${selectedIds.length})`}
  </button>
)}




</div>

{/* Message below header and button */}
{message.text && (
  <div
    className={
      message.type === "success"
        ? "text-green-600 mt-2 mb-2"
        : "text-red-600 mt-2 mb-2"
    }
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
              selectedIds.length === paginatedQualifications.length &&
              paginatedQualifications.length > 0
            }
            onChange={handleSelectAll}
          />
        </th>
    
        <th className="px-4 py-3 w-1/2">Name</th>
        <th className="px-4 py-3 w-1/4 text-center">Edit</th>
      </tr>
    </thead>

    {loading ? (
      <tbody className="divide-y divide-gray-100">
        <tr>
          <td colSpan={4} className="text-center py-6">
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  </button>
</td>



          </tr>
        ))}
        {paginatedQualifications.length === 0 && (
          <tr>
            <td colSpan={4} className="text-center text-gray-400 py-6">
              No services found.
            </td>
          </tr>
        )}
      </tbody>
    )}
  </table>


<div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 space-y-3 sm:space-y-0">
  {/* Rows per page */}
  <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
    <label htmlFor="rowsPerPage" className="text-sm text-gray-700">
      Rows per page:
    </label>
    <select
      id="rowsPerPage"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // reset to first page on pageSize change
      }}
      className="border rounded px-3 py-2 text-sm sm:text-base cursor-pointer"
    >
      {[5, 10, 20, 50].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  </div>

  {/* Pagination */}
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
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

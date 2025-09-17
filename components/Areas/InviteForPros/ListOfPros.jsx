"use client";
import React, { useEffect, useState } from "react";
import InviteForPros from "@/components/Areas/InviteForPros/InviteForPros"; // adjust path as needed


export function MyList() {
  const [statusFilter, setStatusFilter] = useState("0"); // 0: Pending, 1: Approved, 2: Rejected
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleterow, setDeleterow] = useState(false);
  const [blockrow, setBlockrow] = useState(false);
  const [unblockrow,setUnBlockrow] = useState(false);

  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState(false);

  // Fetch contacts
  const fetchContacts = async (status) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-pros-list`,
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
        setUsers(result.contacts);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts(statusFilter);
  }, [statusFilter]);

const filteredUsers = (users || []).filter((user) => {
  const fullName = (user.name || "").toLowerCase();
  const email = (user.emailID || "").toLowerCase();
  return (
    fullName.includes(searchTerm.toLowerCase()) ||
    email.includes(searchTerm.toLowerCase())
  );
});


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
     if (!confirm("Are you sure you want to delete the selected item(s)?")) {
        return null; // user pressed Cancel
      }

      const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ text: "No auth token found. Please login.", type: "error" });
      return;
    }
    setDeleterow(true);
    if (selectedIds.length === 0) return;
const idParam = selectedIds.join(",");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/delete-pros/${selectedIds}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
          setSelectedIds([]);
          setMessage("Selected pros deleted successfully.");
        }
      }
    } catch (err) {
      console.error("Error deleting contacts:", err);
    }
    setDeleterow(false);
  };

 const handleEmailReminder = async (user) => {
    
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/email-reminder/${user.id}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ email: user.emailID, name: user.name , projectid : user.projectid == null ? 0 : user.projectid  }),
    });

    if (!res.ok) {
      const text = await res.text(); // get raw text (likely HTML error page)
      console.error("API error response:", text);
      alert("Error sending reminder.");
      return;
    }

    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      const text = await res.text();
      console.error("Failed to parse JSON:", text);
      alert("Unexpected response from server.");
      return;
    }

    //alert("Reminder sent!");
     setMessage(`Reminder email sent to ${user.name}!`);
    setTimeout(() => setMessage(""), 3000);
  } catch (err) {
    console.error("Fetch failed:", err);
    alert("Failed to send reminder.");
  }
};



  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

 
  const handleView = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
         <div className="flex justify-between items-center mb-6">
        </div>
        <InviteForPros onSuccess={fetchContacts}></InviteForPros>
 </div>
 <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 mt-6">
   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">List of Pros</h2>

        {/* Header */}
      
        
        {selectedIds.length > 0 && (
  <div className="mb-4 flex justify-end">
    <button
      onClick={deleteSelected}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
      disabled={deleterow}
    >
      {deleterow
        ? "Loading..."
        : `Delete Selected (${selectedIds.length})`}
    </button>
  </div>
)}
</div>
<p style={{ color: "green" }}>{message}</p>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-sm"
          />
        </div>

        {/* Table */}
<div className="overflow-auto rounded-lg border border-gray-200">
  <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
      <tr>
        <th className="px-4 py-3 text-center">
          <input
            type="checkbox"
            checked={
              selectedIds.length === paginatedUsers.length &&
              paginatedUsers.length > 0
            }
            onChange={toggleSelectAll}
          />
        </th>
        <th className="px-4 py-3 text-center">Name</th>
        <th className="px-4 py-3 text-center">Email</th>
        <th className="px-4 py-3 text-center">Invite Date</th>
        <th className="px-4 py-3 text-center">Reg Status</th>
         <th className="px-4 py-3 text-center">Invited project</th>
        <th className="px-4 py-3 text-center">Email Remainder</th>
      </tr>
    </thead>

    {loading ? (
      <tbody className="divide-y divide-gray-100">
        <tr>
          <td colSpan="6" className="text-center py-6">
            <div role="status" className="flex justify-center">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  d="M93.9676 39.0409C96.393 
                  38.4038 97.8624 35.9116 97.0079 
                  33.5539C95.2932 28.8227 92.871 
                  24.3692 89.8167 20.348C85.8452 
                  15.1192 80.8826 10.7238 75.2124 
                  7.41289C69.5422 4.10194 63.2754 
                  1.94025 56.7698 1.05124C51.7666 
                  0.367541 46.6976 0.446843 41.7345 
                  1.27873C39.2613 1.69328 37.813 
                  4.19778 38.4501 6.62326C39.0873 
                  9.04874 41.5694 10.4717 44.0505 
                  10.1071C47.8511 9.54855 51.7191 
                  9.52689 55.5402 10.0491C60.8642 
                  10.7766 65.9928 12.5457 70.6331 
                  15.2552C75.2735 17.9648 79.3347 
                  21.5619 82.5849 25.841C84.9175 
                  28.9121 86.7997 32.2913 88.1811 
                  35.8758C89.083 38.2158 91.5421 
                  39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </td>
        </tr>
      </tbody>
    ) : (
      <tbody className="divide-y divide-gray-100">
        {paginatedUsers.map((user) => (
          <tr key={user. id } className="hover:bg-gray-50">
            <td className="px-4 py-4 text-center">
              <input
                type="checkbox"
                checked={selectedIds.includes(user. id )}
                onChange={() => toggleSelect(user. id )}
              />
            </td>
            <td className="px-4 py-4 font-medium text-center">{user.name  || "N/A"}</td>
            <td className="px-4 py-4 text-sm text-blue-600 text-center">{user.emailID || "N/A"}</td>
            <td className="px-4 py-4 text-sm text-gray-600 text-center">
              {user.inviteDate
                ? new Date(user.inviteDate).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </td>
                         <td className="px-4 py-4 text-sm text-center">
  {user.Status === 0 ? (
    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
      Pending
    </span>
  ) : user.Status === 1 ? (
    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
      Registered
    </span>
  ) : (
    "N/A"
  )}
</td>

          <td className="text-center">{user.projectname}</td>
          <td className="px-4 py-4 space-x-2 text-center text-center">
  <button
    title="Send Email Reminder"
    onClick={() => handleEmailReminder(user)}
    className={`p-2 rounded hover:bg-gray-100 ${
      user.Status === 1 ? 'cursor-not-allowed' : ''
    }`}
    disabled={user.Status === 1}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-6 w-6 ${
        user.Status === 1 ? 'text-gray-300' : 'text-blue-600'
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  </button>
          </td>



       

          </tr>
        ))}
        {paginatedUsers.length === 0 && (
          <tr>
            <td colSpan="6" className="text-center text-gray-400 py-6">
              No pros found.
            </td>
          </tr>
        )}
      </tbody>
    )}
  </table>
</div>



        {/* <div className="overflow-auto rounded-lg border border-gray-200">
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
                <th className="px-4 py-3">Contact Name</th>
                <th className="px-4 py-3">Contact Email</th>
                <th className="px-4 py-3">Contact Phone</th>
                <th className="px-4 py-3">Contact Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            
           {loading ? (
  <tbody className="divide-y divide-gray-100">
    <tr>
      <td colSpan="7" className="text-center py-6">
        <div role="status" className="flex justify-center">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              d="M93.9676 39.0409C96.393 
                 38.4038 97.8624 35.9116 97.0079 
                 33.5539C95.2932 28.8227 92.871 
                 24.3692 89.8167 20.348C85.8452 
                 15.1192 80.8826 10.7238 75.2124 
                 7.41289C69.5422 4.10194 63.2754 
                 1.94025 56.7698 1.05124C51.7666 
                 0.367541 46.6976 0.446843 41.7345 
                 1.27873C39.2613 1.69328 37.813 
                 4.19778 38.4501 6.62326C39.0873 
                 9.04874 41.5694 10.4717 44.0505 
                 10.1071C47.8511 9.54855 51.7191 
                 9.52689 55.5402 10.0491C60.8642 
                 10.7766 65.9928 12.5457 70.6331 
                 15.2552C75.2735 17.9648 79.3347 
                 21.5619 82.5849 25.841C84.9175 
                 28.9121 86.7997 32.2913 88.1811 
                 35.8758C89.083 38.2158 91.5421 
                 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </td>
    </tr>
  </tbody>
) : (
    <tbody className="divide-y divide-gray-100">
  {paginatedUsers.map((user) => (
    <tr key={user.contactId} className="hover:bg-gray-50">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={selectedIds.includes(user.contactId)}
          onChange={() => toggleSelect(user.contactId)}
        />
      </td>
      <td className="px-4 py-4 font-medium">{user.name || "N/A"}</td>
      <td className="px-4 py-4 text-sm text-blue-600">{user.email || "N/A"}</td>
      <td className="px-4 py-4 text-sm">{user.phone || "N/A"}</td>
      <td className="px-4 py-4 text-sm text-gray-600">
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
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
      <td colSpan="6" className="text-center text-gray-400 py-6">
        No contacts found.
      </td>
    </tr>
  )}
</tbody>

//   <tbody className="divide-y divide-gray-100">
//     {paginatedUsers.map((user) => (
//       <tr key={user.id} className="hover:bg-gray-50">
//         <td className="px-4 py-4">
//           <input
//             type="checkbox"
//             checked={selectedIds.includes(user.id)}
//             onChange={() => toggleSelect(user.id)}
//           />
//         </td>
//         <td className="px-4 py-4">
//           <div className="font-semibold">{user.businessDetails?.companyName || "N/A"}</div>
//           <div className="text-xs text-gray-500">
//             {user.businessDetails?.experienceYears || 0} years • {user.businessDetails?.employeeCount || 0} employees
//           </div>
//         </td>
//         <td className="px-4 py-4">
//           <div className="font-medium">{user.firstname} {user.lastname}</div>
//           <div className="text-xs text-blue-600">{user.email}</div>
//         </td>
//         <td className="px-4 py-4 text-sm text-gray-700">
//           {user.city ? `${user.city}, ${user.state}` : "N/A"}
//         </td>
//         <td className="px-4 py-4 text-sm text-gray-600">
//           {user.createdAt
//             ? new Date(user.createdAt).toLocaleDateString("en-US", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })
//             : "N/A"}
//         </td>
//         <td className="px-4 py-4 text-sm">
//           {user.status === "0" ? (
//             <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
//           ) : user.status === "4" ? (
//             <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Approved</span>
//           ) : (
//             <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Rejected</span>
//           )}
//         </td>
//         <td className="px-4 py-4 space-x-2">
//           <button
//             onClick={() => handleView(user)}
//             className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-xs hover:bg-gray-100"
//           >
//             View
//           </button>
//         </td>
//       </tr>
//     ))}
//     {paginatedUsers.length === 0 && (
//       <tr>
//         <td colSpan="7" className="text-center text-gray-400 py-6">
//           No contacts found.
//         </td>
//       </tr>
//     )}
//   </tbody>
)}

          </table>
        </div> */}

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
     

      {/* View Modal */}
    {isModalOpen && selectedUser && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Contact Details
          </h2>
         
        </div>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-800 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Content */}
    <div className="p-6 overflow-y-auto flex-1 space-y-4">
  <div className="grid grid-cols-2 gap-4">
    {/* First five items take 2 columns grid */}
    <div className="border rounded-lg p-4">
      <dt className="font-semibold text-gray-900">Contact Name</dt>
      <dd className="text-gray-700">{selectedUser.ContactName || "N/A"}</dd>
    </div>
    <div className="border rounded-lg p-4">
      <dt className="font-semibold text-gray-900">Contact Email</dt>
      <dd className="text-blue-600">{selectedUser.ContactEmail || "N/A"}</dd>
    </div>
    <div className="border rounded-lg p-4">
      <dt className="font-semibold text-gray-900">Contact Phone</dt>
      <dd className="text-gray-700">{selectedUser.ContactPhone || "N/A"}</dd>
    </div>
    <div className="border rounded-lg p-4">
      <dt className="font-semibold text-gray-900">Contact Subject</dt>
      <dd className="text-gray-700">{selectedUser.ContactSubject || "N/A"}</dd>
    </div>
    <div className="border rounded-lg p-4">
      <dt className="font-semibold text-gray-900">Contact Date</dt>
      <dd className="text-gray-700">
        {selectedUser.ContactDate
          ? new Date(selectedUser.ContactDate).toLocaleString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A"}
      </dd>
    </div>

    {/* Last item spans both columns */}
    <div className="border rounded-lg p-4 col-span-2">
      <dt className="font-semibold text-gray-900">Contact Message</dt>
      <dd className="text-gray-700 whitespace-pre-wrap">
        {selectedUser.ContactMsg || "N/A"}
      </dd>
    </div>
  </div>
</div>



      {/* Footer */}
      <div className="border-t px-6 py-3 flex justify-end space-x-3">
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
    </div>
  );
}

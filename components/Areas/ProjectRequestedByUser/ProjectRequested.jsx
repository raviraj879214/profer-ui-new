"use client";
import React, { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const [approvecreate,setapprovecreate] = useState(false);




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
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    fetchRoofRequest();
  }, [messgae]);

  useEffect(() => {
    if (messgae) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [messgae]);

  const groupFilesByType = (files = []) => {
    return files.reduce((acc, file) => {
      acc[file.fileType] = acc[file.fileType] || [];
      acc[file.fileType].push(file);
      return acc;
    }, {});
  };


const rejectprojectrequested = async (id) => {
  setLoading(true);
  if (confirm("Are you sure you want to reject?")) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/reject-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        console.error("Failed to reject project request");
        return;
      }

      const result = await res.json();

      if (result.data) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, status: result.data.status } : user
          )
        );
      }
    } catch (error) {
      console.error("Error rejecting project request:", error);
    }
  }
  setLoading(false);
};






     const createproject = async (data)=>{
        setapprovecreate(true);
        // alert(data);

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-project-request/${data}`,{
              method : "GET",
              headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if(res.ok){
          const result = await res.json();
          if(result.status == 200)
          {
              router.push(`/admin/create-project/${result.data}`);

          }
        }
     }



    //  useEffect(()=>{
    //   createproject();
    //  },[approvecreate]);












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
              {deleterow
                ? "Loading..."
                : `Delete Selected (${selectedIds.length})`}
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
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                      />
                    </td>
                     <td className="text-center py-6 font-semibold">{user.RequestID}</td>
                    <td className="px-4 py-4 font-semibold">
                      {user.fullName || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600">
                      {user.phoneNumber || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-xs text-blue-600">
                      {user.emailAddress || "N/A"}
                    </td>
                    <td className="px-4 py-4">{user.projectTitle || "N/A"}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
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


                    <td className="px-4 py-4 space-x-2">
                      <button
                        onClick={() => handleView(user)}
                        className="">
                          
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke="currentColor" className="size-6">
                            <path   d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>

                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-400 py-6">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
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
                {[
                  ["Full Name", selectedUser.fullName],
                  ["Email Address", selectedUser.emailAddress],
                  ["Phone Number", selectedUser.phoneNumber],
                  ["Preferred Contact Method", selectedUser.preferredContactMethod],
                  ["Preferred Calling Time", selectedUser.preferredCallingTime],
                  ["Project Title", selectedUser.projectTitle],
                  ["Project Address", selectedUser.projectAddress],
                  ["Product Type", selectedUser.productType],
                  ["Product Color", selectedUser.productColor],
                  ["Product Preference", selectedUser.productPreference],
                ].map(
                  ([label, value], idx) =>
                    value && (
                      <div key={idx} className="border rounded-lg p-4">
                        <dt className="font-semibold text-gray-900">{label}</dt>
                        <dd className="text-gray-700">{value}</dd>
                      </div>
                    )
                )}

                {selectedUser.projectDetails && (
                  <div className="border rounded-lg p-4 sm:col-span-2">
                    <dt className="font-semibold text-gray-900">
                      Project Details
                    </dt>
                    <dd className="text-gray-700">{selectedUser.projectDetails}</dd>
                  </div>
                )}
                {selectedUser.workDescription && (
                  <div className="border rounded-lg p-4 sm:col-span-2">
                    <dt className="font-semibold text-gray-900">
                      Work Description
                    </dt>
                    <dd className="text-gray-700">{selectedUser.workDescription}</dd>
                  </div>
                )}

                {/* Grouped Files */}
                {selectedUser.files &&
                  selectedUser.files.length > 0 &&
                  Object.entries(groupFilesByType(selectedUser.files)).map(
                    ([type, files]) => (
                      <div key={type} className="border rounded-lg p-4 sm:col-span-2">
                        <dt className="font-semibold text-gray-900 mb-2">
                          {type.toUpperCase()} Files
                        </dt>
                        <dd className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {files.map((file, idx) => {
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                              file.originalName
                            );
                            const isPDF = /\.pdf$/i.test(file.originalName);
                            return (
                              <div
                                key={idx}
                                className="flex flex-col items-start border rounded p-2 bg-gray-50"
                              >
                                {isImage && (
                                  <a
                                    href={`${process.env.NEXT_PUBLIC_URL}${file.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full"
                                  >
                                    <img
                                      src={`${process.env.NEXT_PUBLIC_URL}${file.fileUrl}`}
                                      alt={file.originalName}
                                      className="w-full h-40 object-contain bg-white border rounded"
                                    />
                                  </a>
                                )}
                                {isPDF && (
                                  <iframe
                                    src={`${process.env.NEXT_PUBLIC_URL}${file.fileUrl}`}
                                    title={file.originalName}
                                    className="w-full h-40 border rounded bg-white"
                                  ></iframe>
                                )}
                                <div className="flex items-center space-x-2 mt-2">
                                  <ArrowDownTrayIcon className="w-5 h-5 text-gray-700" />
                                  <a
                                    href={`${process.env.NEXT_PUBLIC_URL}${file.fileUrl}`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm break-words"
                                  >
                                    {file.originalName}
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </dd>
                      </div>
                    )
                  )}
              </dl>
            </div>

             <div className="border-t px-6 py-4 flex justify-end space-x-3">
                {selectedUser.status == "0" && (
                <>
                             <button
                                onClick={() => {
                                  createproject(selectedUser.id);
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                              >
                                Approve & Create Project
                              </button>

                              <button
                                  onClick={() => {
                                    setIsModalOpen(false),
                                    rejectprojectrequested(selectedUser.id);
                                  }}
                                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                >
                                  Reject
                                </button>

                    
                </>

                ) }

               <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Close
                </button>

            </div>
          </div>
          
        </div>
        
      )}  

           
      {approvecreate ? (

        <div className="fixed inset-0 flex flex-col items-center justify-center  bg-opacity-50 z-50">
          <svg
            aria-hidden="true"
            className="w-12 h-12 mb-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>  
          <p className="text-black text-xl font-semibold">Creating Project...</p>
        </div>




      ) : (<div></div>)}
    </div>
  );
}

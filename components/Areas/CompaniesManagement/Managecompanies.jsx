"use client";
import React, { useEffect, useState } from "react";
import {NotesTimeLine} from "../../Areas/CompaniesManagement/Notesmanagent";
import {RejectPopup} from "../../Areas/CompaniesManagement/RejectModal";
import {BlockPopup} from "../../Areas/CompaniesManagement/BlockModal";
import {CompanyInfoTimeLine} from "../../Areas/CompaniesManagement/Companyinfo";
import VerifiedLog from "../../../public/images/4.png";
import Image from "next/image";
import {formatDateToUS} from "../../../lib/utils/dateFormatter";
import { useRouter } from "next/navigation";

export function CompanyManagement() {
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
  const [rejectrow , setrejectrow] = useState(false);
  const router = useRouter();




  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState(false);


  const [NotePopup,setNotePopup] = useState(false);
  const [companiesid,setcompaniesid] = useState(0);


  const [rejectmodal,setrejectmodal] = useState(false);
  const [blockmodal,setblockmodal] = useState(false);


  const [companyinfomodal , setcompanyinfomodal] = useState(false);

  // Fetch companies
  const fetchCompanies = async (status) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-companies-list/${status}`,
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
        setUsers(result.comapniesregisteration);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies(statusFilter);
  }, [statusFilter]);

  const filteredUsers = users.filter((user) =>
    (user.companyName + " " + user.lastname)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
    debugger;
      if (!confirm("Are you sure you want to approve the selected item(s)?")) {
        return null; // user pressed Cancel
      }

    setDeleterow(true);
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/approve-companies/${selectedIds}`,
        {
          method: "POST",
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
          setMessage("Selected companies approved successfully.");
        }
      }
    } catch (err) {
      console.error("Error deleting companies:", err);
    }
    setDeleterow(false);
  };


    const RejectSelected = async () => {
    debugger;
      if (!confirm("Are you sure you want to reject the selected item(s)?")) {
        return null; // user pressed Cancel
      }



    setrejectrow(true);
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/reject-companies/${selectedIds}`,
        {
          method: "POST",
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
          setMessage("Selected companies rejected successfully.");
        }
      }
    } catch (err) {
      console.error("Error deleting companies:", err);
    }
    setrejectrow(false);
  };


  

  const blockedSelected = async () => {
    debugger;
      if (!confirm("Are you sure you want to block the selected item(s)?")) {
        return null; // user pressed Cancel
      }
    setBlockrow(true);
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/block-companies/${selectedIds}`,
        {
          method: "POST",
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
          setMessage("Selected companies blocked successfully.");
        }
      }
    } catch (err) {
      console.error("Error deleting companies:", err);
    }
    setBlockrow(false);
  };


  
  const unblockSelected = async () => {
    debugger;
      if (!confirm("Are you sure you want to un-block the selected item(s)?")) {
        return null; // user pressed Cancel
      }
    setUnBlockrow(true);
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/un-block-companies/${selectedIds}`,
        {
          method: "POST",
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
          setMessage("Selected companies un blocked successfully.");
        }
      }
    } catch (err) {
      console.error("Error deleting companies:", err);
    }
    setUnBlockrow(false);
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

   const statusLabels = { "-1": "Free Trial", 0: "Pending", 4: "Approved", 5: "Blocked" , 6 : "Expired" , 7 : "Rejected" };


    const approvesingle = (id)=>{
        
    }

    const blocksingle = (data)=>{
       
    }

    const unblocksingle = (data)=>{
     
    }


  const handleDataFromChild = (value) => {
    setrejectmodal(false);   
    debugger;

    if(value == "reject"){
      setIsModalOpen(false);
     setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
      setMessage("Selected companies rejected successfully.");
    }
  };
    
  const handleDataBlockChild= (value) =>{
    debugger;
    setblockmodal(false);

    if(value == "block"){
      setIsModalOpen(false);
      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
      setMessage("Selected companies blocked successfully.");
    }
  }












  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          {[
            { label: "Free Trial", value: "-1" },
            { label: "Pending", value: "0" },
            { label: "Approved", value: "4" },
            { label: "Blocked", value: "5" },
            { label: "Expired", value: "6" },
            { label: "Rejected", value: "7" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setSelectedIds([]);
                setCurrentPage(1);
              }}
              className={`pb-2 px-4 text-sm font-medium ${
                statusFilter === tab.value
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">

          

          Companies ({statusLabels[statusFilter]})


          </h1>
         {selectedIds.length > 0 && (
  <>
    {statusFilter === "0" && (
  <div className="flex gap-3">
    {/* Approve Button */}
    <button
      onClick={deleteSelected}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
      disabled={deleterow}
    >
      {deleterow ? "Loading..." : `Approve Selected (${selectedIds.length})`}
    </button>

    {/* Block Button */}
    {/* <button
      onClick={RejectSelected}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
      disabled={blockrow}
    >
      {rejectrow ? "Loading..." : `Reject Selected (${selectedIds.length})`}
    </button> */}
  </div>
)}


    
   
  </>
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
            style={{display : "block" }}
          />
        </div>

        {/* Table */}
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
                <th className="px-4 py-3">Company Info</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">certnVerification</th>
                <th className="px-4 py-3">Subscription Details</th>
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
        <td className="px-4 py-4">
          <div className="font-semibold">{user.businessDetails?.companyName || "N/A"}</div>
          <div className="text-xs text-gray-500">
            {user.businessDetails?.experienceYears || "Not Added"}  
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="font-medium">{user.firstname} {user.lastname}</div>
          <div className="text-xs text-blue-600">{user.email}</div>
        </td>
        <td className="px-4 py-4 text-sm text-gray-700">
          {user.city ? `${user.city}, ${user.state}` : "N/A"}
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">
          {/* {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A"} */}

           {formatDateToUS(user.createdAt)}
        </td>
        
       <td className="px-4 py-4 text-sm">
  {user.status === "-1" ? (
    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Free Trial</span>
  ) : user.status === "0" ? (
    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
  ) : user.status === "4" ? (
    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Approved</span>
  ) : user.status === "5" ? (
    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Blocked</span>
  ) : user.status === "6" ? (
    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Expired</span>
  ) : (
    <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs">Rejected</span>
  )}
</td>

        <td className={`px-4 py-4 font-medium ${
          user.verifiedStatus === 1 ? "text-green-700 bg-green-100" : "text-red-700"
        } rounded-full text-center`}>
          <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                user.verifiedStatus == 0
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {user.verifiedStatus == 0 ? "UnVerified" : "Verified"}
            </span>

        </td>
              <td className="px-4 py-4 space-x-2">
           {user.status === "-1" ? (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                Free Trial
              </span>
            ) : (
              <button
                onClick={() =>
                  router.push(`/admin/subscription-details?userId=${user.id}`)
                }
                className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-xs hover:bg-gray-100"
              >
                View
              </button>
            )}
         </td>

        {/* <td className="px-4 py-4 space-x-2">
          <button
            onClick={() => {handleView(user); toggleSelect(user.id)}}
            className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-xs hover:bg-gray-100"
          >
            View
          </button>
        </td> */}
        <td>
          <button
            onClick={() =>router.push(`/admin/companies/${user.id}`) }
            className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-xs hover:bg-gray-100">
            View
          </button>
        </td>
      </tr>
    ))}
    {paginatedUsers.length === 0 && (
      <tr>
        <td colSpan="7" className="text-center text-gray-400 py-6">
          No companies found.
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

      {/* View Modal */}


    {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  {selectedUser.businessDetails?.companyName || "Company Details"}
                  
                  {selectedUser.verifiedStatus == 1 && <Image src={VerifiedLog} alt="Verified Logo" width={24} height={24} />}
                </h2>
              
              </div>
              <button
                onClick={() => {
                setIsModalOpen(false), setSelectedIds([]),  setNotePopup(false) , setrejectmodal(false) 
                }}
                className="text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>
            </div>
            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {selectedUser.rejectReason && (
                    <div className="border rounded-lg p-4 sm:col-span-2">
                      <dt className="font-semibold text-gray-900">Rejected Reason</dt>
                      <dd className="text-gray-700">{selectedUser.rejectReason}</dd>
                    </div>
                  )}

                  {selectedUser.blockReason && (
                    <div className="border rounded-lg p-4 sm:col-span-2">
                      <dt className="font-semibold text-gray-900">Blocked Reason</dt>
                      <dd className="text-gray-700">{selectedUser.blockReason}</dd>
                    </div>
                  )}
                
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <dt className="font-semibold text-gray-900">Full Name</dt>
                  <dd className="text-gray-700">
                    {selectedUser.firstname} {selectedUser.lastname}
                  </dd>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="font-semibold text-gray-900">Joined</dt>
                  <dd className="text-gray-700">
                    {/* {new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })} */}
                    {formatDateToUS(selectedUser.createdAt)}
                  </dd>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="font-semibold text-gray-900">Email</dt>
                  <dd className="text-blue-600">{selectedUser.email}</dd>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="font-semibold text-gray-900">Phone</dt>
                  <dd className="text-gray-700">
                    {selectedUser.businessDetails?.companyPhone || "N/A"}
                  </dd>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="font-semibold text-gray-900">Location</dt>
                  <dd className="text-gray-700">
                    {selectedUser.city}, {selectedUser.state} {selectedUser.zipCode}
                  </dd>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="font-semibold text-gray-900">Pro Verified</dt>
                  <dd className="text-gray-700">
                   <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedUser.verifiedStatus == 0
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {selectedUser.verifiedStatus == 0 ? "UnVerified" : "Verified"}
                    </span>


                  </dd>
                </div>
              </div>
              {/* Business Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <dt className="font-semibold text-gray-900">EIN</dt>
                  <dd className="text-gray-700">
                    {selectedUser.businessDetails?.ein || "N/A"}
                  </dd>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="font-semibold text-gray-900">Owner</dt>
                  <dd className="text-gray-700">
                    {selectedUser.businessDetails?.ownerFirstName}{" "}
                    {selectedUser.businessDetails?.ownerLastName}
                    <br />
                    {selectedUser.businessDetails?.ownerEmail}
                  </dd>
                </div>
               <div className="border rounded-lg p-4 sm:col-span-2">
  <dt className="font-semibold text-gray-900 mb-2">Services</dt>
  <dd className="flex flex-wrap gap-2">
    {selectedUser.businessDetails?.services
      ? JSON.parse(selectedUser.businessDetails.services).map((service, idx) => (
          <span
            key={idx}
            className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
          >
            {service}
          </span>
        ))
      : "N/A"}
  </dd>
</div>

<div className="border rounded-lg p-4 sm:col-span-2">
  <dt className="font-semibold text-gray-900 mb-2">Qualifications</dt>
  <dd className="flex flex-wrap gap-2">
    {selectedUser.businessDetails?.qualifications
      ? JSON.parse(selectedUser.businessDetails.qualifications).map((qualification, idx) => (
          <span
            key={idx}
            className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
          >
            {qualification}
          </span>
        ))
      : "N/A"}
  </dd>
</div>

              </div>
              {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company Logo */}
        <div className="border rounded-lg p-4">
          <dt className="font-semibold text-gray-900">Company Logo</dt>
          <dd className="relative">
            {selectedUser.businessDetails?.companyLogo ? (
              <div className="flex items-center">
                {selectedUser.businessDetails.companyLogo.toLowerCase().endsWith(".pdf") ? (
                  <div className="relative">
                    <embed
                      src={selectedUser.businessDetails.companyLogo}
                      type="application/pdf"
                      className="w-32 h-32 mt-2 border rounded-lg"
                    />
                    <button
                      onClick={() => window.open(selectedUser.businessDetails.companyLogo, '_blank')}
                      className="absolute top-1 right-1 text-gray-600 hover:text-gray-900"
                      title="View in new tab"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={selectedUser.businessDetails.companyLogo}
                      alt="Logo"
                      className="w-24 h-24 rounded-lg border object-cover mt-2"
                    />
                    <button
                      onClick={() => window.open(selectedUser.businessDetails.companyLogo, '_blank')}
                      className="absolute top-1 right-1 text-gray-600 hover:text-gray-900"
                      title="View in new tab"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              "No logo"
            )}
          </dd>
        </div>
        {/* Owner License */}
        <div className="border rounded-lg p-4">
          <dt className="font-semibold text-gray-900">Owner License</dt>
          <dd className="relative">
            {selectedUser.businessDetails?.ownerLicense ? (
              <div className="flex items-center">
                {selectedUser.businessDetails.ownerLicense.toLowerCase().endsWith(".pdf") ? (
                  <div className="relative">
                    <embed
                      src={selectedUser.businessDetails.ownerLicense}
                      type="application/pdf"
                      className="w-32 h-32 mt-2 border rounded-lg"
                    />
                    <button
                      onClick={() => window.open(selectedUser.businessDetails.ownerLicense, '_blank')}
                      className="absolute top-1 right-1 text-gray-600 hover:text-gray-900"
                      title="View in new tab"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={selectedUser.businessDetails.ownerLicense}
                      alt="License"
                      className="w-24 h-24 rounded-lg border object-cover mt-2"
                    />
                    <button
                      onClick={() => window.open(selectedUser.businessDetails.ownerLicense, '_blank')}
                      className="absolute top-1 right-1 text-gray-600 hover:text-gray-900"
                      title="View in new tab"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              "No license"
            )}
          </dd>
        </div>
      </div>
             
              {/* Credentials */}
            {selectedUser.credentials && selectedUser.credentials.length > 0 && (
        <div className="border rounded-lg p-4">
          <dt className="font-semibold text-gray-900">Credentials</dt>
          <div className="mt-3 space-y-4">
            {Object.entries(
              selectedUser.credentials.reduce((acc, cred) => {
                if (!acc[cred.section]) acc[cred.section] = [];
                acc[cred.section].push(cred);
                return acc;
              }, {})
            ).map(([section, creds]) => (
              <div key={section}>
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  {section}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {creds.map((cred) => {
                    const fileUrl = `${process.env.NEXT_PUBLIC_URL}${cred.fileUrl}`;
                    const isPDF = fileUrl.toLowerCase().endsWith(".pdf");
                    return (
                      <div
                        key={cred.id}
                        className="border rounded-lg p-2 flex flex-col items-center text-center"
                      >
                        <div className="w-28 h-36 flex items-center justify-center">
                          {isPDF ? (
                            <embed
                              src={fileUrl}
                              type="application/pdf"
                              className="w-full h-full border rounded bg-gray-100 object-contain"
                            />
                          ) : (
                            <img
                              src={fileUrl}
                              alt={cred.name}
                              className="w-full h-full object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between w-full mt-2">
                          <p className="text-sm text-gray-700 text-left break-words flex-1">
                            {cred.name}
                          </p>
                          <button
                            onClick={() => window.open(fileUrl, '_blank')}
                            className="text-gray-600 hover:text-gray-900 ml-2 flex-shrink-0"
                            title="View in new tab"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                       <p className="text-xs font-medium mt-1 flex items-center gap-2">
  {cred.expirationDate ? (
    (() => {
      const expDate = new Date(cred.expirationDate);
      const today = new Date();
      const soon = new Date();
      soon.setDate(today.getDate() + 30);

      if (expDate < today) {
        return (
          <>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold">
              Expired
            </span>
            <span>{formatDateToUS(cred.expirationDate)}</span>
          </>
        );
      } else if (expDate < soon) {
        return (
          <>
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-semibold">
              Expires Soon
            </span>
            <span>{formatDateToUS(cred.expirationDate)}</span>
          </>
        );
      } else {
        return (
          <>
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
              Valid
            </span>
            <span>{formatDateToUS(cred.expirationDate)}</span>
          </>
        );
      }
    })()
  ) : (
    <span className="text-gray-500">N/A</span>
  )}
</p>


                      </div>
                      
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
              )}
            </div>
            {/* Footer */}
            <div className="border-t px-6 py-3 flex justify-end space-x-3">
                 {selectedUser.status === "0" && (
                    <>
                      <button className="bg-gray-900 text-white px-3 py-1 rounded" onClick={() => {deleteSelected();setIsModalOpen(false);}}>{deleterow ? "Approving .." : "Approve"}</button>


                      <button className="bg-red-500 text-white px-3 py-1 rounded ml-2" onClick={()=>{
                        setrejectmodal(true);
                        
                      }}>{deleterow ? "Rejecting..." : "Reject"}</button>
                    </>
                  )}


                  {selectedUser.status === "4" && (
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={()=> {
                        setblockmodal(true);
                    }}>{deleterow ? "Blocking..." : "Block"}</button>
                  )}


                  
                  {selectedUser.status === "5" && (
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={()=> {
                         unblockSelected();
                        setIsModalOpen(false);
                    }}>{deleterow ? "UnBlocking..." : "UnBlock"}</button>
                  )}

               <button
                onClick={() => {
                 setcompanyinfomodal(true)
                }}
                className="bg-gray-900 text-white px-4 py-2 rounded ">
                Request More Info
              </button>

               <button
                onClick={() => {
                  setNotePopup(true),
                  setcompaniesid(selectedUser.id)
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-300">
                Notes
              </button>
             
            </div>
          </div>



           {NotePopup && (<NotesTimeLine companyid={companiesid} setNotePopup={setNotePopup}></NotesTimeLine>)}

           {rejectmodal && <RejectPopup  sendData={handleDataFromChild} userid ={selectedUser.id}   />}
           {blockmodal && <BlockPopup sendData={handleDataBlockChild} userid ={selectedUser.id} />}    
            
           {companyinfomodal && <CompanyInfoTimeLine companyid={selectedUser.id} setcompanyinfomodal={setcompanyinfomodal} projectstatus={selectedUser.status} />}     


        </div>
    )}
   




    </div>
  );
}

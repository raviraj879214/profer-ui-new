"use client";
import React, { useEffect, useState } from "react";
import { NotesTimeLine } from "../../Areas/CompaniesManagement/Notesmanagent";
import { RejectPopup } from "../../Areas/CompaniesManagement/RejectModal";
import { BlockPopup } from "../../Areas/CompaniesManagement/BlockModal";
import { CompanyInfoTimeLine } from "../../Areas/CompaniesManagement/Companyinfo";
import VerifiedLog from "../../../public/images/4.png";
import Image from "next/image";
import { formatDateToUS } from "../../../lib/utils/dateFormatter";
import { useRouter } from "next/navigation";

export function CompanyManagement() {
  const [statusFilter, setStatusFilter] = useState("0");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleterow, setDeleterow] = useState(false);
  const [blockrow, setBlockrow] = useState(false);
  const [unblockrow, setUnBlockrow] = useState(false);
  const [rejectrow, setrejectrow] = useState(false);
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [NotePopup, setNotePopup] = useState(false);
  const [companiesid, setcompaniesid] = useState(0);

  const [rejectmodal, setrejectmodal] = useState(false);
  const [blockmodal, setblockmodal] = useState(false);

  const [companyinfomodal, setcompanyinfomodal] = useState(false);

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

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const statusLabels = {
    "-1": "Free Trial",
    0: "Pending",
    4: "Approved",
    5: "Blocked",
    6: "Expired",
    7: "Rejected",
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
      <div className="bg-white rounded-2xl shadow-md p-3 sm:p-6 lg:p-8">
        {/* Tabs */}
        <div className="w-full overflow-x-auto">
          <div className="flex gap-x-3 sm:gap-x-6 md:gap-x-8 mb-4 sm:mb-6 border-b">
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
                className={`pb-2 px-2 sm:px-4 text-sm sm:text-base font-medium whitespace-nowrap transition ${
                  statusFilter === tab.value
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Companies ({statusLabels[statusFilter]})
          </h1>
        </div>

        {/* Success message */}
        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

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

        {/* Table Wrapper */}
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[800px] divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-3 sm:px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === paginatedUsers.length &&
                      paginatedUsers.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-3 sm:px-4 py-3">Company Info</th>
                <th className="px-3 sm:px-4 py-3">Contact</th>
                <th className="px-3 sm:px-4 py-3">Location</th>
                <th className="px-3 sm:px-4 py-3">Joined</th>
                <th className="px-3 sm:px-4 py-3">Status</th>
                <th className="px-3 sm:px-4 py-3">Certn Verification</th>
                <th className="px-3 sm:px-4 py-3">Subscription</th>
                <th className="px-3 sm:px-4 py-3">Actions</th>
              </tr>
            </thead>

            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="9" className="text-center py-6">
                    <div role="status" className="flex justify-center">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-200 animate-spin fill-blue-600"
                        viewBox="0 0 100 101"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051..."
                          fill="currentColor"
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
                    <td className="px-3 sm:px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                      />
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="font-semibold text-sm sm:text-base">
                        {user.businessDetails?.companyName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.businessDetails?.experienceYears || "Not Added"}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="font-medium text-sm">
                        {user.firstname} {user.lastname}
                      </div>
                      <div className="text-xs text-blue-600">{user.email}</div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-gray-700">
                      {user.city ? `${user.city}, ${user.state}` : "N/A"}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-600">
                      {formatDateToUS(user.createdAt)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-xs">
                      {user.status === "-1" ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          Free Trial
                        </span>
                      ) : user.status === "0" ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          Pending
                        </span>
                      ) : user.status === "4" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Approved
                        </span>
                      ) : user.status === "5" ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                          Blocked
                        </span>
                      ) : user.status === "6" ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.verifiedStatus == 0
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.verifiedStatus == 0 ? "Unverified" : "Verified"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      {user.status === "-1" ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Free Trial
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/subscription-details?userId=${user.id}`
                            )
                          }
                          className="border border-gray-300 text-gray-700 rounded-md px-2 py-1 text-xs hover:bg-gray-100"
                        >
                          View
                        </button>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <button
                        onClick={() =>
                          router.push(`/admin/companies/${user.id}`)
                        }
                        className="border border-gray-300 text-gray-700 rounded-md px-2 py-1 text-xs hover:bg-gray-100"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center text-gray-400 py-6"
                    >
                      No companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
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
    </div>
  );
}

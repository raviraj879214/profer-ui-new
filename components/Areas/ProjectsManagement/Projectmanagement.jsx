"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon , EyeIcon  } from "@heroicons/react/24/outline";


const statusLabels = {
   
  0: "Not Started",
  1: "Auction Active",
  2: "Auction Completed",
  3 : "Draft"
};

export function Projectmanagement() {
  const router = useRouter();

  // State
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
  const [bidList, setBidList] = useState([]);

  // Expanded bids set (bid ids)
  const [expandedBids, setExpandedBids] = useState(new Set());

  // Logs mapped by bid ID
  const [logBidsMap, setLogBidsMap] = useState({});

  // Fetch project list
  const fetchProjectsList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-project-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          setProjects(result.data);
        }
      } else {
        console.error("Failed to fetch projects", res.status);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjectsList();
  }, []);

  // Filter and search
  const filteredProjects = projects.filter((project) => {
    const projectStatusLabel = statusLabels[project.status];
    const matchesStatus = filter === "All" || projectStatusLabel === filter;
    const matchesSearch =
      project.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + rowsPerPage);

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let end = start + maxPagesToShow - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Select checkbox handlers
  const handleSelect = (id) => {
    const newSelected = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    setSelected(newSelected);
  };

  // Select all on current page
  const handleSelectAllCurrentPage = () => {
    const allIds = paginatedProjects.map((p) => p.id);
    const allSelected = allIds.every((id) => selected.includes(id));
    if (allSelected) {
      // remove all current page ids from selected
      setSelected((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      // add all current page ids to selected (avoid duplicates)
      setSelected((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  // Delete selected projects
  const deleteSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selected.length} project(s)?`)) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/delete-project-list/${selected}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          setSelected([]);
          await fetchProjectsList();
          setMessage("Selected projects deleted successfully.");
        } else {
          setMessage("Failed to delete projects.");
        }
      } else {
        setMessage("Failed to delete projects.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error deleting projects.");
    }
    setDeleteLoading(false);

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  // Update project status
  const updatestatus = async (projectid, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/update-project-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: parseInt(newStatus),
          projectid: parseInt(projectid),
        }),
      });

      const result = await res.json();

      if (res.ok && result.status === 200) {
        setMessage("Project status updated");
        setProjects((prev) =>
          prev.map((p) => (p.id === projectid ? { ...p, status: parseInt(newStatus) } : p))
        );
      } else {
        setMessage("Failed to update project status");
        console.error("Failed to update status:", result.message);
      }
    } catch (err) {
      setMessage("Error updating project status");
      console.error(err);
    }

    setTimeout(() => setMessage(""), 2000);
  };

  // Modal open/close
  const openModal = (project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const closeModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  // Fetch bids and open bids modal
  const fetchBidList = async (projectId) => {
    setIsBidsModalOpen(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-bid-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projecId: projectId }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          setBidList(result.data);
        } else {
          setBidList([]);
        }
      }
    } catch (err) {
      console.error(err);
      setBidList([]);
    }
    // Clear expanded bids and logs when opening bids modal fresh
    setExpandedBids(new Set());
    setLogBidsMap({});
  };

  // Toggle expand logs for a bid
  const toggleExpand = async (projectId, proId, bidId) => {
    setExpandedBids((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bidId)) {
        newSet.delete(bidId);
      } else {
        newSet.add(bidId);
      }
      return newSet;
    });

    // Only fetch logs if not already fetched for this bidId
    if (!logBidsMap[bidId]) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/get-logs-bids-admin/${projectId}/${proId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const result = await res.json();
          if (result.status === 200) {
            setLogBidsMap((prev) => ({
              ...prev,
              [bidId]: result.data,
            }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
          <div className="flex gap-3">
            {selected.length > 0 && (
              <button
                onClick={deleteSelected}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Loading..." : `Delete Selected (${selected.length})`}
              </button>
            )}
            <button
              className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700"
              onClick={() => router.push("/admin/create-project")}
            >
              + Add Project
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-40"
            aria-label="Filter projects by status"
          >
            <option value="All">All</option>
            <option value="Not Started">Not Started</option>
            <option value="Auction Active">Auction Active</option>
            <option value="Auction Completed">Auction Completed</option>
          </select>

          <input
            type="search"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-[200px]"
            aria-label="Search projects"
          />

          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32"
            aria-label="Select rows per page"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>

        {/* Messages */}
        {message && (
          <p
            className={`p-1 mt-2 text-sm font-medium ${
              message.toLowerCase().includes("updated") ? "text-green-600" : "text-red-600"
            }`}
            role="alert"
          >
            {message}
          </p>
        )}

        {/* Table */}
        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-2">
                  <input
                    type="checkbox"
                    aria-label="Select all projects on current page"
                    checked={
                      paginatedProjects.length > 0 &&
                      paginatedProjects.every((p) => selected.includes(p.id))
                    }
                    onChange={handleSelectAllCurrentPage}
                  />
                </th>
                <th className="px-4 py-3">Project Info</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Timeline</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">View Bids</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            {loading ? (
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td colSpan={9} className="text-center py-6">
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
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-400 py-6">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select project ${project.projectTitle}`}
                          checked={selected.includes(project.id)}
                          onChange={() => handleSelect(project.id)}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold">{project.projectTitle}</p>
                        <p className="text-xs text-gray-500">{project.projectDescription}</p>
                      </td>

                      <td className="px-4 py-4">{project.fullName}</td>
                      <td className="px-4 py-4">{project.projectAddress}</td>

                      <td className="px-4 py-4">
                        {project.startdate && project.enddate ? (
                          <>
                            {new Date(project.startdate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(project.enddate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td className="px-4 py-4">{project.budget ? `$${project.budget}` : "N/A"}</td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() => fetchBidList(project.id)}
                          className="text-blue-600 hover:underline text-sm"
                          aria-label={`View bids for ${project.projectTitle}`}
                        >
                          View Bids
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <select
                         className={`px-2 py-1 rounded-full text-xs font-semibold border border-gray-300 focus:outline-none focus:ring-2 ${
                            project.status === 3
                              ? "bg-gray-200 text-gray-700"          // Draft color - grayish
                              : project.status === 0
                              ? "bg-yellow-100 text-yellow-800"     // Not Started - yellow
                              : project.status === 1
                              ? "bg-blue-100 text-blue-800"         // Auction Active - blue
                              : "bg-green-100 text-green-800"       // Auction Completed - green (or default)
                          }`}

                          value={project.status}
                          onChange={(e) => updatestatus(project.id, e.target.value)}
                          aria-label={`Change status for ${project.projectTitle}`}
                        >
                          <option className="bg-white text-black" value={0}>
                            Not Started
                          </option>
                          <option className="bg-white text-black" value={1}>
                            Auction Active
                          </option>
                          <option className="bg-white text-black" value={2}>
                           Auction  Completed
                          </option>
                            <option className="bg-white text-black" value={3}>
                             Draft
                          </option>
                        </select>
                      </td>

                     <td className="px-4 py-4 flex items-center space-x-2">
                      <EyeIcon
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={() => openModal(project)}
                      />
                      <PencilIcon className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={()=> router.push(`/admin/create-project/${project.id}`) }
                      />
                    </td>

                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        {filteredProjects.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600" aria-live="polite">
              {filteredProjects.length > 0
                ? `Showing ${startIndex + 1} - ${Math.min(
                    startIndex + rowsPerPage,
                    filteredProjects.length
                  )} of ${filteredProjects.length}`
                : "No projects to display."}
            </span>

            <div className="flex gap-2" role="navigation" aria-label="Pagination Navigation">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                aria-label="Go to first page"
              >
                First
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                aria-label="Go to previous page"
              >
                Prev
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                  }`}
                  aria-current={currentPage === page ? "page" : undefined}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                aria-label="Go to next page"
              >
                Next
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                aria-label="Go to last page"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isProjectModalOpen && selectedProject && (
        <ProjectDetailsModal project={selectedProject} onClose={closeModal} />
      )}

      {isBidsModalOpen && (
        <BidsModal
          bidList={bidList}
          expandedBids={expandedBids}
          toggleExpand={toggleExpand}
          logBidsMap={logBidsMap}
          onClose={() => {
            setIsBidsModalOpen(false);
            setBidList([]);
            setExpandedBids(new Set());
            setLogBidsMap({});
          }}
        />
      )}
    </div>
  );
}

function ProjectDetailsModal({ project, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-details-title"
    >
      <div className="bg-white border border-gray-200 rounded-lg max-w-4xl w-full shadow-xl relative overflow-y-auto max-h-[90vh] p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 id="project-details-title" className="text-2xl font-semibold text-gray-800">
            {project.projectTitle}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close project details"
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-8">
          {/* Project Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Project Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <p>
                <strong className="text-gray-700">Customer:</strong> {project.fullName}
              </p>
              <p>
                <strong className="text-gray-700">Email:</strong> {project.emailAddress}
              </p>
              <p>
                <strong className="text-gray-700">Phone:</strong> {project.phoneNumber}
              </p>
              <p>
                <strong className="text-gray-700">Address:</strong> {project.projectAddress}
              </p>
              <p>
                <strong className="text-gray-700">Property Type:</strong> {project.propertyType}
              </p>
              <p>
                <strong className="text-gray-700">Product Type:</strong> {project.productType}
              </p>
              <p>
                <strong className="text-gray-700">Product Color:</strong> {project.productColor}
              </p>
              <p>
                <strong className="text-gray-700">Product Preference:</strong> {project.productPreference}
              </p>
              <p className="sm:col-span-2">
                <strong className="text-gray-700">Work Description:</strong> {project.workDescription}
              </p>
              <p>
                <strong className="text-gray-700">Budget:</strong>{" "}
                {project.budget ? `$${project.budget}` : "N/A"}
              </p>
              <p>
                <strong className="text-gray-700">Status:</strong> {statusLabels[project.status]}
              </p>
              <p className="sm:col-span-2">
                <strong className="text-gray-700">Timeline:</strong>{" "}
                {project.startdate &&
                  new Date(project.startdate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                -{" "}
                {project.enddate &&
                  new Date(project.enddate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
              </p>
            </div>
          </div>

          {/* Documents Section */}
          {project.documents && project.documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Project Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  >
                    <p className="text-sm font-medium text-gray-700 capitalize mb-2">
                      {doc.fileType}
                    </p>
                    {doc.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_URL}${doc.fileUrl}`}
                        alt={doc.originalName}
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm inline-block"
                      >
                        {doc.originalName}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assigned Pros Section */}
          {project.pros && project.pros.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Assigned Pros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.pros.map((pro) => (
                  <div
                    key={pro.id}
                    className="border rounded-lg p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={`${pro.companyLogo}`}
                      alt={pro.companyName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="text-sm space-y-1">
                      <p className="font-semibold text-gray-800">{pro.companyName}</p>
                      <p className="text-gray-600">{pro.companyEmail}</p>
                      <p className="text-gray-600">{pro.companyPhone}</p>
                      <p>
                        <strong>Owner:</strong> {pro.ownerFirstName} {pro.ownerLastName}
                      </p>
                      <p>
                        <strong>Services:</strong> {JSON.parse(pro.services).join(", ")}
                      </p>
                      <p>
                        <strong>Qualifications:</strong> {JSON.parse(pro.qualifications).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BidsModal({ bidList, expandedBids, toggleExpand, logBidsMap, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bids-modal-title"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full overflow-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3
            id="bids-modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            Bid by companies
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex justify-center items-center text-sm"
            aria-label="Close bids modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {bidList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-gray-700 font-medium">Company</th>
                    <th className="py-3 px-4 text-gray-700 font-medium">Bid Amount</th>
                    <th className="py-3 px-4 text-gray-700 font-medium">Message</th>
                    <th className="py-3 px-4 text-gray-700 font-medium">Contact</th>
                    <th className="py-3 px-4 text-gray-700 font-medium">Logs</th>
                  </tr>
                </thead>
                <tbody>
                  {bidList.map((bid) => (
                    <React.Fragment key={bid.id}>
                      <tr className="even:bg-gray-50 odd:bg-white hover:bg-gray-100">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <img
                            src={bid.companyDetails.companyLogo}
                            alt={bid.companyDetails.companyName}
                            className="w-8 h-8 rounded-full border"
                          />
                          <span>{bid.companyDetails.companyName}</span>
                        </td>
                        <td className="py-3 px-4">${bid.amount}</td>
                        <td className="py-3 px-4">{bid.message}</td>
                        <td className="py-3 px-4 text-blue-600">{bid.companyDetails.companyEmail}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleExpand(bid.projectId, bid.proId, bid.id)}
                            className="text-xl font-bold rounded-full w-7 h-7 flex items-center justify-center border border-gray-400 hover:bg-gray-200"
                            aria-label={expandedBids.has(bid.id) ? "Collapse logs" : "Expand logs"}
                          >
                            {expandedBids.has(bid.id) ? "−" : "+"}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded logs row */}
                      {expandedBids.has(bid.id) && logBidsMap[bid.id] && (
                        <tr className="bg-gray-50">
                          <td colSpan={5} className="p-6 text-sm text-gray-700">
                            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                                Bid Activity Timeline
                              </h4>
                              <ol className="relative border-l-2 border-indigo-500">
                                {logBidsMap[bid.id].map((log) => (
                                  <li key={log.id} className="mb-8 ml-6 last:mb-0">
                                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 ring-8 ring-white">
                                      <svg
                                        aria-hidden="true"
                                        className="h-3 w-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M6 10a4 4 0 118 0 4 4 0 01-8 0z" />
                                      </svg>
                                    </span>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                      <time className="mb-1 text-sm font-normal leading-none text-gray-500">
                                        {new Date(log.createdAt).toLocaleString(undefined, {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </time>
                                      <div className="text-indigo-700 font-semibold text-lg">${log.amount}</div>
                                    </div>

                                    {log.message && (
                                      <p className="mt-1 text-gray-600">{log.message}</p>
                                    )}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">Waiting for bids...</div>
          )}
        </div>
      </div>
    </div>
  );
}

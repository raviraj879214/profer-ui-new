"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export function Projectmanagement() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [message,setmessage] = useState();
   const [loading,setLoading] = useState(false);
  //bid management

  const [bidlist,setbidlist] = useState([]);





  const statusColors = {
    0: "bg-yellow-100 text-yellow-800",
    1: "bg-green-100 text-green-800",
    2: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    0: "Pending",
    1: "Approved",
    2: "Rejected",
  };

  const fetchProjectsList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-project-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjectsList();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = filter === "All" || statusLabels[project.status] === filter;
    const matchesSearch =
      project.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + rowsPerPage);

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

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };




  const fetchbidlist = async (id)=>{
    setIsOpen(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-bid-list`,{
      method :"POST",
     headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          projecId : id
        })
    })
    if(res.ok){
      const result = await res.json();
      if(result.status == 200)
      {
        console.log("result",result);
        setbidlist(result.data);
      }
    }
  }


const updatestatus = async (projectid, data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/update-project-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: parseInt(data),
        projectid: parseInt(projectid),
      }),
    });

    const result = await res.json();

    if (res.ok && result.status === 200) {
      // Optimistic UI update
      setmessage("project status updated");
      setProjects(prev =>
        prev.map(p =>
          p.id === projectid ? { ...p, status: parseInt(data) } : p
        )
      );
      console.log("Status updated successfully");
    } else {
      console.error("Failed to update status:", result.message);
    }
  } catch (err) {
    console.error("Error updating status:", err);
  }
  finally{

     setTimeout(() => {
     setmessage("");
  }, 2000); // waits for 2 seconds
  }
};



  const [selected, setSelected] = useState([]);
    const [deleterow, setDeleterow] = useState(false);


const handleSelect =async (id) => {
  const newSelected = selected.includes(id)
    ? selected.filter((x) => x !== id)
    : [...selected, id];
    setSelected(newSelected);
};

  const deleteSelected = async () => {
    setDeleterow(true);
    if (selected.length === 0) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/delete-project-list/${selected}`,
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
          setSelected([]);
          await fetchProjectsList();
          setmessage("Selected requests deleted successfully.");
        }
      }
    } catch (err) {
      console.error("Error deleting requests:", err);
    }
    setDeleterow(false);
  };




  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
       <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
  <div className="flex gap-3">
    {selected.length > 0 && (
      <button
        onClick={deleteSelected}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
        disabled={deleterow}
      >
        {deleterow ? "Loading..." : `Delete Selected (${selected.length})`}
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
          >
            <option>All</option>
            <option>Pending</option>
            <option>Active</option>
            <option>Completed</option>
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
          />

          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>

        {/* Table */}
            {message && (
              <p
                className={`p-1 mt-2 text-sm font-medium ${
                  message.includes("updated")
                    ? "text-green-600"  // success
                    : "text-red-600"    // error
                }`}
              >
                {message}
              </p>
            )}

        <div className="overflow-auto rounded-lg border border-gray-200">
         
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-2">
              <input
                type="checkbox"
                 checked ={selected.length == projects.length}
                onChange={() =>
                  setSelected(
                    selected.length === projects.length ? [] : projects.map((d) => d.id)
                  )
                }
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
              {paginatedProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(project.id)}
                  onChange={() => handleSelect(project.id)}
                />
              </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold">{project.projectTitle}</div>
                    <div className="text-xs text-gray-500">{project.projectDetails}</div>
                    {project.pros && project.pros.length > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        Assigned Pros: {project.pros.map((pro) => pro.companyName).join(", ")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-pre-line">
                    <div className="font-semibold">{project.fullName}</div>
                    <a href={`mailto:${project.emailAddress}`} className="text-blue-600 underline text-xs">
                      {project.emailAddress}
                    </a>
                    <br />
                    <span className="text-xs text-gray-600">{project.phoneNumber}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{project.projectAddress}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    <div>
                      {project.startdate
                        ? "Start: " + new Date(project.startdate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "N/A"}
                      <br />
                      {project.enddate
                        ? "End: " + new Date(project.enddate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "N/A"}
                    </div>
                  </td>
                 
                  <td className="px-4 py-4 text-sm text-gray-700">{project.budget ? `$${project.budget}` : "N/A"}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button onClick={() => fetchbidlist(project.id)}
                      className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-xs hover:bg-gray-100">
                      View
                    </button>
                   
                  </td>


                 <td className="px-4 py-4">
                  <select
                    className={`px-2 py-1 rounded-full text-xs font-semibold border border-gray-300 focus:outline-none focus:ring-2 ${
                      project.status == 0
                        ? "bg-yellow-100 text-yellow-800"
                        : project.status == 1
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                    value={project.status}
                    onChange={(e) => updatestatus(project.id, e.target.value)}
                  >
                    <option className="bg-white text-black" value={0}>Pending</option>
                    <option className="bg-white text-black" value={1}>Active</option>
                    <option className="bg-white text-black" value={2}>Completed</option>
                  </select>
                </td>







                  <td className="px-4 py-4 space-x-2">
                    <button
                      className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-xs hover:bg-gray-100"
                      onClick={() => openModal(project)}
                    >
                      View
                    </button>
                    {/* <button className="bg-blue-500 text-white rounded-md px-3 py-1 text-xs hover:bg-blue-600">
                      Edit
                    </button> */}
                  </td>
                </tr>
              ))}
              {paginatedProjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-6">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
)}
          </table>
        </div>

        {/* Pagination */}
        {filteredProjects.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} - {Math.min(startIndex + rowsPerPage, filteredProjects.length)} of {filteredProjects.length}
            </span>
            <div className="flex gap-2">
              <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">
                First
              </button>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">
                Prev
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded-md text-sm ${currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
                >
                  {page}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">
                Next
              </button>
              <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">
                Last
              </button>
            </div>
          </div>
        )}
      </div>

{isModalOpen && selectedProject && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white border border-gray-200 rounded-lg max-w-4xl w-full shadow-xl relative overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-2xl font-semibold text-gray-800">{selectedProject.projectTitle}</h2>
        <button
          className="text-gray-500 hover:text-gray-700 text-xl"
          onClick={closeModal}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-8">
        {/* Project Details */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Project Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <p><strong className="text-gray-700">Customer:</strong> {selectedProject.fullName}</p>
            <p><strong className="text-gray-700">Email:</strong> {selectedProject.emailAddress}</p>
            <p><strong className="text-gray-700">Phone:</strong> {selectedProject.phoneNumber}</p>
            <p><strong className="text-gray-700">Address:</strong> {selectedProject.projectAddress}</p>
            <p><strong className="text-gray-700">Property Type:</strong> {selectedProject.propertyType}</p>
            <p><strong className="text-gray-700">Product Type:</strong> {selectedProject.productType}</p>
            <p><strong className="text-gray-700">Product Color:</strong> {selectedProject.productColor}</p>
            <p><strong className="text-gray-700">Product Preference:</strong> {selectedProject.productPreference}</p>
            <p className="sm:col-span-2"><strong className="text-gray-700">Work Description:</strong> {selectedProject.workDescription}</p>
            <p><strong className="text-gray-700">Budget:</strong> {selectedProject.budget ? `$${selectedProject.budget}` : "N/A"}</p>
            <p><strong className="text-gray-700">Status:</strong> {statusLabels[selectedProject.status]}</p>
            <p className="sm:col-span-2">
              <strong className="text-gray-700">Timeline:</strong>{" "}
              {selectedProject.startdate && new Date(selectedProject.startdate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} 
              {" - "} 
              {selectedProject.enddate && new Date(selectedProject.enddate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Documents Section */}
        {selectedProject.documents && selectedProject.documents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Project Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedProject.documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                  <p className="text-sm font-medium text-gray-700 capitalize mb-2">{doc.fileType}</p>
                  {doc.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={doc.fileUrl}
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
        {selectedProject.pros && selectedProject.pros.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Assigned Pros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProject.pros.map((pro) => (
                <div key={pro.id} className="border rounded-lg p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition">
                  <img
                    src={pro.companyLogo}
                    alt={pro.companyName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-gray-800">{pro.companyName}</p>
                    <p className="text-gray-600">{pro.companyEmail}</p>
                    <p className="text-gray-600">{pro.companyPhone}</p>
                    <p><strong>Owner:</strong> {pro.ownerFirstName} {pro.ownerLastName}</p>
                    <p><strong>Services:</strong> {JSON.parse(pro.services).join(", ")}</p>
                    <p><strong>Qualifications:</strong> {JSON.parse(pro.qualifications).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}


        {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bid by companies
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
              <div className="p-4 md:p-5 space-y-4">
                {bidlist.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-left text-gray-700 font-medium">Company</th>
                          <th className="py-3 px-4 text-left text-gray-700 font-medium">Bid Amount</th>
                          <th className="py-3 px-4 text-left text-gray-700 font-medium">Message</th>
                          <th className="py-3 px-4 text-left text-gray-700 font-medium">Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bidlist.map((bid) => (
                          <tr key={bid.id} className="even:bg-gray-50 odd:bg-white hover:bg-gray-100">
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Waiting for bids...
                  </div>
                )}
              </div>


           
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                
              </div>
            </div>
          </div>
       
        </div>)}



    </div>
  );
}

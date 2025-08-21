"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Bid() {
  const router = useRouter();
  const [location, setLocation] = useState("All locations");
  const locations = ["All locations", "Location 1", "Location 2"];
  const [closedProjects, setClosedProjects] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchprojectlist = async () => {
    try {
      setLoading(true);
      const UserID = localStorage.getItem("UserID");
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-project-details/${UserID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) setClosedProjects(result.data);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchprojectlist();
  }, []);

  const openDetailsModal = (project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsOpen(false);
    setSelectedProject(null);
  };

  const goToBidPage = (projectId) => {
    router.push(`/pro/make-bid/${projectId}`);
  };

  return (
    <>
      <main className="w-full max-w-7xl mx-auto flex flex-col p-4">
        <section className="flex mt-6 w-full max-w-full">
          <aside className="flex flex-col space-y-3 bg-sky-200 w-36 p-5 rounded-tl-lg rounded-bl-lg text-gray-600 text-sm font-medium">
            <span className="cursor-pointer font-bold text-gray-900 border-l-4 border-sky-500 pl-3">
              Projects
            </span>
          </aside>

          <article className="flex-1 bg-white p-6 rounded-tr-lg rounded-br-lg drop-shadow-md overflow-x-auto">
            {message && (
              <p className="text-green-500 transition-opacity duration-500">
                {message}
              </p>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Project Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Property Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      End Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Budget
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Latest Bid
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Bid
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {closedProjects.length > 0 ? (
                    closedProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-4 py-3 align-middle whitespace-nowrap text-gray-700">
                          {project.projectTitle}
                        </td>
                        <td className="px-4 py-3 align-middle whitespace-nowrap text-gray-700">
                          {project.propertyType}
                        </td>
                        <td className="px-4 py-3 align-middle whitespace-nowrap text-gray-700">
                          {project.startdate}
                        </td>
                        <td className="px-4 py-3 align-middle whitespace-nowrap text-gray-700">
                          {project.enddate}
                        </td>
                        <td className="px-4 py-3 align-middle whitespace-nowrap font-semibold text-gray-900">
                          {project.budget ? `₹${project.budget}` : "N/A"}
                        </td>
                        <td className="px-4 py-3 align-middle text-center">
                          <button
                            onClick={() => openDetailsModal(project)}
                            className="text-black font-semibold py-1 px-3 rounded-lg shadow text-sm flex items-center justify-center mx-auto"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </td>
                        <td className="px-4 py-3 align-middle text-center">
                          {project.bids && project.bids.length > 0
                            ? `₹${[...project.bids]
                                .sort(
                                  (a, b) =>
                                    new Date(a.createdAt) -
                                    new Date(b.createdAt)
                                )
                                .slice(-1)[0].amount}`
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 align-middle text-center">
                          <button
                            onClick={() => goToBidPage(project.id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-lg shadow text-sm"
                          >
                            Place Bid
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-6 text-center text-gray-500"
                      >
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </article>
        </section>

        {/* Details Modal */}
        {isDetailsOpen && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-gray-900">
                  📂 Project Details
                </h3>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-500 hover:bg-gray-200 hover:text-gray-900 rounded-full w-9 h-9 flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Project Title:</strong>{" "}
                      {selectedProject.projectTitle}
                    </p>
                    <p>
                      <strong>Property Type:</strong>{" "}
                      {selectedProject.propertyType}
                    </p>
                    <p>
                      <strong>Product Type:</strong>{" "}
                      {selectedProject.productType}
                    </p>
                    <p>
                      <strong>Product Color:</strong>{" "}
                      {selectedProject.productColor}
                    </p>
                    <p>
                      <strong>Product Preference:</strong>{" "}
                      {selectedProject.productPreference}
                    </p>
                  </div>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Work Description:</strong>{" "}
                      {selectedProject.workDescription}
                    </p>
                    <p>
                      <strong>Budget:</strong>{" "}
                      {selectedProject.budget
                        ? `₹${selectedProject.budget}`
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Start Date:</strong> {selectedProject.startdate}
                    </p>
                    <p>
                      <strong>End Date:</strong> {selectedProject.enddate}
                    </p>
                  </div>
                </div>

                {/* Documents / Images */}
                {selectedProject.documents &&
                  selectedProject.documents.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        📸 Documents & Images
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {selectedProject.documents.map((doc) => (
                          <div key={doc.id} className="relative group">
                            <img
                              src={doc.fileUrl}
                              alt={doc.originalName}
                              className="w-full h-32 object-cover rounded-lg shadow-md group-hover:opacity-80 transition"
                            />
                            <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                              {doc.fileType}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={closeDetailsModal}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

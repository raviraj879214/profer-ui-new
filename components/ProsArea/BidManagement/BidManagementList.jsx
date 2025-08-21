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
  const [loading, setLoading] = useState(true); // <-- loader state

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchprojectlist = async () => {
    try {
      setLoading(true); // start loading
      const UserID = localStorage.getItem("UserID");
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-project-details/${UserID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          setClosedProjects(result.data);
        }
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false); // stop loading
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

            {/* Loader */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="w-full border-collapse table-auto">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Project Title</th>
                    <th className="py-3 px-4">Property Type</th>
                    <th className="py-3 px-4">Start Date</th>
                    <th className="py-3 px-4">End Date</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Actions</th>
                    <th className="py-3 px-4">Bid</th>
                  </tr>
                </thead>
                <tbody>
                  {closedProjects.length > 0 ? (
                    closedProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="even:bg-gray-50 odd:bg-white hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="py-3 px-4">{project.projectTitle}</td>
                        <td className="py-3 px-4">{project.propertyType}</td>
                        <td className="py-3 px-4">{project.startdate}</td>
                        <td className="py-3 px-4">{project.enddate}</td>
                        <td className="py-3 px-4 font-semibold">
                          {project.budget ? `₹${project.budget}` : "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => openDetailsModal(project)}
                            className="text-black font-semibold py-1 px-3 rounded-lg shadow text-sm flex items-center justify-center"
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
                        <td className="py-3 px-4">
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
                      <td colSpan="10" className="py-6 text-center text-gray-500">
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
            <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-y-auto max-h-[80vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Project Details
                </h3>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-500 hover:bg-gray-200 hover:text-gray-900 rounded-full w-8 h-8 flex items-center justify-center transition"
                >
                  <svg
                    className="w-4 h-4"
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
              <div className="p-6 text-gray-700 text-base leading-relaxed">
                <div className="space-y-3">
                  <p><strong>Project Title:</strong> {selectedProject.projectTitle}</p>
                  <p><strong>Property Type:</strong> {selectedProject.propertyType}</p>
                  <p><strong>Product Type:</strong> {selectedProject.productType}</p>
                  <p><strong>Product Color:</strong> {selectedProject.productColor}</p>
                  <p><strong>Product Preference:</strong> {selectedProject.productPreference}</p>
                  <p><strong>Work Description:</strong> {selectedProject.workDescription}</p>
                  <p><strong>Budget:</strong> {selectedProject.budget ? `₹${selectedProject.budget}` : "N/A"}</p>
                  <p><strong>Start Date:</strong> {selectedProject.startdate}</p>
                  <p><strong>End Date:</strong> {selectedProject.enddate}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

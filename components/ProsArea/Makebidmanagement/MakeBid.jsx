"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function MakeBids({ projectid, proId: propProId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidPrice, setBidPrice] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successmessage,setsuccessmessage] = useState(); 
  
  // For showing validation messages above Bid Price input
  const [validationMsg, setValidationMsg] = useState("");



    useEffect(() => {
  if (successmessage) {
    const timer = setTimeout(() => {
      setsuccessmessage("");
    },3000); // 5000ms = 5 seconds

    // Cleanup in case component unmounts or successmessage changes before timeout
    return () => clearTimeout(timer);
  }
}, [successmessage]);










  async function fetchProject() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-project-details-by-project-id/${projectid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      if (json.status === 200 && json.data) {
        setProject(json.data);

        const currentProId = propProId || localStorage.getItem("UserID");
        const existingBid = json.data.bids.find(
          (bid) => bid.proId.toString() === currentProId?.toString()
        );

        if (existingBid) {
          setBidPrice(existingBid.amount.toString());
          setMessage(existingBid.message || "");
        } else {
          setBidPrice("");
          setMessage("");
        }
      } else {
        setProject(null);
        setBidPrice("");
        setMessage("");
      }
    } catch (err) {
      console.error("Failed to fetch project details:", err);
      setProject(null);
      setBidPrice("");
      setMessage("");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (projectid) {
      fetchProject();
    }
  }, [projectid, propProId]);

  async function handleMakeBid() {
    const currentProId = propProId || localStorage.getItem("UserID");
    if (!bidPrice || isNaN(bidPrice) || Number(bidPrice) <= 0) {
      setValidationMsg("Please enter a valid bid price.");
      return;
    }
    if (!message.trim()) {
      setValidationMsg("Please enter a message for your bid.");
      return;
    }
    if (!currentProId) {
      setValidationMsg("Pro ID is required.");
      return;
    }

    setValidationMsg(""); // clear validation messages before submit
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/make-bid-pro`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: bidPrice,
          message: message.trim(),
          projectId: projectid.toString(),
          proId: currentProId.toString(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === 200) {

        setsuccessmessage(data.message);
        await fetchProject(); // Refresh project and bids
      } else {
        setsuccessmessage(`Failed to create bid: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      setsuccessmessage("Error creating bid. Please try again.");
      console.error("Make bid error:", error);
    }
    setSubmitting(false);
  }



  if (!project) {
    return (
      <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
       </div>


    );
  }

  const documents = project.documents?.filter(
    (doc) =>
      doc.fileType === "drawings" ||
      doc.fileType === "insurance" ||
      doc.fileType === "projectother"
  ) || [];

  const mediaFiles = project.documents?.filter((doc) => doc.fileType === "mediaFiles") || [];

  return (
    <>
      {/* Banner and project basic info */}
      <div className="flex flex-col items-center px-4 py-6 space-y-4">
        <div className="bg-cyan-100 flex flex-col md:flex-row items-center md:items-start justify-between p-4 md:p-6 rounded-lg w-full max-w-screen-lg mx-auto shadow-md shadow-black/30">
          <span className="text-center md:text-left">
            <span className="text-2xl lg:text-5xl font-semibold">Project</span>
            <span className="text-2xl lg:text-5xl font-semibold text-red-500"> Bid</span>
            <span className="text-2xl lg:text-5xl font-semibold">™</span>
          </span>

          <div className="mt-4 md:mt-0 text-center md:text-right text-sm leading-relaxed">
            <div className="flex flex-col mt-1 space-y-1">
              <div>Start Date &amp; Time: {new Date(project.startdate).toLocaleDateString("en-US")}</div>
              <div>End Date &amp; Time: {new Date(project.enddate).toLocaleDateString("en-US")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details and Bid Form */}
      <div className="max-w-[67rem] mx-auto px-6">
        <div className="bg-white rounded-b-lg border border-t-0 border-gray-300 shadow-md text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left - Project Info */}
            <div className="p-5 border-b md:border-b-0 md:border-r border-gray-300">
              <h2 className="text-xl md:text-2xl font-bold">{project.projectTitle || "Project Title"}</h2>
              <br />
              <h3 className="text-lg md:text-xl font-semibold">Project Requirements:</h3>
              <ul className="list-disc list-inside text-sm leading-relaxed mb-4">
                <li>{project.projectDetails || "No detailed requirements provided."}</li>
              </ul>
              <h3 className="text-base md:text-lg font-semibold">Project Stats:</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <p className="text-sm">
                  <span className="underline block">Budget</span>
                  {project.budget ? `$${project.budget.toLocaleString()}` : "N/A"}
                </p>
                <p className="text-sm">
                  <span className="underline block">Product Type</span>
                  {project.productType || "N/A"}
                </p>
                <p className="text-sm">
                  <span className="underline block">Product Color</span>
                  {project.productColor || "N/A"}
                </p>
              </div>
            </div>

            {/* Right - Bid Input */}
            <div className="p-5 bg-gray-50 space-y-4">
              {/* Validation message above bid price */}
              {validationMsg && (
                <p className="text-sm text-red-600 font-semibold mb-1">{validationMsg}</p>
              )}

              <div className="flex flex-col gap-1">
  <p className="text-green-500 text-sm font-semibold">{successmessage}</p>
  <div className="flex flex-col md:flex-row md:items-center gap-2">
    <label htmlFor="bidPrice" className="text-base text-gray-900 md:w-64">
      Bid Price
    </label>
    <input
      type="number"
      id="bidPrice"
      className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-48 text-center text-gray-900 text-sm"
      value={bidPrice}
      onChange={(e) => setBidPrice(e.target.value)}
      placeholder="Enter your bid"
    />
  </div>
</div>


              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label htmlFor="bidMessage" className="text-base text-gray-900 md:w-64">
                  Bid Message
                </label>
                <textarea
                  id="bidMessage"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-48 text-gray-900 text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message for your bid"
                  rows={3}
                />
              </div>

              <button
                onClick={handleMakeBid}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2 rounded-md w-full md:w-auto"
              >
                {submitting ? "Submitting..." : "Make Bid"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="relative max-w-screen-lg mx-auto rounded-2xl shadow-md shadow-black/30 bg-white p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Image src="/images/licensed.png" alt="Shield Icon" width={44} height={84} />
              <h3 className="font-semibold text-2xl text-gray-800">Project Documents</h3>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-6">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div key={doc.id} className="flex flex-col items-center text-center w-full sm:w-[30%] max-w-[400px]">
                  <p className="text-sm font-semibold text-gray-500 mb-2 capitalize">
                    {doc.fileType === "drawings"
                      ? "Satellite Measurement"
                      : doc.fileType === "insurance"
                      ? "Insurance Claim Paperwork"
                      : "Scope of Work"}
                  </p>
                  <div className="w-full rounded-md border overflow-hidden shadow-sm">
                    <Image
                      src={doc.fileUrl}
                      alt={doc.originalName}
                      width={400}
                      height={200}
                      className="object-cover w-full h-auto"
                      unoptimized
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-full text-gray-500">No project documents available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Media Files Section */}
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="relative max-w-screen-lg mx-auto rounded-2xl shadow-md shadow-black/30 bg-white p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Image src="/images/licensed.png" alt="Shield Icon" width={44} height={84} />
              <h3 className="font-semibold text-gray-800 text-2xl">Project Photos and Videos</h3>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-6">
            {mediaFiles.length > 0 ? (
              mediaFiles.map((media) => (
                <div key={media.id} className="w-full sm:w-[30%] max-w-[400px] rounded-md border overflow-hidden shadow-sm">
                  <Image
                    src={media.fileUrl}
                    alt={media.originalName}
                    width={400}
                    height={200}
                    className="object-cover w-full h-auto"
                    unoptimized
                  />
                </div>
              ))
            ) : (
              <p className="text-center w-full text-gray-500">No project media files available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { CompanyBid } from "./CompaniesBidPrices";
import Link from "next/link";


export function ProjectDet({ projectid }) {
  const [project, setProject] = useState(null);
  const [selectedPros, setSelectedPros] = useState([]);

  const token = localStorage.getItem("Admintoken");

  const fetchProjectDetails = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/get-project-details-by-id/${projectid}`,
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
      setProject(result.data);

      if (result.data.prosId) {
        fetchSelectedPros(result.data.prosId);
      }
    }
  };

  const fetchSelectedPros = async (prosid) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-selected-pros-project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prosid }),
    });

    if (res.ok) {
      const data = await res.json();
      setSelectedPros(data.data || []);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const formatAmountUSD = (amount) =>
    `$${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  const formatDateToUS = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US");



  if (!project)
    return <div className="mt-5 p-5 text-gray-500">Loading project details...</div>;

const statusLabels = {
  0: "Bidding Not Started",
  1: "Bidding Active",
  2: "Bidding Completed",
  3: "Draft"
};

const statusColors = {
  0: "text-gray-500",    // Not started - gray
  1: "text-green-600",   // Active - green
  2: "text-blue-600",    // Completed - blue
  3: "text-yellow-600",  // Draft - yellow
};

  return (
    <div className="p-6 bg-white border rounded-lg space-y-8 mx-auto">
      {/* Project Header */}
    
        <div className="border-b pb-3">
  <h2 className="text-2xl font-semibold text-gray-800">{project.projectTitle}</h2>
  <p className="text-sm text-gray-500">{project.projectAddress}</p>
  <p className="text-sm text-gray-500">ID: {project.projectid}</p>

  <p>
    <strong className="text-gray-700">Status:</strong>{" "}
    <span className={`${statusColors[project.status]} font-semibold`}>
      {statusLabels[project.status]}
    </span>
  </p>
</div>


      {/* Project Details */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Project Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
          <p><strong>Customer:</strong> {project.fullName}</p>
          <p><strong>Email:</strong> {project.emailAddress}</p>
          <p><strong>Phone:</strong> {project.phoneNumber}</p>
          <p><strong>Address:</strong> {project.projectAddress}</p>
          <p><strong>Property Type:</strong> {project.propertyType || "N/A"}</p>
          <p><strong>Product Type:</strong> {project.productType || "N/A"}</p>
          <p><strong>Product Color:</strong> {project.productColor || "N/A"}</p>
          <p><strong>Product Preference:</strong> {project.productPreference || "N/A"}</p>
          <p className="sm:col-span-2"><strong>Work Description:</strong> {project.workDescription || "N/A"}</p>
          <p><strong>Budget:</strong> {project.budget ? formatAmountUSD(project.budget) : "N/A"}</p>
          <p><strong>Status:</strong> {statusLabels[project.status]}</p>
          <p className="sm:col-span-2">
            <strong>Timeline:</strong>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 bg-gray-100 rounded-md">{formatDateToUS(project.startdate)}</span>
              <span className="text-gray-500">→</span>
              <span className="px-2 py-1 bg-gray-100 rounded-md">{formatDateToUS(project.enddate)}</span>
            </div>
          </p>
        </div>
      </div>

      {/* Project Documents */}
      {project.documents && project.documents.length > 0 && (
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Project Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {project.documents.map((doc) => (
              <div key={doc.id} className="border p-3 rounded relative">
                <p className="text-sm font-medium text-gray-700 capitalize mb-2">{doc.fileType}</p>
                {doc.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <div className="relative">
                    <img
                      src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${doc.fileUrl}`}
                      alt={doc.originalName}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      onClick={() => window.open(`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${doc.fileUrl}`, "_blank")}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                      title="View Image"
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
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

        {selectedPros.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold mb-3 text-gray-800">
      Companies Selected for Bidding
    </h3>


   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {selectedPros.map((pro) => (
    <div
      key={pro.id}
      className="relative border rounded-lg p-4 flex flex-col md:flex-row justify-between"
    >
      {/* Eye Icon top-right */}
      <Link
        target="_blank"

        href={`/admin/companies/${pro.userId}`} // or wherever you want to link
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        title="View Profile"
      >
        <Eye className="w-5 h-5" />
      </Link>

      {/* Left: Company Info */}
      <div className="flex gap-4 items-start flex-1">
        <img
          src={pro.companyLogo}
          alt={pro.companyName}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="text-sm space-y-1">
          <p
            className={
              pro.verifiedStatus === "0"
                ? "text-red-600 font-semibold"
                : "text-green-600 font-semibold"
            }
          >
            {pro.verifiedStatus === "0" ? "Unverified" : "Verified"}
          </p>

          <p className="font-semibold text-gray-800">{pro.companyName}</p>
          <p className="text-gray-600">{pro.companyEmail}</p>
          <p className="text-gray-600">{pro.companyPhone}</p>
          <p className="text-gray-600">
            {pro.streetAddress} {pro.state} {pro.zip}
          </p>
          <p>
            <strong>Owner:</strong> {pro.ownerFirstName} {pro.ownerLastName}
          </p>
        </div>
      </div>

      {/* Left bottom: CompanyBid */}
      <div className="mt-4 md:mt-0 md:ml-4 self-start md:self-end w-full md:w-auto">
        <CompanyBid projectId={projectid} proId={pro.userId} />
      </div>
    </div>
  ))}
</div>


  </div>
)}







      
    </div>
  );
}

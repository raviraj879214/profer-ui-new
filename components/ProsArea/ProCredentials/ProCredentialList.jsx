"use client";
import { useState, useRef, useEffect } from "react";

export function ProCredential() {
  const credentialSections = [
    { title: "State Licenses, Registrations, and Certifications", icon: "/images/licensed.png", section: "State Licenses, Registrations, and Certifications" },
    { title: "Local Licenses, Registrations, and Certifications", icon: "/images/licensed.png", section: "Local Licenses, Registrations, and Certifications" },
    { title: "Insurance", icon: "/images/insured.jpg", section: "Insurance" },
    { title: "Certificate of Good Standing", icon: "/images/Checkmark.png", section: "Certificate of Good Standing" },
    { title: "Skills Certifications", icon: "/images/Checkmark.png", section: "Skills Certifications" },
    { title: "Safety Certifications", icon: "/images/Checkmark.png", section: "Safety Certifications"  },
    { title: "Government Certifications", icon: "/images/Checkmark.png", section: "Government Certifications" },
    { title: "Badges", icon: "/images/Checkmark.png", section: "Badges" },
  ];

  return (
    <>
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg shadow-sm max-w-screen-lg mx-auto mt-6">
        <p className="text-sm md:text-base text-center">
          <strong>Important:</strong> Please upload all the required documents in each section. 
          Your account will be reviewed and approved by an admin once all credentials are submitted.
        </p>
      </div>
      {credentialSections.map((section, index) => ( 
        <div key={index} className="w-full px-4 sm:px-6 py-6 bg-gray-50">
          <div
            className={`relative max-w-screen-lg mx-auto rounded-2xl ${
              section.highlight
                ? "border border-red-300 shadow-[0_4px_12px_rgba(255,0,0,0.08)]"
                : "shadow-lg shadow-black/60"
            } bg-white p-4 sm:p-6`}
          >
            <CredentialSection {...section} />
          </div>
          {section.note && (
            <p className="text-center text-red-600 text-l mt-2">{section.note}</p>
          )}
        </div>
      ))}
      <div className="my-10"></div>
    </>
  );
}

function CredentialSection({ title, icon, section }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const inputRefs = useRef([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Load previously uploaded credentials for this section
  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-credentials?section=${section}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch credentials");
        const data = await res.json();
        setUploadedFiles(
          data.credentials.map((doc) => ({
            id: doc.id,
            title: doc.name,
            uploadedFile: `${process.env.NEXT_PUBLIC_URL}${doc.fileUrl}`,
          }))
        );
      } catch (err) {
        console.error("Error loading credentials:", err);
      }
    };
    fetchExisting();
  }, [section]);

  // Upload new or updated file
  const handleUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate name before upload
    if (!uploadedFiles[index]?.title?.trim()) {
      alert("Please enter a document name first before uploading.");
      inputRefs.current[index]?.focus();
      return;
    }

    const formData = new FormData();
    formData.append("section", title);
    formData.append("names", JSON.stringify([uploadedFiles[index].title]));
    formData.append("documents", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-credentials`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const newFiles = [...uploadedFiles];
      newFiles[index] = {
        id: data.files[0].id,
        uploadedFile: `${process.env.NEXT_PUBLIC_URL}${data.files[0].fileUrl}`,
        title: data.files[0].name,
      };
      setUploadedFiles(newFiles);
    } catch (err) {
      alert(err.message);
      console.error("Upload error:", err);
    }
  };

  // Remove a file from UI & DB
  const handleRemove = async (index) => {
    const fileToDelete = uploadedFiles[index];
    if (!fileToDelete?.id) {
      // If file not saved in DB yet, just remove from UI
      const newFiles = [...uploadedFiles];
      newFiles.splice(index, 1);
      setUploadedFiles(newFiles);
      return;
    }

    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/delete-credential/${fileToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete credential");

      const newFiles = [...uploadedFiles];
      newFiles.splice(index, 1);
      setUploadedFiles(newFiles);
    } catch (err) {
      alert(err.message);
      console.error("Delete error:", err);
    }
  };

  // Change document name
  const handleTitleChange = (e, index) => {
    const newFiles = [...uploadedFiles];
    newFiles[index].title = e.target.value;
    setUploadedFiles(newFiles);
  };

  // Add empty slot
  const addNewSlot = () => {
    setUploadedFiles([...uploadedFiles, { title: "", uploadedFile: null }]);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <img src={icon} alt="Icon" width={24} height={24} />
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 justify-center">
        {uploadedFiles.map((doc, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center min-w-[200px] max-w-[250px] space-y-2"
          >
            {/* Editable Title Input */}
            <input
              type="text"
              placeholder="Enter document name"
              value={doc.title}
              onChange={(e) => handleTitleChange(e, idx)}
              ref={(el) => (inputRefs.current[idx] = el)}
              className="doc-name-input text-sm text-gray-700 border rounded-md px-2 py-1 w-full text-center focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* File Upload Box */}
            <div className="h-[140px] w-full rounded-md border overflow-hidden shadow-sm relative group">
              {doc.uploadedFile ? (
                <img
                  src={doc.uploadedFile}
                  alt={doc.title || "Uploaded file"}
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  {doc.title?.trim() ? "+ Upload File" : "Enter name first"}
                </div>
              )}

              {/* Hover options only if uploaded */}
              {doc.uploadedFile && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleRemove(idx)}
                    className="bg-red-500 text-white text-xs px-3 py-1 rounded shadow"
                  >
                    Remove
                  </button>
                  <label className="bg-blue-500 text-white text-xs px-3 py-1 rounded shadow cursor-pointer">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(e, idx)}
                    />
                  </label>
                </div>
              )}

              {/* If not uploaded → make full box clickable */}
              {!doc.uploadedFile && (
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleUpload(e, idx)}
                  disabled={!doc.title?.trim()}
                />
              )}
            </div>
          </div>
        ))}

        {/* Add new certification slot button */}
        <div className="flex flex-col items-center text-center min-w-[200px] max-w-[250px] space-y-2">
          <div className="h-[34px]"></div>
          <button
            onClick={addNewSlot}
            className="flex flex-col items-center justify-center h-[140px] w-full border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:text-gray-600 hover:border-gray-400"
          >
            + Add More
          </button>
        </div>
      </div>
    </div>
  );
}

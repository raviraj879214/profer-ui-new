"use client";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

export function ProCredential() {
const [isOpen, setIsOpen] = useState(false);
const [notifymessage , setnotifymessage] = useState("Please confirm: Have you uploaded all required documents?  Clicking Confirm will send an email notification tothe admin that your documents are ready for review.");
const [notiloading,setnotiloading] = useState(false);
const router = useRouter();
  const credentialSections = [
    {
      title: "State Licenses, Registrations, and Certifications",
      icon: "/images/licensed.png",
      section: "State Licenses, Registrations, and Certifications",
    },
    {
      title: "Local Licenses, Registrations, and Certifications",
      icon: "/images/licensed.png",
      section: "Local Licenses, Registrations, and Certifications",
    },
    { title: "Insurance", icon: "/images/insured.jpg", section: "Insurance" },
    {
      title: "Certificate of Good Standing",
      icon: "/images/Checkmark.png",
      section: "Certificate of Good Standing",
    },
    {
      title: "Skills Certifications",
      icon: "/images/Checkmark.png",
      section: "Skills Certifications",
    },
    {
      title: "Safety Certifications",
      icon: "/images/Checkmark.png",
      section: "Safety Certifications",
    },
    {
      title: "Government Certifications",
      icon: "/images/Checkmark.png",
      section: "Government Certifications",
    },
    { title: "Badges", icon: "/images/Checkmark.png", section: "Badges" },
  ];


  const  submitcredential = async ()=>{
    setIsOpen(true);
  
  }

   const handleConfirm =async () => {
    setnotiloading(true);
     const  userid = localStorage.getItem("UserID");

     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
     const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/notify-credential-uploade`,{
        method : "POST",
        headers: {
         Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
         },
        body: JSON.stringify({
          userid : userid
        })
      });

      if(res.ok){
        const result = await res.json();
        if(result.status == 200){
          setnotifymessage(result.message);
        }
      }
   
   
    setnotiloading(false);
    setIsOpen(false);
    setnotifymessage("Please confirm: Have you uploaded all required documents?  Clicking Confirm will send an email notification tothe admin that your documents are ready for review.");
      router.push('/pro/pro-dashboard');
  };




  return (
    <>
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg shadow-sm max-w-screen-lg mx-auto mt-6">
        <p className="text-sm md:text-base text-center">
          <strong>Important:</strong> Please upload all the required documents
          in each section. Your account will be reviewed and approved by an
          admin once all credentials are submitted.
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
            <p className="text-center text-red-600 text-l mt-2">
              {section.note}
            </p>
          )}
        </div>
      ))}

      {/* Submit button below all components */}
      <div className="flex justify-center mt-8 mb-12">
        <button className="bg-red-500 text-white px-8 py-3 rounded-md font-semibold shadow" onClick={()=>submitcredential()}>
          Submit
        </button>
        
      </div>
      
      
      {isOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full transform transition-all scale-100 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Confirm Submission
      </h2>
      <p className="text-gray-700 leading-relaxed mb-8">
       {notifymessage}
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setIsOpen(false)}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
        >
           {notiloading ? "wait ..." : "Confirm"}
        </button>
      </div>
    </div>
  </div>
)}

 </>
  );
}

function CredentialSection({ title, icon, section }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingStates, setLoadingStates] = useState([]);
  const inputRefs = useRef([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchExisting = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-credentials?section=${encodeURIComponent(
          section
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch credentials");
      const data = await res.json();
      const files = data.credentials.map((doc) => ({
        id: doc.id,
        title: doc.name,
        uploadedFile: `${process.env.NEXT_PUBLIC_URL}${doc.fileUrl}`,
      }));
      setUploadedFiles(files);
      setLoadingStates(new Array(files.length).fill(false));
    } catch (err) {
      console.error("Error loading credentials:", err);
    }
  };

  useEffect(() => {
    fetchExisting();
  }, [section]);

  const handleUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!uploadedFiles[index]?.title?.trim()) {
      alert("Please enter a document name first before uploading.");
      inputRefs.current[index]?.focus();
      return;
    }

    const formData = new FormData();
    formData.append("section", title);
    formData.append("names", JSON.stringify([uploadedFiles[index].title]));
    formData.append("documents", file);

    const newLoading = [...loadingStates];
    newLoading[index] = true;
    setLoadingStates(newLoading);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/create-credentials`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      await fetchExisting();
    } catch (err) {
      alert(err.message);
      console.error("Upload error:", err);
    } finally {
      const resetLoading = [...loadingStates];
      resetLoading[index] = false;
      setLoadingStates(resetLoading);
    }
  };

  const handleRemove = async (index, e) => {
    e.stopPropagation();
    const fileToDelete = uploadedFiles[index];

    if (!confirm("Are you sure you want to delete this document?")) return;

    if (!fileToDelete?.id) {
      const newFiles = [...uploadedFiles];
      newFiles.splice(index, 1);
      setUploadedFiles(newFiles);

      const newLoading = [...loadingStates];
      newLoading.splice(index, 1);
      setLoadingStates(newLoading);
      return;
    }

    const newLoading = [...loadingStates];
    newLoading[index] = true;
    setLoadingStates(newLoading);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/delete-credential/${fileToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete credential");

      await fetchExisting();
    } catch (err) {
      alert(err.message);
      console.error("Delete error:", err);
    } finally {
      const resetLoading = [...loadingStates];
      resetLoading[index] = false;
      setLoadingStates(resetLoading);
    }
  };

  const handleTitleChange = (e, index) => {
    const newFiles = [...uploadedFiles];
    newFiles[index].title = e.target.value;
    setUploadedFiles(newFiles);
  };

  const addNewSlot = () => {
    setUploadedFiles([...uploadedFiles, { title: "", uploadedFile: null }]);
    setLoadingStates([...loadingStates, false]);
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
            <input
              type="text"
              placeholder="Enter document name"
              value={doc.title}
              onChange={(e) => handleTitleChange(e, idx)}
              ref={(el) => (inputRefs.current[idx] = el)}
              className="text-sm text-gray-700 border rounded-md px-2 py-1 w-full text-center focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <div className="h-[140px] w-full rounded-md border overflow-hidden shadow-sm relative group">
              {loadingStates[idx] ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Uploading...
                </div>
              ) : doc.uploadedFile ? (
                doc.uploadedFile.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={doc.uploadedFile}
                    title={doc.title || "Uploaded PDF"}
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <img
                    src={doc.uploadedFile}
                    alt={doc.title || "Uploaded file"}
                    className="object-contain w-full h-full"
                  />
                )
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  {doc.title?.trim() ? "+ Upload File" : "Enter name first"}
                </div>
              )}

              {!loadingStates[idx] && doc.uploadedFile && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => handleRemove(idx, e)}
                    className="bg-red-500 text-white text-xs px-3 py-1 rounded shadow"
                  >
                    Remove
                  </button>
                </div>
              )}

              {!loadingStates[idx] && !doc.uploadedFile && (
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleUpload(e, idx)}
                  disabled={!doc.title?.trim()}
                />
              )}
            </div>
          </div>
        ))}

        {/* Add more slot */}
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

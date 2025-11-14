"use client";
import { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import {NotesTimeLine} from "../../Areas/ProjectRequestedByUser/Notesmanagent.jsx";
import {RejectPopup} from "../../Areas/ProjectRequestedByUser/RejectPopup.jsx";
import { useRouter } from "next/navigation";
import {formatDateToUS } from "../../../lib/utils/dateFormatter.js";

export function RequestDet({ projectid }) {

    const router = useRouter();
  const [projectdetails, setProjectDetails] = useState(null);
   const [approvecreatebutton,setapprovecreatebutton] = useState(false);
     const [activeTab, setActiveTab] = useState("requests for more info");

     const tabs = [
    { id: "requests for more info", label: "Message Pro" },
    { id: "reject", label: "Reject" },
     
  ];


  const fetchRoofingRequestDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-project-request-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
          },
          body: JSON.stringify({ id: projectid }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result = await response.json();
      setProjectDetails(result.data);
    } catch (error) {
      console.log("Error fetching roofing request details:", error);
    }
  };


  useEffect(() => {
    fetchRoofingRequestDetails();
  }, []);


  if (!projectdetails) {
    return <div>Loading...</div>;
  }


  // 🔹 Group files by type
  const groupFilesByType = (files) =>
    files.reduce((acc, file) => {
      if (!acc[file.fileType]) acc[file.fileType] = [];
      acc[file.fileType].push(file);
      return acc;
    }, {});


   const createproject = async (data)=>{
    debugger;
       if (!confirm("Are you sure you want to create the selected item(s)?")) {
        return null; // user pressed Cancel
      }
      setapprovecreatebutton(true);
       
        // alert(data);

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-project-request/${data}`,{
              method : "GET",
              headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
            },
        });

        if(res.ok){
          const result = await res.json();
          if(result.status == 200)
          {

             

             router.push(`/admin/create-project/${result.data}`);

          }
        }
        fetchRoofingRequestDetails();
        setapprovecreatebutton(false);
     }

     const handleDataFromChild= async ()=>{
        fetchRoofingRequestDetails();
     }


  return (
    <div className="p-10 overflow-y-auto flex-1">
      
     <div className="flex justify-between items-center mt-6">
  {/* Status Badge */}
  <div>
    {(() => {
      const statusMap = {
        "0": { label: "Need Review", color: "bg-yellow-100 text-yellow-800" },
        "1": { label: "Created / Approved", color: "bg-green-100 text-green-800" },
        "2": { label: "Rejected", color: "bg-red-100 text-red-800" },
      };
      const status = statusMap[projectdetails.status] || { label: "Unknown", color: "bg-gray-100 text-gray-800" };
      return (
        <span className={`px-3 py-1 rounded text-sm font-medium ${status.color}`}>
          {status.label}
        </span>
      );
    })()}
  </div>

 
      

        {projectdetails.status == "0" &&(
            <button
                onClick={() => {
                    createproject(projectdetails.id);
                }}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-[#1E1E3E] transition">
                {approvecreatebutton == true ? "Creating..." : " Approve & Create Project"}
            </button>   
        )}


        </div>



      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-6">
        {/* Reason for rejection */}


        {projectdetails.Reason && (
          <div className="border rounded-lg p-4 sm:col-span-2 border-red-500">
            <dt className="font-semibold text-gray-900">Reason For Rejection</dt>
            <dd className="text-gray-700">{projectdetails.Reason}</dd>
          </div>
        )}

        
        {/* Key fields */}
        {[
          ["Full Name", projectdetails.fullName],
          ["Request ID", projectdetails.RequestID],
          ["Email Address", projectdetails.emailAddress],
          ["Phone Number", projectdetails.phoneNumber],
          ["Preferred Contact Method", projectdetails.preferredContactMethod],
          ["Preferred Calling Time", projectdetails.preferredCallingTime],
          ["Project Title", projectdetails.projectTitle],
          ["Project Address", projectdetails.projectAddress],
          ["Product Type", projectdetails.productType],
          ["Product Color", projectdetails.productColor],
          ["Product Preference", projectdetails.productPreference],
          ["Posted Date", formatDateToUS(projectdetails.createdAt)],
        ].map(
          ([label, value], idx) =>
            value && (
              <div key={idx} className="border rounded-lg p-4">
                <dt className="font-semibold text-gray-900">{label}</dt>
                <dd className="text-gray-700">{value}</dd>
              </div>
            )
        )}

        {/* Project details */}
        {projectdetails.projectDetails && (
          <div className="border rounded-lg p-4 sm:col-span-2">
            <dt className="font-semibold text-gray-900">Project Details</dt>
            <dd className="text-gray-700">{projectdetails.projectDetails}</dd>
          </div>
        )}

        {/* Work description */}
        {projectdetails.workDescription && (
          <div className="border rounded-lg p-4 sm:col-span-2">
            <dt className="font-semibold text-gray-900">Work Description</dt>
            <dd className="text-gray-700">{projectdetails.workDescription}</dd>
          </div>
        )}

        {/* Files grouped by type */}
        {projectdetails.files &&
          projectdetails.files.length > 0 &&
          Object.entries(groupFilesByType(projectdetails.files)).map(
            ([type, files]) => (
              <div key={type} className="border rounded-lg p-4 sm:col-span-2">
                <dt className="font-semibold text-gray-900 mb-2">
                  {type.toUpperCase()} Files
                </dt>
                <dd className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, idx) => {
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                      file.originalName
                    );
                    const isPDF = /\.pdf$/i.test(file.originalName);

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-start border rounded p-2 bg-gray-50"
                      >
                        {/* Image preview */}
                        {isImage && (
                          <div className="relative w-full h-40 overflow-hidden rounded group">
                            <img
                              src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${file.fileUrl}`}

                              alt={file.originalName}
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-150"
                            />
                            <button
                              onClick={() =>
                                window.open(
                                  `${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${file.fileUrl}`,
                                  "_blank"
                                )
                              }
                              className="absolute top-2 right-2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
                            >
                              👁
                            </button>
                          </div>
                        )}

                        {/* PDF preview */}
                        {isPDF && (
                          <div className="relative w-full h-40 overflow-hidden rounded group border bg-white">
                            <iframe
                              src={`${process.env.NEXT_PUBLIC_URL}${file.fileUrl}`}
                              title={file.originalName}
                              className="w-full h-full pointer-events-none"
                            />
                            <button
                              onClick={() =>
                                window.open(
                                  `${process.env.NEXT_PUBLIC_URL}${file.fileUrl}`,
                                  "_blank"
                                )
                              }
                              className="absolute top-2 right-2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
                            >
                              👁
                            </button>
                          </div>
                        )}

                        {/* Download link */}
                        <div className="flex items-center space-x-2 mt-2">
                          <ArrowDownTrayIcon className="w-5 h-5 text-gray-700" />
                          <a
                            href={`${process.env.NEXT_PUBLIC_URL}${file.fileUrl}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm break-words"
                          >
                            {file.originalName}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </dd>
              </div>
            )
          )}
      </dl>
      <div className="md:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 mt-5">
           
            <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-xl">
                {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                        ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
                ))}
            </div>

          
            <div className="p-6">
            

                {activeTab === "requests for more info" && (
                    <div className="space-y-3">

                       <NotesTimeLine companyid={projectdetails.id}  projectstatus={projectdetails.status}></NotesTimeLine>


                    </div>
                
                )}

                {activeTab === "reject" && (
           <div className="space-y-3">
  {projectdetails.status === "0" && (
    <RejectPopup sendData={handleDataFromChild} id={projectdetails.id} />
  )}

  {projectdetails.status === "1" && (
    <div className="text-green-700 p-4 border border-green-300 rounded bg-green-50">
      <dt className="font-semibold text-gray-900">Project Status</dt>
      <dd className="text-gray-700">Project Created / Approved</dd>
    </div>
  )}

  {projectdetails.status === "2" && (
    <div className="text-red-700 p-4 border border-red-300 rounded bg-red-50">
      <dt className="font-semibold text-gray-900">Reason For Rejection</dt>
      <dd className="text-gray-700">{projectdetails.Reason}</dd>
    </div>
  )}
</div>


                )}

            
            </div>
     </div>
 {approvecreatebutton ? (

        <div className="fixed inset-0 flex flex-col items-center justify-center  bg-opacity-50 z-50">
          <svg
            aria-hidden="true"
            className="w-12 h-12 mb-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>  
          <p className="text-black text-xl font-semibold">Creating Project...</p>
        </div>




      ) : (<div></div>)}
    </div>
  );
}

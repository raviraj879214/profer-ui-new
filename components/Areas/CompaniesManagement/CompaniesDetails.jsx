"use client";
import { useEffect, useState } from "react";
import { Mail, Phone, User2, Briefcase, Key } from "lucide-react";
import {formatDateToUS} from "../../../lib/utils/dateFormatter";
import {RejectPopup} from "../../Areas/CompaniesManagement/RejectModal";
import {BlockPopup} from "../../Areas/CompaniesManagement/BlockModal";
import {NotesTimeLine} from "../../Areas/CompaniesManagement/Notesmanagent";
import {CompanyInfoTimeLine} from "../../Areas/CompaniesManagement/Companyinfo";
export function CompaniesDetail({ id }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 const [approvebutton,setapprovebutton] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
const [NotePopup,setNotePopup] = useState(false);
  const [companyinfomodal , setcompanyinfomodal] = useState(false);
  const [unblockrow,setUnBlockrow] = useState(false);
  const [userId, setUserId] = useState(id);

  const tabs = [
    { id: "notes", label: "Notes" },
    { id: "requests for more info", label: "Request More Info" },
    { id: "reject", label: "Reject" },
     { id: "block", label: "Block" },
  ];



   const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
          },
        });
        if (!res.ok) {
          console.error("Failed to fetch user:", res.status);
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user || null);
      } catch (err) {
        console.error("Error loading user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };



  useEffect(() => {
    if (!id) return;
   
    fetchUser();
  }, [userId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6 text-red-500">User not found</p>;

  const { businessDetails, credentials } = user;
 

const approveselected = async (id) => {
  setapprovebutton(true);

  if (!confirm("Are you sure you want to approve the selected item(s)?")) {
    setapprovebutton(false);
    return; // user pressed Cancel
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/approve-companies/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
        },
      }
    );

    if (res.ok) {
      const result = await res.json();
      if (result.status === 200) {
        // Update user state with the new status
        // setUser((prevUser) => ({
        //   ...prevUser,
        //   status: "4", // Approved
        // }));
        fetchUser();
      }
    }
  } catch (err) {
    console.log("Error approving company:", err);
  } finally {
    setapprovebutton(false);
  }
};


  const unblockSelected = async (id) => {
    debugger;
      if (!confirm("Are you sure you want to un-block the selected item(s)?")) {
        return null; // user pressed Cancel
      }
    setUnBlockrow(true);
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/un-block-companies/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
          },
        }
      );
      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
        //   setUser((prevUser) => ({
        //   ...prevUser,
        //   status: "4", // Approved
        // }));
         fetchUser();
        }
      }
    } catch (err) {
      console.error("Error deleting companies:", err);
    }
    setUnBlockrow(false);
  };






 const handleDataFromChild = (value) => {
   fetchUser();
 }


const handleDataBlockChild= (value) =>{
    fetchUser();
 }



  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Profile Header */}
      
      
        <div className="bg-white shadow rounded-2xl p-6 mb-10 relative flex flex-col md:flex-row md:items-center md:space-x-6">
  {/* Status Label Top Left */}
  <div className="absolute top-4 left-4">
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        user.status === "-1"
          ? "bg-gray-100 text-gray-700"
          : user.status === "0"
          ? "bg-yellow-100 text-yellow-700"
          : user.status === "4"
          ? "bg-green-100 text-green-700"
          : user.status === "5"
          ? "bg-red-100 text-red-700"
          : user.status === "6"
          ? "bg-gray-100 text-gray-700"
          : user.status === "7"
          ? "bg-red-200 text-red-700"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {user.status === "-1"
        ? "Free Trial"
        : user.status === "0"
        ? "Pending"
        : user.status === "4"
        ? "Approved"
        : user.status === "5"
        ? "Blocked"
        : user.status === "6"
        ? "Expired"
        : user.status === "7"
        ? "Rejected"
        : "Unknown"}
    </span>
  </div>

  {/* Action Buttons Top Right */}
  <div className="absolute top-4 right-4 flex space-x-3">
    {user.status === "0" && (
      <button
        onClick={() => approveselected(id)}
        className="bg-gray-900 text-white px-3 py-1 rounded"
      >
        {approvebutton ? "Approving" : "Approve"}
      </button>
    )}
    {user.status === "5" && (
      <button onClick={()=> unblockSelected(id) } className="bg-yellow-500 text-white px-3 py-1 rounded ">

         {unblockrow == false ? "UnBlock" : "UnBlocking"}

      </button>
    )}
  </div>

  {/* Company Logo */}
  <img
    src={businessDetails?.companyLogo || "/default-avatar.png"}
    alt="Company Logo"
    className="w-24 h-24 rounded-full border object-cover mb-4 md:mb-0"
  />

  {/* User Info */}
  <div className="flex-1">
    <h1 className="text-2xl font-bold text-gray-800">
      {user.firstname} {user.lastname}
    </h1>
    <p className="text-gray-600 flex items-center">
      <Mail className="w-4 h-4 mr-2" /> {user.email}
    </p>
    <p className="text-gray-600 flex items-center">
      <Phone className="w-4 h-4 mr-2" /> {user.phone || "—"}
    </p>

    {/* Reject/Block Reason Boxes */}
    {(user.rejectReason && user.status == "7") && (
      <div className="border border-red-500 bg-red-50 text-red-700 rounded-lg p-3 mt-4">
        <span className="font-semibold">Rejected Reason:</span> {user.rejectReason}
      </div>
    )}

    {(user.blockReason && user.status == "5")  && (
      <div className="border border-red-500 bg-red-50 text-red-700 rounded-lg p-3 mt-4">
        <span className="font-semibold">Blocked Reason:</span> {user.blockReason}
      </div>
    )}



  </div>
</div>





      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Details - Full Row */}
        <section className="md:col-span-2">
        {/* Reject Reason */}





          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <User2 className="w-5 h-5 mr-2 text-indigo-500" /> User Details
          </h2>
          <div className="bg-white rounded-xl shadow p-6 space-y-3">
            <p><span className="font-semibold">Full Name:</span> {user.firstname} {user.lastname}</p>
            <p><span className="font-semibold">Address:</span> {user.address}, {user.city}, {user.state}, {user.zipCode}</p>
            <p><span className="font-semibold">Start Date:</span> {formatDateToUS(user.startdate)}</p>
            <p><span className="font-semibold">End Date:</span> {formatDateToUS(user.enddate)}</p>
            {user.rejectReason && <p><span className="font-semibold">Rejected Reason:</span> {user.rejectReason}</p>}
            {user.blockReason && <p><span className="font-semibold">Blocked Reason:</span> {user.blockReason}</p>}
          </div>
        </section>

        {/* Business Details - Full Row */}
        {businessDetails && (
          <section className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-yellow-500" /> Business Details
            </h2>
            <div className="bg-white rounded-xl shadow p-6 space-y-3">
              <div className="flex items-center space-x-4 mb-4">
                {businessDetails.companyLogo && (
                  <img src={businessDetails.companyLogo} alt="Company Logo" className="w-20 h-20 rounded border object-cover" />
                )}
                {businessDetails.ownerLicense && (
                  <img src={businessDetails.ownerLicense} alt="Owner License" className="w-20 h-20 rounded border object-cover" />
                )}
              </div>
              <p><span className="font-semibold">Company Name:</span> {businessDetails.companyName}</p>
              <p><span className="font-semibold">Owner:</span> {businessDetails.ownerFirstName} {businessDetails.ownerLastName}</p>
              <p><span className="font-semibold">Email:</span> {businessDetails.ownerEmail}</p>
              <p><span className="font-semibold">Office Address:</span> {businessDetails.streetAddress}, {businessDetails.city}, {businessDetails.state}, {businessDetails.zip}</p>
              <p><span className="font-semibold">Phone:</span> {businessDetails.companyPhone}</p>
              <p><span className="font-semibold">Website:</span> {businessDetails.website}</p>
              <p><span className="font-semibold">Experience Years:</span> {businessDetails.experienceYears}</p>
              <p><span className="font-semibold">EIN:</span> {businessDetails.ein}</p>

              {/* Services */}
              <div>
                <span className="font-semibold">Services:</span>
                <div className="flex overflow-x-auto gap-2 mt-1 py-1">
                  {businessDetails.services ? JSON.parse(businessDetails.services).map((service, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex-shrink-0">{service}</span>
                  )) : "N/A"}
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <span className="font-semibold">Qualifications:</span>
                <div className="flex overflow-x-auto gap-2 mt-1 py-1">
                  {businessDetails.qualifications ? JSON.parse(businessDetails.qualifications).map((q, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex-shrink-0">{q}</span>
                  )) : "N/A"}
                </div>
              </div>

              {/* Verified Status */}
              <p>
                <span className="font-semibold">Pro Verified:</span>{" "}
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.verifiedStatus == 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {user.verifiedStatus == 0 ? "UnVerified" : "Verified"}
                </span>
              </p>
            </div>
          </section>
        )}

        {/* Credentials - Full Width */}
      {/* Credentials - Full Width Grid */}
{credentials && credentials.length > 0 && (
  <section className="md:col-span-2">
    <div className="border rounded-lg p-4 bg-white shadow">
      <dt className="font-semibold text-gray-900">Credentials</dt>
      <div className="mt-3 space-y-4">
        {Object.entries(
          credentials.reduce((acc, cred) => {
            if (!acc[cred.section]) acc[cred.section] = [];
            acc[cred.section].push(cred);
            return acc;
          }, {})
        ).map(([section, creds]) => (
          <div key={section}>
            <h4 className="text-md font-semibold text-gray-800 mb-2">{section}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {creds.map((cred) => {
                const fileUrl = `${process.env.NEXT_PUBLIC_URL}${cred.fileUrl}`;
                const isPDF = fileUrl.toLowerCase().endsWith(".pdf");
                return (
                  <div key={cred.id} className="border rounded-lg p-2 flex flex-col items-center text-center">
                    <div className="w-28 h-36 flex items-center justify-center">
                      {isPDF ? (
                        <embed
                          src={fileUrl}
                          type="application/pdf"
                          className="w-full h-full border rounded bg-gray-100 object-contain"
                        />
                      ) : (
                        <img
                          src={fileUrl}
                          alt={cred.name}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between w-full mt-2">
                      <p className="text-sm text-gray-700 text-left break-words flex-1">{cred.name}</p>
                      <button
                        onClick={() => window.open(fileUrl, "_blank")}
                        className="text-gray-600 hover:text-gray-900 ml-2 flex-shrink-0"
                        title="View in new tab"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <p className="text-xs font-medium mt-1 flex items-center gap-2">
                      {cred.expirationDate ? (() => {
                        const expDate = new Date(cred.expirationDate);
                        const today = new Date();
                        const soon = new Date();
                        soon.setDate(today.getDate() + 30);

                        if (expDate < today) {
                          return (
                            <>
                              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold">Expired</span>
                              <span>{formatDateToUS(cred.expirationDate)}</span>
                            </>
                          );
                        } else if (expDate < soon) {
                          return (
                            <>
                              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-semibold">Expires Soon</span>
                              <span>{formatDateToUS(cred.expirationDate)}</span>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Valid</span>
                              <span>{formatDateToUS(cred.expirationDate)}</span>
                            </>
                          );
                        }
                      })() : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

<div className="md:col-span-2">
  {/* Tab headers */}
  <div className="flex border-b border-gray-300">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={`px-4 py-2 -mb-px font-medium ${
          activeTab === tab.id
            ? "border-b-2 border-blue-500 text-blue-500"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>

  {/* Tab content */}
  <div className="p-4 w-full">


    {activeTab === "notes" && (<>
      <NotesTimeLine companyid={id} setNotePopup={setNotePopup}></NotesTimeLine>
    </>)}
    {activeTab === "requests for more info" && (
      <CompanyInfoTimeLine companyid={user.id} setcompanyinfomodal={setcompanyinfomodal} projectstatus={user.status} />
    )}

   {/* Reject Tab */}
    {activeTab === "reject" && (
      user.status.toString() === "0" ? (
         <RejectPopup sendData={handleDataFromChild} userid={user.id} />
        
      ) : (
       <div className="text-gray-500 p-4 border rounded">Allows only when user is Pending</div>
      )
    )}

    {/* Block Tab */}
    {activeTab === "block" && (
      user.status.toString() === "4" ? (
         <BlockPopup sendData={handleDataBlockChild} userid={user.id} />
        
      ) : (
       <div className="text-gray-500 p-4 border rounded">Allows only when user is Approved</div>
      )
    )}
  </div>

  
</div>






      </main>
    </div>
  );
}

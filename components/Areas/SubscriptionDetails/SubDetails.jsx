"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
export function SubscriionInfo() {
    const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    if (userId) {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
          },
        });

        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load user data:", err);
        setLoading(false);
      }
    };

    fetchUser(); // ← this just calls the async function we defined
  }
}, [userId]);

if (loading) return <p className="p-4">Loading...</p>;
if (!user) return <p className="p-4 text-red-500">User not found.</p>;
 return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

  <div className="flex flex-col md:flex-row md:space-x-12 gap-y-12">
    {/* Personal Details */}
    <section className="bg-white rounded-2xl shadow-md p-8 flex-1 border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Personal Details</h2>
      <div className="space-y-4">
        <DetailRow label="Name" value={`${user.firstname} ${user.lastname}`} />
        <DetailRow label="Email" value={user.email} />
        <DetailRow label="Address" value={user.address} />
        <DetailRow label="City" value={user.city || "N/A"} />
        <DetailRow label="State" value={user.state || "N/A"} />
        <DetailRow label="Zip Code" value={user.zipCode || "N/A"} />
      </div>
    </section>

    {/* Business Details */}
    <section className="bg-white rounded-2xl shadow-md p-8 flex-1 border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Business Details</h2>

      {/* Company Logo */}
      <div className="mb-6 flex justify-center">
        {user.businessDetails?.companyLogo ? (
          <img
            src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${user.businessDetails.companyLogo}`}
            alt="Company Logo"
            className="w-32 h-32 rounded-full object-cover shadow-lg"
          />
        ) : (
          <p className="text-center">N/A</p>
        )}
      </div>

      <div className="space-y-4">
        <DetailRow label="Company Name" value={user.businessDetails?.companyName || "N/A"} />
        <DetailRow label="Company Phone" value={user.businessDetails?.companyPhone || "N/A"} />
        <DetailRow label="Company Email" value={user.businessDetails?.companyEmail || "N/A"} />
        <DetailRow label="Street Address" value={user.businessDetails?.streetAddress} />
       <DetailRow
  label="Address"
  value={
    user.businessDetails
      ? `${user.businessDetails.city || "N/A"}, ${user.businessDetails.state || "N/A"}, ${user.businessDetails.zip || "N/A"}`
      : "N/A"
  }
/>

        {/* <DetailRow label="City" value={user.businessDetails?.city || "N/A"} />
        <DetailRow label="State" value={user.businessDetails?.state || "N/A"} />
        <DetailRow label="Zip" value={user.businessDetails?.zip || "N/A"} /> */}
        <DetailRow label="EIN" value={user.businessDetails?.ein || "N/A"} />
        <DetailRow
  label="Owner Name"
  value={
    user.businessDetails
      ? `${user.businessDetails.ownerFirstName || "N/A"} ${user.businessDetails.ownerLastName || ""}`.trim()
      : "N/A"
  }
/>

        {/* <DetailRow label="Owner First Name" value={user.businessDetails?.ownerFirstName || "N/A"} />
        <DetailRow label="Owner Last Name" value={user.businessDetails?.ownerLastName || "N/A"} /> */}
        <DetailRow label="Owner Email" value={user.businessDetails?.ownerEmail || "N/A"} />
        <DetailRow
  label="Services"
  value={
    user.businessDetails?.services ? (
      <div className="flex flex-wrap gap-2">
        {JSON.parse(user.businessDetails.services).map((service, idx) => (
          <span
            key={idx}
            className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
          >
            {service}
          </span>
        ))}
      </div>
    ) : (
      "N/A"
    )
  }
/>

        {/* <DetailRow label="Services" value={user.businessDetails?.services? JSON.parse(user.businessDetails.services).join(", "): "N/A"} /> */}
        {/* <DetailRow label="Qualifications" value={user.businessDetails?.qualifications ? JSON.parse(user.businessDetails.qualifications).join(", ") :"N/A"} /> */}
        <DetailRow
  label="Qualifications"
  value={
    user.businessDetails?.qualifications ? (
      <div className="flex flex-wrap gap-2">
        {JSON.parse(user.businessDetails.qualifications).map((qualification, idx) => (
          <span
            key={idx}
            className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
          >
            {qualification}
          </span>
        ))}
      </div>
    ) : (
      "N/A"
    )
  }
/>

        <DetailRow label="Phone" value={user.businessDetails?.phone || "N/A"} />
        <DetailRow label="Experience Years" value={user.businessDetails?.experienceYears || "N/A"} />
        {/* <DetailRow label="Website" value={user.businessDetails?.website || "N/A"} />
        <DetailRow label="Maps" value={user.businessDetails?.maps || "N/A"} />
        <DetailRow label="Facebook" value={user.businessDetails?.facebook || "N/A"} />
        <DetailRow label="Google Business Listing" value={user.businessDetails?.googlebusinesslisting || "N/A"} />
        <DetailRow label="Bing Business Listing" value={user.businessDetails?.bingbusinesslisting || "N/A"} />
        <DetailRow label="LinkedIn" value={user.businessDetails?.linkedin || "N/A"} />
        <DetailRow label="Link To Your Website" value={user.businessDetails?.linktoyourwebsite || "N/A"} /> */}
      </div>
    </section>
  </div>

  {/* Stripe Details  */}
<section className="bg-white rounded-2xl shadow-md p-8 flex-1 border rounded-lg p-6 hover:shadow-lg transition-shadow">
    <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Stripe Details</h2>
    {user.subscriptions && user.subscriptions.length > 0 ? (
      <div className="space-y-4">
      {user.subscriptions.map((sub) => (
  <div key={sub.SubscriptionID} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
    <div className="space-y-4">
      <DetailRow label="Stripe Subscription ID" value={sub.StripeSubscriptionID || "N/A"} />
      <DetailRow label="Plan Name" value={sub.PlanName || "N/A"} />
      <DetailRow label="Plan Type" value={sub.PlanType || "N/A"} />
      <DetailRow label="Amount" value={sub.Amount ? Number(sub.Amount).toFixed(2) : "N/A"} />
      <DetailRow label="Currency" value={sub.Currency || "N/A"} />
      <DetailRow label="Subscription Start Date" value={sub.StartDate ? new Date(sub.StartDate).toLocaleDateString() : "N/A"} />
      <DetailRow label="Subscription End Date" value={sub.EndDate ? new Date(sub.EndDate).toLocaleDateString() : "N/A"} />
      <DetailRow label="Renewal Period" value={sub.RenewalPeriod || "N/A"} />
      <DetailRow label="Status" value={sub.Status || "N/A"} />
      <DetailRow label="Customer ID" value={sub.customerId || "N/A"} />
      <DetailRow label="Email" value={sub.email || "N/A"} />
      <DetailRow label="Invoice ID" value={sub.invoiceId || "N/A"} />
      <DetailRow
        label="Invoice URL"
        value={
          sub.invoiceUrl ? (
            <a
              href={sub.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              View Invoice
            </a>
          ) : (
            "N/A"
          )
        }
      />
    </div>

    {/* Invoice PDF Button */}
    {sub.invoicePdf ? (
      <button
        onClick={() => window.open(sub.invoicePdf, "_blank")}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        aria-label={`View Invoice PDF for subscription ${sub.SubscriptionID}`}
      >
        View Invoice PDF
      </button>
    ) : (
      <p>Invoice PDF: N/A</p>
    )}
  </div>
))}

      </div>
    ) : (
      <p className="text-gray-600">No subscriptions found.</p>
    )}
  </section>

</div>

//     <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

//   {/* Personal Details */}
//   <section className="bg-white rounded-2xl shadow-lg p-6">
//     <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Personal Details</h2>
//     <p className="text-gray-700">User ID: {user.id}</p>
//     <p>Name: {user.firstname} {user.lastname}</p>
//     <p>Email: {user.email}</p>
//     <p>Address: {user.address}</p>
//     <p>City: {user.city || "N/A"}</p>
//     <p>State: {user.state || "N/A"}</p>
//     <p>Zip Code: {user.zipCode || "N/A"}</p>
//   </section>

//   {/* Business Details */}
//   <section className="bg-white rounded-2xl shadow-lg p-6">
//     <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Business Details</h2>
//     <p>Company Name: {user.businessDetails?.companyName || "N/A"}</p>
//     <p>Company Phone: {user.businessDetails?.companyPhone || "N/A"}</p>
//     <p>Company Email: {user.businessDetails?.companyEmail || "N/A"}</p>
//     <p>Street Address: {user.businessDetails?.streetAddress || "N/A"}</p>
//     <p>City: {user.businessDetails?.city || "N/A"}</p>
//     <p>State: {user.businessDetails?.state || "N/A"}</p>
//     <p>Zip: {user.businessDetails?.zip || "N/A"}</p>
//     <p>EIN: {user.businessDetails?.ein || "N/A"}</p>

//     <p>Owner First Name: {user.businessDetails?.ownerFirstName || "N/A"}</p>
//     <p>Owner Last Name: {user.businessDetails?.ownerLastName || "N/A"}</p>
//     <p>Owner Email: {user.businessDetails?.ownerEmail || "N/A"}</p>

//     <p>Services: {user.businessDetails?.services || "N/A"}</p>
//     <p>Qualifications: {user.businessDetails?.qualifications || "N/A"}</p>

//     {/* Images */}
//     <div className="mt-6 flex flex-col md:flex-row md:space-x-10 space-y-6 md:space-y-0">
//       <div>
//         <p className="font-semibold mb-1">Company Logo:</p>
//         {user.businessDetails?.companyLogo ? (
//           <img
//             src={user.businessDetails.companyLogo}
//             alt="Company Logo"
//             className="max-w-xs max-h-40 object-contain rounded"
//           />
//         ) : (
//           <p>N/A</p>
//         )}
//       </div>
//       <div>
//         <p className="font-semibold mb-1">Owner License:</p>
//         {user.businessDetails?.ownerLicense ? (
//           <img
//             src={user.businessDetails.ownerLicense}
//             alt="Owner License"
//             className="max-w-xs max-h-40 object-contain rounded"
//           />
//         ) : (
//           <p>N/A</p>
//         )}
//       </div>
//     </div>

//     <p className="mt-6">Phone: {user.businessDetails?.phone || "N/A"}</p>
//     <p>Experience Years: {user.businessDetails?.experienceYears || "N/A"}</p>
//     <p>Website: {user.businessDetails?.website || "N/A"}</p>
//     <p>Maps: {user.businessDetails?.maps || "N/A"}</p>

//     <p>Facebook: {user.businessDetails?.facebook || "N/A"}</p>
//     <p>Google Business Listing: {user.businessDetails?.googlebusinesslisting || "N/A"}</p>
//     <p>Bing Business Listing: {user.businessDetails?.bingbusinesslisting || "N/A"}</p>
//     <p>LinkedIn: {user.businessDetails?.linkedin || "N/A"}</p>
//     <p>Link To Your Website: {user.businessDetails?.linktoyourwebsite || "N/A"}</p>
//   </section>

//   {/* Stripe Details */}
//   <section className="bg-white rounded-2xl shadow-md p-8">
//     <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Stripe Details</h2>
//     {user.subscriptions && user.subscriptions.length > 0 ? (
//       <div className="space-y-6 text-gray-800">
//         {user.subscriptions.map((sub) => (
//           <div
//             key={sub.SubscriptionID}
//             className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
//           >
//             <DetailRow label="Subscription ID" value={sub.SubscriptionID} />
//             <DetailRow label="Stripe Subscription ID" value={sub.StripeSubscriptionID || "N/A"} />
//             <DetailRow label="Plan Name" value={sub.PlanName || "N/A"} />
//             <DetailRow label="Plan Type" value={sub.PlanType || "N/A"} />
//             <DetailRow label="Amount" value={sub.Amount ? Number(sub.Amount).toFixed(2) : "N/A"} />
//             <DetailRow label="Currency" value={sub.Currency || "N/A"} />
//             <DetailRow label="Start Date" value={sub.StartDate ? new Date(sub.StartDate).toLocaleDateString() : "N/A"} />
//             <DetailRow label="End Date" value={sub.EndDate ? new Date(sub.EndDate).toLocaleDateString() : "N/A"} />
//             <DetailRow label="Renewal Period" value={sub.RenewalPeriod || "N/A"} />
//             <DetailRow label="Status" value={sub.Status || "N/A"} />
//             <DetailRow label="Customer ID" value={sub.customerId || "N/A"} />
//             <DetailRow label="Email" value={sub.email || "N/A"} />
//             <DetailRow label="Invoice ID" value={sub.invoiceId || "N/A"} />
//             <DetailRow
//               label="Invoice URL"
//               value={
//                 sub.invoiceUrl ? (
//                   <a
//                     href={sub.invoiceUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline hover:text-blue-800"
//                   >
//                     View Invoice
//                   </a>
//                 ) : (
//                   "N/A"
//                 )
//               }
//             />

//             {/* Invoice PDF Button */}
//             {sub.invoicePdf ? (
//               <button
//                 onClick={() => window.open(sub.invoicePdf, "_blank")}
//                 className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                 aria-label={`View Invoice PDF for subscription ${sub.SubscriptionID}`}
//               >
//                 View Invoice PDF
//               </button>
//             ) : (
//               <p>Invoice PDF: N/A</p>
//             )}
//           </div>
//         ))}
//       </div>
//     ) : (
//       <p className="text-gray-600">No subscriptions found.</p>
//     )}
//   </section>

// </div>

 );
}

// Helper component for label/value rows
function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:space-x-4">
      <span className="w-40 font-semibold text-gray-700">{label}:</span>
      <span className="text-gray-900 break-words">{value}</span>
    </div>
  );
}
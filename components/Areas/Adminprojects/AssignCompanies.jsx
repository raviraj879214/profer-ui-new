'use client';

import { useEffect, useState } from "react";
import { CompanyMultiSelect } from "../../Areas/Adminprojects/ComapniesList";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {ProjectInvite} from "../../../components/Areas/Adminprojects/InviteProjectPros";


export function AssignCompany({ requestid = 0 , onStep  }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [invitemodal, setinvitemodal] = useState(false);
  const [triggercompanyselect,settriggercompanyselect] = useState(0);
  const [stepname,setstepname] = useState("step2");

  const router = useRouter();

  // Fetch project details and preselect companies
  const fetchRoofingRequestDetails = async () => {
    if (parseInt(requestid) > 0) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/get-project-details-by-id/${requestid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.ok) {
          const result = await res.json();
          if (result.status === 200) {
            const selectedIds =
              typeof result.data.prosId === "string"
                ? result.data.prosId.split(",").map((id) => id.trim())
                : [];

            const matchedCompanies = companyOptions.filter((company) =>
              selectedIds.includes(company.value.toString())
            );
            setSelectedCompanies(matchedCompanies);

            setValue("startdate", result.data.startdate);
            setValue("enddate", result.data.enddate);
          }
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
      }
    }
  };

  useEffect(() => {
    if (companyOptions.length > 0) {
      fetchRoofingRequestDetails();
    }
  }, [companyOptions]);

  // Step 2 submission
  const onSubmitStepTwo = async (data) => {
    try {
      if (selectedCompanies.length === 0) {
        alert("Please select at least one company before submitting.");
        return;
      }

      const token = localStorage.getItem("token");
      const formData = new FormData();

      const ids = selectedCompanies.map((c) => c.value).join(",");
      formData.append("prosId", ids);
      formData.append("status", "0");
      formData.append("requestid", requestid);

      formData.append("stepstatus", stepname);

      Object.keys(data).forEach((key) =>
        formData.append(key, data[key] || "")
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/create-project`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (res.ok) {
          if(stepname == "step3"){
            router.push("/admin/projects");
          }
         


      } else {
        const result = await res.json();
        alert(result.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while assigning companies.");
    }
  };


  const inviteprosuccess= (data) =>{
   setstepname("step2");
   settriggercompanyselect(data);
    handleSubmit(onSubmitStepTwo)();
  }



  return (
    <>
      {/* Stepper */}
     

      {/* Company MultiSelect */}
      <form onSubmit={handleSubmit(onSubmitStepTwo)}>
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 mt-5 ">
             <div className="text-center text-xl font-semibold ">
                {requestid > 0 ? "Update" : "Create"} your <span className="text-red-600">Project <sup className="text-sm">™</sup></span>
              </div>

             


           <div className="mt-5 mb-5 mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
          {/* Step 1 */}
          <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              <span className="me-2">1</span>
              Project <span className="hidden sm:inline-flex sm:ms-2">Details</span>
            </span>
          </li>

          {/* Step 2 */}
          <li className="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Assign <span className="hidden sm:inline-flex sm:ms-2">Companies</span>
            </span>
          </li>
        </ol>
      </div>

          <CompanyMultiSelect
            value={selectedCompanies}
            onChange={setSelectedCompanies}
            setOptions={setCompanyOptions}
            onInviteClick={() => setinvitemodal(true)}
            projectrequestid ={requestid}
            comapnystatus= {triggercompanyselect}
          />

          {/* Dates */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            {[
              { id: "startdate", label: "Start Date", type: "date", required: "Start date is required" },
              { id: "enddate", label: "End Date", type: "date", required: "End date is required" },
            ].map((field, i) => (
              <div key={i} className="flex flex-col gap-1">
                <label htmlFor={field.id} className="text-gray-700 text-sm">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  {...register(field.id, {
                    required: field.required || false,
                  })}
                  className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                    errors[field.id]
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-300"
                  }`}
                />
                {errors[field.id] && (
                  <p className="text-red-500 text-xs">{errors[field.id].message}</p>
                )}
              </div>
            ))}
          </div> */}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onStep}
              className="bg-gray-300 rounded-full px-6 py-3 text-gray-800 font-semibold text-lg hover:bg-gray-400 transition"
            >
              ← Back
            </button>

            <button
              onClick={()=> setstepname("step3")}
              type="submit"
              className="bg-[#0C0C2D] rounded-full px-8 py-3 text-white font-semibold text-lg hover:bg-[#1E1E3E] transition">
              Finish →
            </button>
          </div>
        </div>
      </form>

      {/* Invite Modal */}


      <ProjectInvite modalstatus={invitemodal} onClose={() => setinvitemodal(false)} projectrequestid={requestid} onSuccess={inviteprosuccess} />


    </>
  );
}
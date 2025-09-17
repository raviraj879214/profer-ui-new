'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CompanyMultiSelect } from "../../Areas/Adminprojects/ComapniesList";
import {AssignCompany} from "../../../components/Areas/Adminprojects/AssignCompanies";


export function ProjectAuctionForm({ requestid = 0 }) {

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [files, setFiles] = useState({ drawings: null, insurance: null, projectother: null });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [success, Setmessage] = useState("");
  const router = useRouter();
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [lastselectcompanies, setlastselectcompanies] = useState(""); // keep raw prosId
  const [companyOptions, setCompanyOptions] = useState([]);

  const [stepvar,setstepvar] = useState(true);

  const [createdprojectid,setcreatedprojectid] = useState(0);



  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => Setmessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    fetchroofingrequestdetails();
  }, []);

  // Once companyOptions are loaded, map prosId to selectedCompanies
  useEffect(() => {
    if (companyOptions.length > 0 && lastselectcompanies) {
      const ids = lastselectcompanies.split(",").map(id => id.trim());
      const matchedCompanies = companyOptions.filter(opt => ids.includes(opt.value.toString()));
      setSelectedCompanies(matchedCompanies);
    }
  }, [companyOptions, lastselectcompanies]);

  const fetchroofingrequestdetails = async () => {
    if (parseInt(requestid) > 0) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-project-details-by-id/${requestid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          const data = result.data;

          // Prefill text fields
          setValue("fullName", data.fullName);
          setValue("phoneNumber", data.phoneNumber);
          setValue("emailAddress", data.emailAddress);
          setValue("projectTitle", data.projectTitle);
          setValue("propertyType", data.propertyType);
          setValue("budget", data.budget);
          setValue("projectAddress", data.projectAddress);
          setValue("projectDetails", data.projectDetails);
          setValue("productType", data.productType);
          setValue("productColor", data.productColor);
          setValue("productPreference", data.productPreference);
          setValue("workDescription", data.workDescription);
          setValue("startdate", data.startdate);
          setValue("enddate", data.enddate);

          // Store raw prosId for later mapping
          setlastselectcompanies(data.prosId || "");

          // Prefill files
          let drawingsFile = null, insuranceFile = null, projectOtherFile = null, mediaList = [];
          (data.documents || []).forEach(file => {
            const fullUrl = file.fileUrl?.startsWith("http")
              ? file.fileUrl
              : `${process.env.NEXT_PUBLIC_URL}${file.fileUrl}`;
            if (file.fileType === "drawings") {
              drawingsFile = { url: fullUrl, name: file.originalName };
            } else if (file.fileType === "insurance") {
              insuranceFile = { url: fullUrl, name: file.originalName };
            } else if (file.fileType === "projectother") {
              projectOtherFile = { url: fullUrl, name: file.originalName };
            } else if (file.fileType === "mediaFiles") {
              mediaList.push({ url: fullUrl, name: file.originalName });
            }
          });
          setFiles({ drawings: drawingsFile, insurance: insuranceFile, projectother: projectOtherFile });
          setMediaFiles(mediaList);
        }
      }
    }
  };


  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) setFiles(prev => ({ ...prev, [field]: file }));
    e.target.value = null;
  };

  const handleRemove = (field) => {
    if (confirm("Are you sure to delete ?")) {
      const fileData = files[field];
      let fileUrl = '';
      if (!fileData) fileUrl = 'No file';
      else if (fileData instanceof File) fileUrl = URL.createObjectURL(fileData);
      else if (fileData.url) fileUrl = fileData.url;
      else fileUrl = 'Unknown';

      deletimagesprojectdocuments(requestid, field, fileUrl);
      setFiles(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleMultipleFiles = (e) => {
    const filesArr = Array.from(e.target.files);
    setMediaFiles(prev => [...prev, ...filesArr].slice(0, 5));
    e.target.value = null;
  };

  const handleRemovemultiple = (index, file, field) => {
    if (confirm("Are you sure to delete this ?")) {
      deletimagesprojectdocuments(requestid, field, file.url);
      setMediaFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

 const onSubmit = async (data) => {
  debugger;
  try {

    // if (selectedCompanies.length === 0) {
    //   alert("Please select at least one company before submitting.");
    //   return;
    // }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("status", "0");
    
    formData.append("stepstatus", "step1");
    // const ids = selectedCompanies.map((c) => c.value).join(",");
    // setlastselectcompanies(ids);
    // formData.append("prosId", ids);


    formData.append("requestid", requestid);

    Object.keys(data).forEach((key) => formData.append(key, data[key] || ""));

    Object.keys(files).forEach((key) => {
      const value = files[key];
      if (value instanceof File) formData.append(key, value);
    });

    mediaFiles.forEach((file) => {
      if (file instanceof File) formData.append("mediaFiles", file);
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-project`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      Setmessage(`Project ${requestid > 0 ? "updated" : "created"} successfully`);
      // router.push("/admin/projects");
      // reset();
      setSelectedCompanies([]);
      setFiles({ drawings: null, insurance: null, projectother: null });
      setMediaFiles([]);

      setstepvar(true);

    
      setcreatedprojectid(result.data.id);

    } else {
      alert(result.message || "Submission failed");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to submit form");
  }
};




const renderPreview = (fileObj) => {
  if (!fileObj) return null;

  let fileUrl = null;

  if (fileObj instanceof File) {
    fileUrl = URL.createObjectURL(fileObj);
  } else if (typeof fileObj.url === "string") {
    fileUrl = fileObj.url;
  }

  if (!fileUrl) return <div className="flex items-center justify-center w-full h-full text-gray-400">No Preview</div>;

  const lowerUrl = fileUrl.toLowerCase();

  if (lowerUrl.endsWith(".pdf")) {
    return <embed src={fileUrl} type="application/pdf" className="absolute inset-0 w-full h-full rounded" />;
  }

  return <img src={fileUrl} alt={fileObj?.name || "Preview"} className="absolute inset-0 w-full h-full object-cover rounded" />;
};

const renderMultiplePreview = (file) => {
  if (!file) return null;

  let fileUrl = null;

  if (file instanceof File) {
    fileUrl = URL.createObjectURL(file);
  } else if (typeof file.url === "string") {
    fileUrl = file.url;
  }

  if (!fileUrl) return <div className="flex items-center justify-center w-full h-full text-gray-400">No Preview</div>;

  const lowerUrl = fileUrl.toLowerCase();

  if (lowerUrl.endsWith(".pdf")) {
    return <embed src={fileUrl} type="application/pdf" className="w-full h-full rounded" />;
  }

  return <img src={fileUrl} alt={file?.name || "Preview"} className="w-full h-full object-cover" />;
};




  const deletimagesprojectdocuments = async (requestid, field, fileUrl) => {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/delete-images-project-document`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        projectId: requestid,
        fileType: field,
        fileUrl: fileUrl.toString()
      })
    });
  };

  return (<>
    
    

     {stepvar == false ? (<>
 

    <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 mt-5">
      
      


      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">

        {requestid > 0 ? "Update" : "Create"} your <span className="text-red-600">Project <sup className="text-sm">™</sup></span>
        
        <p className='text-sm text-green-400'>{success}</p>
         <div className="mt-5 mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
          {/* Step 1 */}
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
              Project <span className="hidden sm:inline-flex sm:ms-2">Details</span>
            </span>
          </li>

          {/* Step 2 */}
          <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              <span className="me-2">2</span>
              Assign <span className="hidden sm:inline-flex sm:ms-2">Companies</span>
            </span>
          </li>

          {/* Step 3 (optional) */}
          {/* <li className="flex items-center">
            <span className="me-2">3</span>
            Confirmation
          </li> */}
        </ol>
  </div>


    

      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {[
      { id: 'fullName', label: 'Full Name', type: 'text', required: 'Full name is required' },
      { id: 'phoneNumber', label: 'Phone Number', type: 'text', required: 'Phone number is required' },
      { id: 'emailAddress', label: 'Email Address', type: 'email', required: 'Email address is required', pattern: /^\S+@\S+$/i, patternMessage: 'Enter a valid email' }
    ].map((field, i) => (
      <div key={i} className="flex flex-col gap-1">
        <label htmlFor={field.id} className="text-gray-700 text-sm">{field.label}</label>
        <input
          id={field.id}
          type={field.type}
          {...register(field.id, {
            required: field.required || false,
            pattern: field.pattern ? { value: field.pattern, message: field.patternMessage } : undefined
          })}
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors[field.id] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400'}`}
        />
        {errors[field.id] && <p className="text-red-500 text-xs">{errors[field.id].message}</p>}
      </div>
    ))}
        </div>





        {/* Inputs */}
        {[ 
          // { id: 'fullName', label: 'Full Name', type: 'text', required: 'Full name is required' },
          // { id: 'phoneNumber', label: 'Phone Number', type: 'text', required: 'Phone number is required' },
          // { id: 'emailAddress', label: 'Email Address', type: 'email', required: 'Email address is required', pattern: /^\S+@\S+$/i, patternMessage: 'Enter a valid email' },
          { id: 'projectTitle', label: 'Project Title', type: 'text', required: 'Project title is required' },
          // { id: 'propertyType', label: 'Property Type', type: 'text', required: 'Property type is required' },
          // { id: 'budget', label: 'Project Budget', type: 'number', required: 'Project budget is required', inputMode: 'numeric', pattern: '[0-9]*' },
          // // { id: 'projectAddress', label: 'Project Address', type: 'text', required: 'Project address is required' },
          // // { id: 'projectDetails', label: 'Project Details', type: 'text', required: 'Project details are required' },
          // { id: 'productType', label: 'Product Type', type: 'text', required: 'Product type is required' },
          // { id: 'productColor', label: 'Product Color', type: 'text', required: 'Product color is required' },
          // { id: 'startdate', label: 'Start Date', type: 'date', required: 'Start date is required' },
          // { id: 'enddate', label: 'End Date', type: 'date', required: 'End date is required' }
        ].map((field, i) => (
          <div key={i} className="flex flex-col gap-1">
            <label htmlFor={field.id} className="text-gray-700 text-sm">{field.label}</label>
            <input
              id={field.id}
              type={field.type}
              {...register(field.id, {
                required: field.required || false,
                pattern: field.pattern ? { value: field.pattern, message: field.patternMessage } : undefined
              })}
              className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors[field.id] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400'}`}
            />
            {errors[field.id] && <p className="text-red-500 text-xs">{errors[field.id].message}</p>}
          </div>
        ))}


{/* Property Type + Project Budget side by side */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {[
    { id: 'propertyType', label: 'Property Type', type: 'text', required: 'Property type is required' },
    { id: 'budget', label: 'Project Budget', type: 'number', required: 'Project budget is required', inputMode: 'numeric', pattern: '[0-9]*' }
  ].map((field, i) => (
    <div key={i} className="flex flex-col gap-1">
      <label htmlFor={field.id} className="text-gray-700 text-sm">{field.label}</label>
      <input
        id={field.id}
        type={field.type}
        inputMode={field.inputMode}
        pattern={field.pattern}
        {...register(field.id, { required: field.required })}
        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors[field.id] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400'}`}
      />
      {errors[field.id] && <p className="text-red-500 text-xs">{errors[field.id].message}</p>}
    </div>
  ))}
</div>

{/* Product Type + Product Color side by side */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {[
    { id: 'productType', label: 'Product Type', type: 'text', required: 'Product type is required' },
    { id: 'productColor', label: 'Product Color', type: 'text', required: 'Product color is required' }
  ].map((field, i) => (
    <div key={i} className="flex flex-col gap-1">
      <label htmlFor={field.id} className="text-gray-700 text-sm">{field.label}</label>
      <input
        id={field.id}
        type={field.type}
        {...register(field.id, { required: field.required })}
        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors[field.id] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400'}`}
      />
      {errors[field.id] && <p className="text-red-500 text-xs">{errors[field.id].message}</p>}
    </div>
  ))}
</div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{[ 
          { id: 'projectAddress', label: 'Project Address', rows: 3, required: 'Project address is required' },
          { id: 'projectDetails', label: 'Project Details', rows: 3, required: 'Project details are required' }
        ].map((field, i) => (
          <div key={i} className="flex flex-col gap-1">
            <label htmlFor={field.id} className="text-gray-700 text-sm">{field.label}</label>
            <textarea
              id={field.id}
              rows={field.rows}
              {...register(field.id, { required: field.required })}
              className="border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {errors[field.id] && <p className="text-red-500 text-xs">{errors[field.id].message}</p>}
          </div>
        ))}
        </div>


        {/* Textareas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{[ 
          { id: 'productPreference', label: 'Product preference (Brand, Name, Color)', rows: 3, required: 'Project preference is required' },
          { id: 'workDescription', label: 'Description of work to be completed', rows: 3, required: 'Work description is required' }
        ].map((field, i) => (
          <div key={i} className="flex flex-col gap-1">
            <label htmlFor={field.id} className="text-gray-700 text-sm">{field.label}</label>
            <textarea
              id={field.id}
              rows={field.rows}
              {...register(field.id, { required: field.required })}
              className="border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {errors[field.id] && <p className="text-red-500 text-xs">{errors[field.id].message}</p>}
          </div>
        ))}
        </div>
        

        {/* Start & End Date side by side */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {[
    { id: 'startdate', label: 'Start Date', type: 'date', required: 'Start date is required' },
    { id: 'enddate', label: 'End Date', type: 'date', required: 'End date is required' }
  ].map((field, i) => (
    <div key={i} className="flex flex-col gap-1">
      <label htmlFor={field.id} className="text-gray-700 text-sm">{field.label}</label>
      <input
        id={field.id}
        type={field.type}
        {...register(field.id, {
          required: field.required || false
        })}
        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors[field.id] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400'}`}
      />
      {errors[field.id] && <p className="text-red-500 text-xs">{errors[field.id].message}</p>}
    </div>
  ))}

</div>


        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Companies for Bidding
          </label>
          <CompanyMultiSelect 
            value={selectedCompanies} 
            onChange={setSelectedCompanies} 
            setOptions={setCompanyOptions} 
          />
        </div> */}


        {/* File Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-500">
          {["drawings", "insurance", "projectother"].map((field, idx) => (
            <label key={idx} className="border border-gray-300 rounded flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer relative overflow-hidden h-32">
              {files[field] ? (
                <>
                  {renderPreview(files[field])}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleRemove(field); }}
                    className="absolute top-2 right-2 bg-black/60 text-white text-xs rounded-full px-2 py-1 hover:bg-black/80"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <div className="text-blue-400 text-4xl mb-1">+</div>
                  <div>
                    {field === "drawings" ? "Project Drawings" : field === "insurance" ? "Insurance Paperwork" : "Other Documents"}
                  </div>
                </>
              )}
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileChange(e, field)} />
            </label>
          ))}
        </div>

        {/* Multiple Uploads */}
        <div>
          <label className="w-full border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
            <div className="text-blue-400 text-5xl mb-1">+</div>
            <div className="text-lg">Upload Photos or PDFs</div>
            <small className="text-gray-400 mt-1">Max 5 files</small>
            <input type="file" accept="image/*,video/*,application/pdf" multiple disabled={mediaFiles.length >= 5} className="hidden" onChange={handleMultipleFiles} />
          </label>
          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative w-full h-28 border rounded overflow-hidden">
                  {renderMultiplePreview(file)}
                  <button
                    type="button"
                    onClick={() => handleRemovemultiple(index, file, 'mediaFiles')}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full px-2 py-1 hover:bg-black/80"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
     <div className="flex justify-end mt-6">
  <button
    type="submit"
  
    className="bg-[#0C0C2D] rounded-full px-8 py-3 text-white font-semibold text-lg  transition"
  >
    {requestid > 0 ? "Next Step →" : "Next Step →"}
  </button>
</div>

     </form>
    </div>

     </> ) : (<>
        <div>
          
         

         <AssignCompany requestid={requestid > 0 ? requestid : createdprojectid} />

        </div>
      </>)}

         




 </>);
}
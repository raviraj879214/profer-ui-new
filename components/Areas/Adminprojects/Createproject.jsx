'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CompanyMultiSelect } from "../../Areas/Adminprojects/ComapniesList";

export function ProjectAuctionForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [files, setFiles] = useState({ drawings: null, insurance: null, projectother: null });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [success, Setmessage] = useState("");
  const router = useRouter();
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [lastselectcompanies, setlastselectcompanies] = useState("");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        Setmessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Single file change
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) setFiles((prev) => ({ ...prev, [field]: file }));
    e.target.value = null; // reset input so same file can be re-selected
  };

  const handleRemove = (field) => setFiles((prev) => ({ ...prev, [field]: null }));

  // Multiple files
  const handleMultipleFiles = (e) => {
    const filesArr = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...filesArr].slice(0, 5));
    e.target.value = null; // reset so same file can be re-selected
  };

  const handleRemovemultiple = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("status", "0");

      const ids = selectedCompanies.map((data) => data.value).join(",");
      
      console.log("ids",ids);
      setlastselectcompanies(ids);
      formData.append("prosId", ids);



      Object.keys(data).forEach((key) => formData.append(key, data[key] || ''));
      Object.keys(files).forEach((key) => files[key] && formData.append(key, files[key]));
      mediaFiles.forEach((file) => formData.append("mediaFiles", file));

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-project`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        Setmessage("project created successfully");
          router.push('/admin/projects');
        reset();
        setSelectedCompanies([]);
        setFiles({ drawings: null, insurance: null, projectother: null });
        setMediaFiles([]);
      } else {
        alert(result.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit form');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 mt-10">
    
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Create your <span className="text-red-600">Project <sup className="text-sm">™</sup></span>  
        <p className='text-sm text-green-400'>{success}</p>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Contact Fields */}
        {[
          { id: 'fullName', label: 'Full Name', type: 'text', required: 'Full name is required' },
          { id: 'phoneNumber', label: 'Phone Number', type: 'text', required: 'Phone number is required' },
          { id: 'emailAddress', label: 'Email Address', type: 'email', required: 'Email address is required', pattern: /^\S+@\S+$/i, patternMessage: 'Enter a valid email' },
          { id: 'projectTitle', label: 'Project Title', type: 'text', required: 'Project title is required' },
          { id: 'propertyType', label: 'Property Type', type: 'text', required: 'Property type is required' },
         { id: 'budget', label: 'Project Budget', type: 'number', required: 'Project budget is required', inputMode: 'numeric', pattern: '[0-9]*' },

          { id: 'projectAddress', label: 'Project Address', type: 'text', required: 'Project address is required' },
          { id: 'projectDetails', label: 'Project Details', type: 'text', required: 'Project details are required' },
          { id: 'productType', label: 'Product Type', type: 'text', required: 'Product type is required' },
          { id: 'productColor', label: 'Product Color', type: 'text', required: 'Product color is required' },
          { id: 'startdate', label: 'Start Date', type: 'date', required: 'Start date is required' },
          { id: 'enddate', label: 'End Date', type: 'date', required: 'End date is required' }
        ].map((field, i) => (
          <div key={i} className="flex flex-col gap-1">
            <label htmlFor={field.id} className="text-gray-700 text-sm">{field.label}</label>
            <input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder || ''}
              {...register(field.id, {
                required: field.required || false,
                pattern: field.pattern ? { value: field.pattern, message: field.patternMessage } : undefined
              })}
              className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors[field.id] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400'}`}
            />
            {errors[field.id] && <p className="text-red-500 text-xs">{errors[field.id].message}</p>}
          </div>
        ))}

        {/* Textareas */}
        {[
          { id: 'productPreference', label: 'Product preference (Brand, Name, Color)', rows: 2, required: 'Project preference is required' },
          { id: 'workDescription', label: 'Description of work to be completed', rows: 3, required: 'Work description is required' },
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

        <CompanyMultiSelect value={selectedCompanies} onChange={setSelectedCompanies} />

        {/* File Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-500">
          {["drawings", "insurance", "projectother"].map((field, idx) => (
            <label key={idx} className="border border-gray-300 rounded flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer relative overflow-hidden h-32">
              {files[field] ? (
                <>
                  <img src={URL.createObjectURL(files[field])} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded" />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleRemove(field); }} className="absolute top-2 right-2 bg-black/60 text-white text-xs rounded-full px-2 py-1 hover:bg-black/80">
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
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, field)} />
            </label>
          ))}
        </div>

        {/* Project Photos & Videos */}
        <div>
          <label className="w-full border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
            <div className="text-blue-400 text-5xl mb-1">+</div>
            <div className="text-lg">Upload Photos or Videos</div>
            <small className="text-gray-400 mt-1">Max 5 files</small>
            <input type="file" accept="image/*,video/*" multiple disabled={mediaFiles.length >= 5} className="hidden" onChange={handleMultipleFiles} />
          </label>
          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative w-full h-28 border rounded overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt={`upload-${index}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => handleRemovemultiple(index)} className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full px-2 py-1 hover:bg-black/80">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-6">
          <button type="submit" className="bg-red-500 rounded-full px-12 py-3 text-white font-semibold text-lg hover:bg-red-600 transition">
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export function ProjectAuction() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [files, setFiles] = useState({ drawings: null, insurance: null, projectother: null });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState({}); // for uploader validation
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [preferedtime, setpreferedtime] = useState([]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));
      setFileErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleRemove = (field) => {
    setFiles((prev) => ({ ...prev, [field]: null }));
  };

  const handleMultipleFiles = (e) => {
    const filesArr = Array.from(e.target.files);
    const combined = [...mediaFiles, ...filesArr].slice(0, 5);
    setMediaFiles(combined);
    if (combined.length > 0) {
      setFileErrors((prev) => ({ ...prev, mediaFiles: null }));
    }
  };

  const handleRemovemultiple = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const renderFilePreview = (file) => {
    if (!file) return null;
    if (file.type === "application/pdf") {
      return (
        <embed
          src={URL.createObjectURL(file)}
          type="application/pdf"
          className="absolute inset-0 w-full h-full"
        />
      );
    }
    return (
      <img
        src={URL.createObjectURL(file)}
        alt="Preview"
        className="absolute inset-0 w-full h-full object-cover rounded"
      />
    );
  };

  const onSubmit = async (data) => {
    // ✅ Validate mandatory file uploads
    const missing = {};
    if (!files.drawings) missing.drawings = "Project drawings are required";
    if (!files.insurance) missing.insurance = "Insurance paperwork is required";
    if (!files.projectother) missing.projectother = "Project other document is required";
    if (mediaFiles.length === 0) missing.mediaFiles = "At least one project photo is required";

    if (Object.keys(missing).length > 0) {
      setFileErrors(missing);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key] || '');
      });

      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      mediaFiles.forEach((file) => {
        formData.append("mediaFiles", file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-roof-request`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        reset();
        setFiles({ drawings: null, insurance: null, projectother: null });
        setMediaFiles([]);
        setFileErrors({});
      } else {
        alert(result.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit form');
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setIsOpen(true);
    }, 500);
  };

  const fetchpreferedtime = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-prefered-time`);
      const data = await response.json();
      if (response.ok) {
        setpreferedtime(data.data);
      } else {
        console.error("Failed to fetch preferred time");
      }
    } catch (error) {
      console.error("Error fetching preferred time:", error);
    }
  };

  useEffect(() => {
    fetchpreferedtime();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="w-full max-w-6xl mx-auto px-6 py-8 flex-grow">
        <section className="bg-sky-100 rounded-tr-3xl rounded-br-3xl p-6 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Project <span className="text-red-600">Auction<sup className="text-sm font-normal">™</sup></span>
          </h1>
        </section>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 space-y-5">

          {/* Basic Fields */}
          {[ 
            { id: 'fullName', label: 'Full Name', type: 'text', required: 'Full name is required' },
            { id: 'phoneNumber', label: 'Phone Number', type: 'text', required: 'Phone number is required' },
            { id: 'emailAddress', label: 'Email Address', type: 'email', required: 'Email address is required', pattern: /^\S+@\S+$/i, patternMessage: 'Enter a valid email' },
            { id: 'projectTitle', label: 'Project Title', type: 'text', required: 'Project title is required' },
            { id: 'projectAddress', label: 'Project Address', type: 'text', required: 'Project address is required' },
            { id: 'projectDetails', label: 'Project Details', type: 'text', required: 'Project details are required' },
            { id: 'productType', label: 'Product Type', type: 'text', required: 'Product type is required' },
            { id: 'productColor', label: 'Product Color', type: 'text', required: 'Product color is required' },
          ].map((field, i) => (
            <div key={i} className="grid grid-cols-3 items-start gap-4">
              <label htmlFor={field.id} className="text-gray-700 text-sm mt-2">{field.label}</label>
              <div className="col-span-2 flex flex-col">
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder || ''}
                  {...register(field.id, { 
                    required: field.required || false, 
                    pattern: field.pattern ? { value: field.pattern, message: field.patternMessage } : undefined 
                  })}
                  className={`border rounded px-3 py-1 focus:outline-none focus:ring-2 ${
                    errors[field.id] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400'
                  }`}
                />
                {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id].message}</p>}
              </div>
            </div>
          ))}

          {/* Preferred Calling Time */}
          <div className="grid grid-cols-3 items-start gap-4">
            <label htmlFor="preferredCallingTime" className="text-gray-700 text-sm mt-2">Preferred Calling Time</label>
            <div className="col-span-2 flex flex-col">
              <select
                id="preferredCallingTime"
                {...register('preferredCallingTime', { required: 'Please select a calling time' })}
                className={`border rounded px-3 py-1 focus:outline-none focus:ring-2 ${
                  errors.preferredCallingTime ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400'
                }`}
              >
                <option value="">Select</option>
                {preferedtime.map((data) => (
                  <option key={data.id} value={data.PreferTime}>{data.PreferTime}</option>
                ))}
              </select>
              {errors.preferredCallingTime && <p className="text-red-500 text-xs mt-1">{errors.preferredCallingTime.message}</p>}
            </div>
          </div>

          {/* Preferred Contact Method */}
          <div className="grid grid-cols-3 items-start gap-4">
            <label htmlFor="preferredContactMethod" className="text-gray-700 text-sm mt-2">Preferred Contact Method</label>
            <div className="col-span-2 flex flex-col">
              <select
                id="preferredContactMethod"
                {...register('preferredContactMethod', { required: 'Please select a contact method' })}
                className={`border rounded px-3 py-1 focus:outline-none focus:ring-2 ${
                  errors.preferredContactMethod ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400'
                }`}
              >
                <option value="">Select</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="text">Text Message</option>
              </select>
              {errors.preferredContactMethod && <p className="text-red-500 text-xs mt-1">{errors.preferredContactMethod.message}</p>}
            </div>
          </div>

          {/* Project Documents */}
          <section className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 mt-8 space-y-4">
            <h2 className="font-semibold text-gray-900">Project Documents (All required)</h2>
            <div className="grid grid-cols-3 gap-4 text-xs text-center text-gray-500">
              {["drawings", "insurance", "projectother"].map((field, idx) => (
                <label key={idx} className="border border-gray-300 rounded flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer relative overflow-hidden h-40">
                  {files[field] ? (
                    <>
                      {renderFilePreview(files[field])}
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleRemove(field); }}
                        className="absolute top-2 right-2 bg-black/60 text-white text-xs rounded-full px-2 py-1 hover:bg-black/80"
                      >✕</button>
                    </>
                  ) : (
                    <>
                      <div className="text-blue-400 text-4xl leading-none mb-2">+</div>
                      <div>{field === "drawings" ? "Project Drawings or Measure" : field === "insurance" ? "Insurance Claim Paperwork" : "Project other documents"}</div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, field)}
                  />
                </label>
              ))}
            </div>
           <div>
             {Object.entries(fileErrors).map(([key, val]) => (
              key !== "mediaFiles" && val ? <p key={key} className="text-red-500 text-xs mt-1">{val}</p> : null
            ))}
           </div>

          </section>

          {/* Project Photos */}
          <section className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 mt-8 space-y-4">
            <h2 className="font-semibold text-gray-900">Project Photos (Required, max 5)</h2>
            <label className="w-full border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
              <div className="text-blue-400 text-5xl leading-none mb-2">+</div>
              <div className="text-lg">Upload Photos / PDFs</div>
              <small className="text-gray-400 mt-1">You can select multiple files (max 5)</small>
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                disabled={mediaFiles.length >= 5}
                className="hidden"
                onChange={handleMultipleFiles}
              />
            </label>
            {fileErrors.mediaFiles && <p className="text-red-500 text-xs mt-1">{fileErrors.mediaFiles}</p>}
            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative w-full h-32 border rounded overflow-hidden bg-gray-100">
                    {renderFilePreview(file)}
                    <button
                      type="button"
                      onClick={() => handleRemovemultiple(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full px-2 py-1 hover:bg-black/80"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="flex justify-center mt-6">
            {loading ? (
              <button disabled className="flex items-center justify-center rounded-full px-12 py-3 bg-red-500 text-white font-semibold text-lg min-w-[140px] gap-2 disabled:cursor-not-allowed">
                Uploading...
              </button>
            ) : (
              <button type="submit" className="rounded-full px-12 py-3 bg-red-500 text-white font-semibold text-lg hover:bg-red-600">
                Proceed
              </button>
            )}
          </div>
        </form>
      </main>

      {/* Success Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl transform animate-[rotateIn_0.4s_ease-out] sm:my-8 sm:w-full sm:max-w-md z-10">
            <div className="px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
              <div className="sm:flex sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="mx-auto flex size-14 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-14 shadow-md">
                  <Image src="/images/4.png" width={100} height={100} className="object-contain" alt='Project Created' />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">Project Request Created</h3>
                  <p className="mt-1 text-sm text-gray-600">Your project request has been successfully submitted. We’ll review it and get back to you shortly.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse rounded-b-xl">
              <button type="button" onClick={() => setIsOpen(false)} className="inline-flex w-full sm:w-auto justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md">Ok</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

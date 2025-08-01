'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function ProjectAuction() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [files, setFiles] = useState({ drawings: null, insurance: null, projectother: null });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file })); // store actual file object
    }
  };

  const handleRemove = (field) => {
    setFiles((prev) => ({ ...prev, [field]: null }));
  };

  const handleMultipleFiles = (e) => {
    const filesArr = Array.from(e.target.files);
    setMediaFiles((prev) => {
      const combined = [...prev, ...filesArr];
      return combined.slice(0, 5); // limit to 5
    });
  };

  const handleRemovemultiple = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append text fields
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key] || '');
      });

      // Append single files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      // Append multiple media files
      mediaFiles.forEach((file) => {
        formData.append("mediaFiles", file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-roof-request`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage("Request submitted successfully!");
        reset();
        setFiles({ drawings: null, insurance: null, projectother: null });
        setMediaFiles([]);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(result.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit form');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="max-w-6xl mx-auto px-6 py-8 flex-grow">
        <section className="bg-sky-100 rounded-tr-3xl rounded-br-3xl p-6 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Project <span className="text-red-600">Auction<sup className="text-sm font-normal">™</sup></span>
          </h1>
        </section>

        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}

        <p className="mb-6 text-center text-gray-700 text-sm max-w-3xl mx-auto">
          Start your <strong>Project <span className="text-red-600">Auction™</span></strong> by entering the information below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 space-y-5">
          {/* Contact Fields */}
          {[
            { id: 'fullName', label: 'Full Name', type: 'text', required: 'Full name is required' },
            { id: 'phoneNumber', label: 'Phone Number', type: 'text', required: 'Phone number is required' },
            { id: 'emailAddress', label: 'Email Address', type: 'email', required: 'Email address is required', pattern: /^\S+@\S+$/i, patternMessage: 'Enter a valid email' },
            { id: 'preferredCallingTime', label: 'Preferred Calling Time', type: 'text', placeholder: 'e.g., 9am - 12pm' },
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

          {/* Select Field */}
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

          {/* Textareas */}
          {[
            { id: 'productPreference', label: 'Product preference (Brand, Name, Color)', rows: 2, required: 'Project preference is required' },
            { id: 'workDescription', label: 'Description of work to be completed', rows: 3, required: 'Work description is required' },
          ].map((field, i) => (
            <div key={i} className="grid grid-cols-3 items-start gap-4">
              <label htmlFor={field.id} className="text-gray-700 text-sm mt-2">{field.label}</label>
              <div className="col-span-2 flex flex-col">
                <textarea
                  id={field.id}
                  rows={field.rows}
                  {...register(field.id, { required: field.required })}
                  className="border border-gray-300 rounded px-3 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id].message}</p>}
              </div>
            </div>
          ))}

          {/* Project Documents */}
          <section className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 mt-8 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Project Documents
            </h2>
            <div className="grid grid-cols-3 gap-4 text-xs text-center text-gray-500">
              {["drawings", "insurance", "projectother"].map((field, idx) => (
                <label key={idx} className="border border-gray-300 rounded flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer relative overflow-hidden h-40">
                  {files[field] ? (
                    <>
                      <img
                        src={URL.createObjectURL(files[field])}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover rounded"
                      />
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
                      <div className="text-blue-400 text-4xl leading-none mb-2">+</div>
                      <div>
                        {field === "drawings"
                          ? "Project Drawings or Measure"
                          : field === "insurance"
                          ? "Insurance Claim Paperwork"
                          : "Project other documents"}
                      </div>
                      <small className="text-gray-400 mt-1">Upload Other Estimates</small>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, field)}
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Project Photos and Videos */}
          <section className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 mt-8 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Project Photos and Videos
            </h2>
            <label className="w-full border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
              <div className="text-blue-400 text-5xl leading-none mb-2">+</div>
              <div className="text-lg">Upload Photos or Videos</div>
              <small className="text-gray-400 mt-1">You can select multiple files</small>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                disabled={mediaFiles.length >= 5}
                className={mediaFiles.length >= 5 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}
                onChange={handleMultipleFiles}
              />
            </label>
            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative w-full h-32 border rounded overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`upload-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovemultiple(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full px-2 py-1 hover:bg-black/80"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex justify-center mt-6">
            <button type="submit" className="bg-red-500 rounded-full px-12 py-3 text-white font-semibold text-lg hover:bg-red-600 transition">
              Proceed
            </button>
          </div>
        </form>

        <div className="text-center mt-6 text-sm text-sky-600">
          Or press the easy button and we will walk you through it. <br />
          Call us for assistance at <a href="tel:8008134021" className="underline">800-813-4021</a>.
        </div>
      </main>
    </div>
  );
}

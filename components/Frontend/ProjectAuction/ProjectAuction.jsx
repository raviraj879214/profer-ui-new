'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function ProjectAuction() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [files, setFiles] = useState({ drawings: null, insurance: null, projectother: null });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
   const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleRemove = (field) => {
    setFiles((prev) => ({ ...prev, [field]: null }));
  };

  const handleMultipleFiles = (e) => {
    const filesArr = Array.from(e.target.files);
    setMediaFiles((prev) => {
      const combined = [...prev, ...filesArr];
      return combined.slice(0, 5);
    });
  };

  const handleRemovemultiple = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Updated to show PDF preview
  const renderFilePreview = (file) => {
    if (!file) return null;

    if (file.type === "application/pdf") {
      return (
        <div className="absolute inset-0 w-full h-full bg-gray-200">
          <embed
            src={URL.createObjectURL(file)}
            type="application/pdf"
            className="w-full h-full"
          />
        </div>
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
    //setIsOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Loading spinner overlay */}
    {/* {loading && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="border-8 border-t-8 border-gray-200 border-t-red-400 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    )} */}
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
            <h2 className="font-semibold text-gray-900">Project Documents</h2>
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
          </section>

          {/* Project Photos */}
          <section className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 mt-8 space-y-4">
            <h2 className="font-semibold text-gray-900">Project Photos</h2>
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
            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative w-full h-32 border rounded overflow-hidden bg-gray-100">
                    {renderFilePreview(file)}
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
 {loading ? (
  <button
    disabled
    className="flex items-center justify-center rounded-full px-12 py-3 bg-red-500 text-white font-semibold text-lg min-w-[140px] gap-2 disabled:cursor-not-allowed"
  >
    <span className="flex items-end space-x-1">
      {[...Array(4)].map((_, i) => (
        <span
          key={i}
          style={{
            width: '4px',
            height: '12px',
            backgroundColor: 'white',
            display: 'inline-block',
            animation: 'wave 1s infinite',
            animationDelay: `${i * 0.1}s`
          }}
        ></span>
      ))}
    </span>
    Uploading
    <style>
      {`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.2); }
        }
      `}
    </style>
  </button>
) : (
  <button
    type="submit"
    className="rounded-full px-12 py-3 bg-red-500 text-white font-semibold text-lg hover:bg-red-600"
  >
    Proceed
  </button>
)}






{/* {loading ? (
  <button
    disabled
    className="relative overflow-hidden rounded-full px-12 py-3 bg-red-500 text-white font-semibold text-lg min-w-[140px] flex items-center justify-center"
  >
    <span className="absolute inset-0 bg-white/20 animate-progress" style={{ zIndex: 0 }}></span>
    <span className="relative z-10">Uploading...</span>

    <style>
      {`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 1.5s linear infinite;
        }
      `}
    </style>
  </button>
) : (
  <button
    type="submit"
    className="rounded-full px-12 py-3 bg-red-500 text-white font-semibold text-lg hover:bg-red-600"
  >
    Proceed
  </button>
)}
 */}








    {/* <button
  type="submit"
  disabled={loading}
  className="flex items-center justify-center rounded-full px-12 py-3 bg-red-500 text-white font-semibold text-lg hover:bg-red-600 disabled:cursor-not-allowed min-w-[140px]"
>
  {loading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 mr-2 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      Loading...
    </>
  ) : (
    "Proceed"
  )}
</button> */}

  {/* <button
  type="submit"
  disabled={loading}
  className="flex items-center justify-center rounded-full px-12 py-3 bg-red-500 text-white font-semibold text-lg hover:bg-red-600 disabled:cursor-not-allowed"
>
  {loading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 mr-2 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      Uploading...
    </>
  ) : (
    "Proceed"
  )}
</button> */}




            {/* <button
              type="submit"
              disabled={loading}
              className={`rounded-full px-12 py-3 text-white font-semibold text-lg transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loading ? "Uploading..." : "Proceed"}
            </button> */}
          </div>
        </form>
      </main>
     <div>


<style jsx>{`
  @keyframes rotateIn {
    0% {
      transform: rotate(-10deg) scale(0.95);
      opacity: 0;
    }
    100% {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
  }
`}</style>











     
     {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal Panel */}
         <div className="relative bg-white rounded-xl shadow-2xl transform animate-[rotateIn_0.4s_ease-out]     sm:my-8 sm:w-full sm:max-w-md z-10">


          {/* <div className="relative bg-white rounded-xl shadow-2xl transform transition-all sm:my-8 sm:w-full sm:max-w-md z-10 scale-100 animate-fadeIn"> */}
            <div className="px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
              <div className="sm:flex sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Icon */}
                <div className="mx-auto flex size-14 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-14 shadow-md">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-8 text-green-600"
                  >
                    <path
                      d="M4.5 12.75l6 6 9-13.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Text */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">
                    Project Request Created
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Your project request has been successfully submitted.
                    We’ll review it and get back to you shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse rounded-b-xl">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex w-full sm:w-auto justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}     
    </div>
</div>
  );
}

'use client';

import { useState } from 'react';

export function ProjectAuction() {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Form submitted');
  };

  const sections: [string, string[]][] = [
    ['Project Documents', ['Project Drawings or Measure', 'Insurance Claim Paperwork', 'Other documents']],
    ['Project Photos and Videos', ['Upload Photo 1', 'Upload Photo 2', 'Upload Photo 3']],
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="max-w-6xl mx-auto px-6 py-8 flex-grow">
        <section className="bg-sky-100 rounded-tr-3xl rounded-br-3xl p-6 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Project <span className="text-red-600">Auction<sup className="text-sm font-normal">™</sup></span>
          </h1>
          <div className="text-right text-sm text-gray-700 space-y-1">
            <p>Status: <a href="#" className="text-red-600 hover:underline">Start an Auction</a></p>
            <p>Start Date & Time: TBD</p>
            <p>End Date & Time: TBD</p>
            <p><a href="#" className="text-sky-600 hover:underline">Report an issue</a></p>
          </div>
        </section>

        <p className="mb-6 text-center text-gray-700 text-sm max-w-3xl mx-auto">
          Start your <strong>Project <span className="text-red-600">Auction™</span></strong> by entering the information below.
        </p>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 space-y-5">
          {[
            ['Project Title', 'projectTitle'],
            ['Project Address', 'projectAddress'],
            ['Project Details', 'projectDetails'],
            ['Product Type', 'productType'],
            ['Product Color', 'productColor'],
            ['How soon would you like to receive your bids?', 'bidTimeframe'],
            ['Do it now price (Buy it now)', 'buyItNowPrice'],
          ].map(([label, name]) => (
            <div key={name} className="grid grid-cols-3 items-center gap-4">
              <label htmlFor={name} className="text-gray-700 text-sm">{label}</label>
              <input
                id={name}
                name={name}
                type="text"
                onChange={handleChange}
                className="col-span-2 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          ))}

          <div className="grid grid-cols-3 gap-4">
            <label htmlFor="productPreference" className="text-gray-700 text-sm">
              Product preference (Brand, Name, Color)
            </label>
            <textarea
              id="productPreference"
              name="productPreference"
              rows={2}
              onChange={handleChange}
              className="col-span-2 border border-gray-300 rounded px-3 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label htmlFor="workDescription" className="text-gray-700 text-sm">
              Description of work to be completed
            </label>
            <textarea
              id="workDescription"
              name="workDescription"
              rows={3}
              onChange={handleChange}
              className="col-span-2 border border-gray-300 rounded px-3 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label htmlFor="inviteSpecificPro" className="text-gray-700 text-sm">
              Invite specific Pro(s)
            </label>
            <input
              id="inviteSpecificPro"
              name="inviteSpecificPro"
              type="text"
              onChange={handleChange}
              className="col-span-2 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button type="submit" className="bg-red-500 rounded-full px-12 py-3 text-white font-semibold text-lg hover:bg-red-600 transition">
              Proceed
            </button>
          </div>
        </form>

        {sections.map(([sectionTitle, items]) => (
          <section key={sectionTitle} className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 mt-8 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {sectionTitle}
            </h2>
            <div className="grid grid-cols-3 gap-4 text-xs text-center text-gray-500">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-300 rounded p-4 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer"
                  onClick={() => alert(`Upload ${item}`)}
                >
                  <div className="text-blue-400 text-4xl leading-none mb-2">+</div>
                  <div>{item}</div>
                  <small className="text-gray-400 mt-1">Upload Other Estimates</small>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="text-center mt-6 text-sm text-sky-600">
          Or press the easy button and we will walk you through it. <br />
          Call us for assistance at <a href="tel:8008134021" className="underline">800-813-4021</a>.
        </div>
      </main>
    </div>
  );
}

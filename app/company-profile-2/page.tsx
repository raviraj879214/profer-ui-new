"use client"
import { useState } from "react";

export default function BusinessDetails() {
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <>
     

      

      {/* Form Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-center font-semibold text-lg mb-8">Business Details</h2>

        <form className="space-y-8 max-w-4xl mx-auto">

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <label className="block text-xs mb-1 text-gray-600">Company Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600">Company Phone</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-xs mb-1 text-gray-600">Company Email</label>
              <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600">Owner Email</label>
              <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>

            {/* Row 3 */}
            <div>
              <label className="block text-xs mb-1 text-gray-600">Owner First Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600">Owner Last Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>

            {/* Row 4 */}
            <div className="col-span-2">
              <label className="block text-xs mb-1 text-gray-600">Company Street Address</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-3 gap-x-10 col-span-2 mb-2">
              <div>
                <label className="block text-xs mb-1 text-gray-600">City</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-600">State</label>
                <input type="text" maxLength={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-600">Zip Code</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
              </div>
            </div>

            {/* Row 6 */}
            <div>
              <label className="block text-xs mb-1 text-gray-600">EIN#</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>

            <div>
              <label className="block text-xs mb-1 text-gray-600">Services Offered</label>
              <select multiple className="w-full h-20 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF3B30]">
                <option>Dropdown multi select</option>
              </select>
            </div>

            <div>
              <label className="block text-xs mb-1 text-gray-600">Qualification Level</label>
              <select multiple className="w-full h-20 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF3B30]">
                <option>Dropdown multi select</option>
              </select>
            </div>

            {/* Row 7 */}
            <div>
              <label className="block text-xs mb-1 text-gray-600">Service Area popup</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>

            <div>
              <label className="block text-xs mb-1 text-gray-600">Year Established</label>
              <input type="text" maxLength={4} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>

            <div>
              <label className="block text-xs mb-1 text-gray-600">DOT #</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>

            {/* Row 8 */}
            <div className="pr-10">
              <label className="block text-xs mb-2 text-gray-600">Company Logo</label>
              <button className="w-20 h-20 border border-gray-300 rounded-md flex justify-center items-center text-gray-400 font-bold text-xl hover:bg-gray-50 transition">
                +
              </button>
            </div>

            <div>
              <label className="block text-xs mb-1 text-gray-600">SAM #</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>

            <div>
              <label className="block text-xs mb-1 text-gray-600">UEI #</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
            </div>

            {/* Row 9 */}
            <div className="pr-10">
              <label className="block text-xs mb-2 text-gray-600">Owner's Driver's License</label>
              <button className="w-20 h-20 border border-gray-300 rounded-md flex justify-center items-center text-gray-400 font-bold text-xl hover:bg-gray-50 transition">
                +
              </button>
            </div>

            <div className="col-span-2 space-y-1 text-xs">
              <span>
                Does your state require a certificate or license?{" "}
                <span className="font-bold">yes/no</span>
              </span>
            </div>

            {/* Row 10 */}
            <div className="col-span-2 pt-2 flex flex-col md:flex-row md:space-x-20 text-xs">
              <div className="flex-1 space-y-2">
                <p className="font-semibold mb-1">Links to your:</p>
                <label className="block text-gray-600 text-xs font-normal">Facebook</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
                <label className="block text-gray-600 text-xs font-normal">Google Business Listing</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
                <label className="block text-gray-600 text-xs font-normal">Bing Business Listing</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
                <label className="block text-gray-600 text-xs font-normal">Instagram</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
              </div>
              <div className="flex-1 space-y-2 pt-5 md:pt-0">
                <label className="block text-gray-600 text-xs font-normal">Youtube</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
                <label className="block text-gray-600 text-xs font-normal">Instagram</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
                <label className="block text-gray-600 text-xs font-normal">Linkedin</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]" />
                <button className="text-xs underline text-gray-600">+- add more</button>
              </div>
            </div>

            {/* Row 11 */}
            <div className="col-span-2 pt-4 flex items-center space-x-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className="w-4 h-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">
                I agree with the terms and conditions of the Pro agreement.
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-12 flex justify-between items-center max-w-4xl mx-auto">
            <button
              type="button"
              className="text-[#00BBD1] underline text-sm font-semibold hover:text-[#008a9a] transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!agreeTerms}
              className={`bg-[#FF3B30] text-white font-bold py-2 px-10 rounded-full shadow-md transition shadow-black/30 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Save
            </button>
            <button
              type="button"
              className="bg-[#0B0E26] text-white font-mono py-3 px-8 rounded-full shadow-md hover:shadow-lg transition"
            >
              Next
            </button>
          </div>
        </form>
      </main>

      
    </>
  );
}



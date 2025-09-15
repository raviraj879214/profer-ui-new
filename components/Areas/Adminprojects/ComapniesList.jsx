'use client';
import { useState, useEffect } from "react";

export function CompanyMultiSelect({ value = [], onChange, setOptions }) {
  const [options, setLocalOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedValues = Array.isArray(value) ? value : [];

  const toggleSelect = (option) => {
    if (selectedValues.find((item) => item.value === option.value)) {
      // remove
      onChange(selectedValues.filter((item) => item.value !== option.value));
    } else {
      // add
      onChange([...selectedValues, option]);
    }
  };

  const fetchCompaniesDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-company-list`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const result = await res.json();
        const formatted = result.data.map((item) => ({
          value: item.userId,
          label: item.companyName,
          zip : item.zip,
          img: item.companyLogo,
          description: item.description || null,
          address : item.streetAddress + ", " + item.city + ", " + item.state + " " + item.zip,
        }));
        setLocalOptions(formatted);
        setOptions(formatted);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCompaniesDetails();
  }, []);

  // Filtered options by search
  const filteredOptions = options.filter(
    (opt) =>
      !selectedValues.find((item) => item.value === opt.value) &&
      opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Trigger */}
      <div
        className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-white cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {selectedValues.length > 0 ? (
          selectedValues.map((tag) => (
            <div
              key={tag.value}
              className="flex items-center gap-1 bg-gray-100 border rounded-full px-2 py-1 text-sm shadow-sm"
            >
              {tag.img && (
                <img
                  src={tag.img}
                  alt={tag.label}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span>{tag.label}</span>
            </div>
          ))
        ) : (
          <span className="text-gray-400">Select companies...</span>
        )}
      </div>

      {/* Popup Modal */}

     {isOpen && (
  <div className="fixed inset-0 flex justify-center items-center z-50">
    {/* Fullscreen modal card */}
    <div className="backdrop-blur-md bg-white/90 rounded-2xl shadow-2xl w-3/4 max-w-5xl p-6 relative">
      {/* Close button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
      >
        ✕
      </button>

      {/* Title */}
      <h1 className="text-xl font-semibold text-center mb-6">
        Select Companies for Bidding
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: All Companies */}
        <div className="border rounded-lg p-4 flex flex-col max-h-[70vh]">
          <h2 className="font-semibold mb-3">Available Companies</h2>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3 p-2 border rounded w-full text-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div className="overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.some(
                  (val) => val.value === option.value
                );
                return (
                  <div
                    key={option.value}
                    onClick={() => toggleSelect(option)}
                    className={`flex items-center justify-between p-2 cursor-pointer rounded hover:bg-gray-100 ${
                      isSelected ? "bg-blue-50 border border-blue-300" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {option.img && (
                        <img
                          src={option.img}
                          alt={option.label}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <div>

                        <span className="font-medium">{option.label}    {option.verifiedStatus === "0" ? (
                      "unverified"
                    ) : (
                      <span className="flex items-center gap-1">
                        <img src="/images/4.png" alt="Verified" className="w-4 h-4" />
                        verified
                      </span>
                    )}</span>
                        {option.address && (
                          <p className="text-xs text-gray-500">{option.address}</p>
                        )}
                        </div>
                        
                    </div>

                    {/* Show check icon if selected */}
                    
                  


                  </div>
                );
              })
            ) : (
              <p className="text-gray-400">No matching companies</p>
            )}
          </div>
        </div>

        {/* Right: Selected Companies */}
        <div className="border rounded-lg p-4 overflow-y-auto max-h-[70vh]">
          <h2 className="font-semibold mb-3">Selected Companies</h2>
          {selectedValues.length > 0 ? (
            selectedValues.map((tag) => (
              <div
                key={tag.value}
                className="flex items-center justify-between gap-2 p-2 border rounded mb-2 bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  {tag.img && (
                    <img
                      src={tag.img}
                      alt={tag.label}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span>
                    {tag.label}
                     {tag.verifiedStatus === "0" ? (
                      "unverified"
                    ) : (
                      <span className="flex items-center gap-1">
                        <img src="/images/4.png" alt="Verified" className="w-4 h-4" />
                        verified
                      </span>
                    )}
                    {tag.address && (
                      <p className="text-xs text-gray-500">{tag.address}</p>
                    )}
                  </span>
                </div>
               <button
                  onClick={() => toggleSelect(tag)}
                  className="text-gray-500 hover:text-red-500 text-lg"
                >
                  ✕
                </button>

              </div>
            ))
          ) : (
            <p className="text-gray-400">No companies selected</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg "
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

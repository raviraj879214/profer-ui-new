'use client';
import { useState, useRef, useEffect } from "react";

export function CompanyMultiSelect({ value = [], onChange, setOptions }) {
  const [options, setLocalOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedValues = Array.isArray(value) ? value : [];

  const toggleOption = (option) => {
    let updated;
    if (selectedValues.find((item) => item.value === option.value)) {
      updated = selectedValues.filter((item) => item.value !== option.value);
    } else {
      updated = [...selectedValues, option];
    }
    onChange(updated);
  };

  const removeTag = (val) => {
    const updated = selectedValues.filter((item) => item.value !== val);
    onChange(updated);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          img: item.companyLogo,
          description: item.description || null,
        }));
        setLocalOptions(formatted);
        setOptions(formatted); // pass up to ProjectAuctionForm
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCompaniesDetails();
  }, []);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Selected Tags */}
      <div
        className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
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
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag.value);
                }}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-400">Select companies...</span>
        )}
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded-lg shadow-lg z-50">
          {options.length > 0 ? (
            options.map((option) => {
              const isSelected = selectedValues.find(
                (item) => item.value === option.value
              );
              return (
                <div
                  key={option.value}
                  onClick={() => toggleOption(option)}
                  className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 ${
                    isSelected ? "bg-gray-50" : ""
                  }`}
                >
                  {option.img && (
                    <img
                      src={option.img}
                      alt={option.label}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-gray-500 line-clamp-1">
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-2 text-gray-500">No companies found</div>
          )}
        </div>
      )}
    </div>
  );
}

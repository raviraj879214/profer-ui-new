"use client";
import { useState, useRef, useEffect } from "react";

export function CompanyMultiSelect({ value = [], onChange }) {
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ensure we always work with an array for rendering
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch companies
  const fetchCompaniesDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-company-list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const result = await res.json();
        setOptions(
          result.data.map((item) => ({
            value: item.userId,
            label: item.companyName,
            img: item.companyLogo,
            description: item.description || null,
          }))
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCompaniesDetails();
  }, []);

  // Convert string value like "45,47" to selected objects after options load
  useEffect(() => {
    if (typeof value === "string" && options.length > 0) {
      const ids = value.split(",").map((id) => id.trim());
      const selectedObjects = options.filter((opt) =>
        ids.includes(opt.value.toString())
      );
      onChange(selectedObjects);
    }
  }, [value, options]);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Input area with tags */}
      <div
        className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-white dark:bg-neutral-900 dark:border-neutral-700 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.map((tag) => (
          <div
            key={tag.value}
            className="flex items-center gap-1 bg-white border rounded-full px-2 py-1 text-sm shadow-sm dark:bg-neutral-800 dark:border-neutral-700"
          >
            <img src={tag.img} alt={tag.label} className="w-6 h-6 rounded-full" />
            <span className="text-gray-800 dark:text-neutral-200">{tag.label}</span>
            <button
              type="button"
              className="ml-1 text-gray-500 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag.value);
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <input
          className="flex-1 min-w-[80px] p-1 outline-none text-sm bg-transparent dark:text-neutral-300"
          placeholder={selectedValues.length ? "" : "Select company..."}
          readOnly
        />
        <svg
          className={`w-4 h-4 ml-auto text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 border rounded-lg shadow bg-white max-h-60 overflow-y-auto dark:bg-neutral-900 dark:border-neutral-700">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 ${
                option.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => !option.disabled && toggleOption(option)}
            >
              <img
                src={option.img}
                alt={option.label}
                className="w-8 h-8 rounded mr-2 bg-white object-contain"
              />
              <div>
                <div className="font-semibold text-gray-800 dark:text-neutral-200">
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-neutral-500">
                  {option.description}
                </div>
              </div>
              <div className="ml-auto">
                {selectedValues.find((s) => s.value === option.value) && (
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

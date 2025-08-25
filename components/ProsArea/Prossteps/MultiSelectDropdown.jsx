"use client";
import { useState, useRef, useEffect } from "react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export function MultiSelect({ label, options, selected, setSelected }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]); // ✅ no restriction now
    }
  };

  const removeOption = (option) => {
    setSelected(selected.filter((item) => item !== option));
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs mb-1 text-gray-600">{label}</label>

      {/* Selected Box */}
      <div
        className="border p-2 rounded cursor-pointer bg-white flex flex-wrap gap-1 items-center min-h-[40px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length > 0 ? (
          selected.map((option) => (
            <span
              key={option}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
            >
              {option}
              <XMarkIcon
                className="h-4 w-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option);
                }}
              />
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">Select options</span>
        )}
        <ChevronDownIcon className="h-4 w-4 ml-auto text-gray-400" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute w-full border bg-white mt-1 rounded shadow z-20 max-h-60 overflow-y-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border-b text-sm outline-none"
          />

          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {options
              .filter((opt) =>
                opt.toLowerCase().includes(search.toLowerCase())
              )
              .map((option) => (
                <label
                  key={option}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => toggleOption(option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
          </div>

          {/* Limit notice */}
          {selected.length >= 5 && (
            <p className="text-red-500 text-xs p-2 border-t bg-gray-50">
              You can only select up to 5 options
            </p>
          )}
        </div>
      )}
    </div>
  );
}


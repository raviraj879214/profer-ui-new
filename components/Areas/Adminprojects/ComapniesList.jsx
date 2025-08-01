

"use client";
import { useState, useRef, useEffect } from "react";


export  function CompanyMultiSelect({ value = [], onChange }) {

const [options, setOptions] = useState([
  {
    value: null,
    label: null,
    description: null,
    img: null,
  }
]);



  // const options = [
  //   { value: "1", label: "Google", description: "Technology & Internet Services", img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  //   { value: "2", label: "Apple", description: "Consumer Electronics & Software", img: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  //   { value: "3", label: "Tesla", description: "Automotive & Energy Solutions", img: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg"},
  //   { value: "4", label: "Amazon", description: "E-commerce & Cloud Computing", img: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  // ];

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOption = (option) => {
    let updated;
    if (value.find((item) => item.value === option.value)) {
      updated = value.filter((item) => item.value !== option.value);
    } else {
      updated = [...value, option];
    }
    onChange(updated); // Pass to parent
  };

  const removeTag = (val) => {
    const updated = value.filter((item) => item.value !== val);
    onChange(updated);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const fetchcompaniesdetails = async (req,res)=>{
    try { 
       const token = localStorage.getItem("token"); // Or from cookies/context
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-company-list`,{
          method: "GET",
         headers: {
            "Authorization": `Bearer ${token}`, // Add token here
          },
      });
      if(res.ok){
        const result =await res.json();
        console.log("result",result);
         setOptions(
            result.data.map((item) => ({
              value: item.userId,
              label: item.companyName,
              img: item.companyLogo,
              description: item.description || null, // if available
            }))
          );


      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(()=>{
    fetchcompaniesdetails();


  },[]);









  return (
    <div className="w-full  relative" ref={dropdownRef}>
      {/* Input area with tags */}
      <div
        className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-white dark:bg-neutral-900 dark:border-neutral-700 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.map((tag) => (
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
          placeholder={value.length ? "" : "Select company..."}
          readOnly
        />
        <svg
          className={`w-4 h-4 ml-auto text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
              <img src={option.img} alt={option.label} className="w-8 h-8 rounded mr-2 bg-white object-contain" />
              <div>
                <div className="font-semibold text-gray-800 dark:text-neutral-200">{option.label}</div>
                <div className="text-xs text-gray-500 dark:text-neutral-500">{option.description}</div>
              </div>
              <div className="ml-auto">
                {value.find((s) => s.value === option.value) && (
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

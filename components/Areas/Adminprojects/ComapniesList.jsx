'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ProjectInvite } from "../../../components/Areas/Adminprojects/InviteProjectPros";

import { EyeIcon } from "@heroicons/react/24/outline";


export function CompanyMultiSelect({ value = [], onChange, setOptions, onInviteClick , projectrequestid = 0 , comapnystatus }) {


  const [options, setLocalOptions] = useState([]); // all companies
  const [search, setSearch] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [zipcodelist, setZipcodelist] = useState([]);
  const [invitedcompanies,setinvitedcompanies] = useState([]);

  const selectedValues = Array.isArray(value) ? value : [];








  const toggleSelect = (option) => {
    debugger
    if (selectedValues.find((item) => item.value === option.value)) {
      // Remove
      onChange(selectedValues.filter((item) => item.value !== option.value));
    } else {
      // Add
      onChange([...selectedValues, option]);
    }
  };

  const fetchCompaniesDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-company-list-by-search-zipcode`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const result = await res.json();

        const inviteddata = result.invitedpros.filter((x) => x.projectid == projectrequestid);
          
        console.log("inviteddata", inviteddata);


        const invitedformated = [
            ...inviteddata.map((item) => ({
              value: item.id,
              label: item.name,
              zip: "00000",
              img: "",
              description: item.emailID,
              address: "Invited via email",
              verifiedStatus: "0",
            })),
          ];

          setinvitedcompanies(invitedformated);
          

          let formatted = [

           
           
            ...result.data.map((item) => ({
              value: item.userId,
              label: item.companyName,
              zip: item.zip,
              img: item.companyLogo,
              description: item.description || null,
              address: `${item.streetAddress}, ${item.city}, ${item.state} ${item.zip}`,
              verifiedStatus: item.verifiedStatus
             
            })),
          ];





       

        const zipcodelistarray = [...new Set(result.data.map((item) => item.zip))];
        setZipcodelist(zipcodelistarray);

        setLocalOptions(formatted);


        setOptions(formatted);


        invitedformated.forEach((option) => {
          console.log("option.name",option);
          toggleSelect(option);
        });


       
      }
    } catch (error) {
      console.log(error.message);
    }
     
  };

  useEffect(() => {
    fetchCompaniesDetails();
  }, [comapnystatus]);




  // Filtered options by search + zip
  const filteredOptions = options.filter(
    (opt) =>
      !selectedValues.find((item) => item.value === opt.value) && (!search || opt.label.toLowerCase().includes(search.toLowerCase())) && (!zipcode || opt.zip === zipcode)
  );










  return (
    <div className="w-full">
       <button
                type="button"
                className="ml-2 text-sm bg-[#0C0C2D] text-white px-3 py-1 rounded-full hover:bg-[#1E1E3E] transition mb-3"
                onClick={onInviteClick}
              >
                Not finding pros? Invite +
              </button>
      <div className={`grid gap-6 ${
    invitedcompanies && invitedcompanies.length > 0 ? "grid-cols-3" : "grid-cols-2"
  }`}>
        {/* Left: Available Companies */}
        
        <div className="border rounded-lg p-4 flex flex-col max-h-[70vh]">
          
          <div className="flex justify-between items-center mb-3">
            
            <h2 className="font-semibold text-lg flex items-center gap-2">
              Available Companies
             
            </h2>
          </div>

          {/* Search + Zip */}
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded w-1/2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            />

            <select
              className="p-2 border rounded w-1/2 text-sm"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            >
              <option value="">Postal Code</option>
              {zipcodelist.map((zip) => (
                <option key={zip} value={zip}>
                  {zip}
                </option>
              ))}
            </select>
          </div>

          {/* Available list */}
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
          className={`relative flex items-center justify-between p-2 cursor-pointer rounded hover:bg-gray-100 ${
            isSelected ? "bg-blue-50 border border-blue-300" : ""
          }`}
        >
          {/* Eye icon - top right */}
         <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering parent click handlers if needed
              window.open(`/admin/companies/${option.value}`, "_blank");
            }}
          >
            <EyeIcon className="w-5 h-5" />
          </button>


          <div className="flex items-center gap-2">
            {option.img && (
              <img
                src={option.img}
                alt={option.label}
                className="w-6 h-6 rounded-full"
              />
            )}
            <div>
              <span className="font-medium">{option.label}</span>
              {option.verifiedStatus === "0" ? (
                <span className="block text-red-500">unverified</span>
              ) : (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <img
                    src="/images/4.png"
                    alt="Verified"
                    className="w-4 h-4"
                  />
                  verified
                </span>
              )}
              {option.address && (
                <p className="text-xs text-gray-500">{option.address}</p>
              )}
            </div>
          </div>
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
          <h2 className="font-semibold mb-3 text-lg">Selected Companies</h2>
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
                      <span className="block text-red-500">unverified</span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <img
                          src="/images/4.png"
                          alt="Verified"
                          className="w-4 h-4"
                        />
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

          {invitedcompanies.length > 0 && (
            <div className="border rounded-lg p-4 overflow-y-auto max-h-[70vh]">
            <h2 className="font-semibold mb-3 text-lg">Invited Pros</h2>

            {invitedcompanies && invitedcompanies.length > 0 ? (
              invitedcompanies.map((company, idx) => (
                <div
                  key={company._key || idx}
                  className="flex items-center justify-between gap-2 p-2 border rounded mb-2 bg-yellow-50 hover:bg-yellow-100 transition"
                >
                  <div className="flex items-center gap-2">
                    {company.img ? (
                      <img
                        src={company.img}
                        alt={company.label}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        {company.label.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">{company.label} </span>

                      {company.verifiedStatus === "0" ? (
                        <span className="block text-red-500 text-xs">{company.description}</span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600 text-xs">
                          <img src="/images/4.png" alt="Verified" className="w-3 h-3" />
                          verified
                        </span>
                      )}
                      {company.address && (
                        <p className="text-xs text-gray-500">{company.address}</p>
                      )}
                    </div>
                  </div>
                  {/* No remove button for invited companies */}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No invited companies</p>
            )}
          </div>

          )}
        

      </div>
    </div>
  );
}
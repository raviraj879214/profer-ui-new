"use client";
import { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

export function CompanyMultiSelect({
  value = [],
  onChange,
  setOptions,
  onInviteClick,
  projectrequestid = 0,
  comapnystatus,

}) {
  const [options, setLocalOptions] = useState([]); // all companies
  const [search, setSearch] = useState("");
  const [zipcode, setZipcode] = useState(""); // default = All
  const [zipcodelist, setZipcodelist] = useState([]);
  const [invitedcompanies, setinvitedcompanies] = useState([]);
  const [showZipDropdown, setShowZipDropdown] = useState(false);

  const selectedValues = Array.isArray(value) ? value : [];

  const toggleSelect = (option) => {
    if (selectedValues.find((item) => item.value === option.value)) {
      onChange(selectedValues.filter((item) => item.value !== option.value));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const fetchCompaniesDetails = async () => {
    try {
      const token = localStorage.getItem("Admintoken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-company-list-by-search-zipcode`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const result = await res.json();

        const inviteddata = result.invitedpros.filter(
          (x) => x.projectid == projectrequestid
        );

        const invitedformated = [
          ...inviteddata.map((item) => ({
            value: item.id,
            label: item.name,
            zip: "00000",
            img: "",
            description: item.emailID,
            address: "Invited via email",
            verifiedStatus: "0",
            Status : item.Status
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

        const zipcodelistarray = [
          ...new Set(result.data.map((item) => item.zip)),
        ];
        setZipcodelist(zipcodelistarray);

        setLocalOptions(formatted);
        setOptions(formatted);

        invitedformated.forEach((option) => {
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
      !selectedValues.find((item) => item.value === opt.value) &&
      (!search || opt.label.toLowerCase().includes(search.toLowerCase())) &&
      (!zipcode || opt.zip === zipcode)
  );

  const clearfilter = () => {
    setSearch("");
    setZipcode(""); // back to All
  };

  return (
    <div className="w-full">
      <button
        type="button"
        className="ml-2 text-sm bg-[#0C0C2D] text-white px-3 py-1 rounded-full hover:bg-[#1E1E3E] transition mb-3"
        onClick={onInviteClick}
      >
        Not finding pros? Invite +
      </button>

      <div
        className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:${
          invitedcompanies && invitedcompanies.length > 0
            ? "grid-cols-3"
            : "grid-cols-2"
        }`}
      >
        {/* Available Companies */}
        <div className="border rounded-lg p-4 flex flex-col max-h-[70vh]">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              Available Companies
            </h2>
            <button
              type="button"
              onClick={() => clearfilter()}
              className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Clear Filters
            </button>
          </div>

          {/* Search + Zip */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            {/* Company search */}
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded w-full sm:w-1/2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            />

            {/* Postal Code searchable dropdown */}
            <div className="relative w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Search postal code..."
                value={zipcode === "" ? "All" : zipcode}
                onChange={(e) => {
                  setZipcode(e.target.value === "All" ? "" : e.target.value);
                  setShowZipDropdown(true);
                }}
                onFocus={() => setShowZipDropdown(true)}
                className="p-2 border rounded w-full text-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
              {showZipDropdown && (
                <ul className="absolute z-10 bg-white border rounded mt-1 max-h-40 overflow-y-auto w-full shadow">
                  <li
                    className={`p-2 cursor-pointer text-sm ${
                      zipcode === ""
                        ? "bg-blue-50 font-medium text-blue-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setZipcode("");
                      setShowZipDropdown(false);
                    }}
                  >
                    Postal Code (All)
                  </li>
                  {zipcodelist
                    .filter((zip) =>
                      zip.toString().includes(zipcode.toString())
                    )
                    .map((zip) => (
                      <li
                        key={zip}
                        className={`p-2 cursor-pointer text-sm ${
                          zipcode === zip
                            ? "bg-blue-50 font-medium text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setZipcode(zip);
                          setShowZipDropdown(false);
                        }}
                      >
                        {zip}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {/* Available list */}
          <div className="overflow-y-auto flex-1">
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
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
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
                          <p className="text-xs text-gray-500">
                            {option.address}
                          </p>
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

        {/* Selected Companies */}
        <div className="border rounded-lg p-4 overflow-y-auto max-h-[70vh]">
          <h2 className="font-semibold mb-3 text-lg">Selected Companies</h2>
          {selectedValues.length > 0 ? (
            selectedValues.map((tag) => (
              <div
                key={tag.value}
                className="relative border rounded mb-2 bg-gray-50 p-3"
              >
                <button
                  onClick={() => toggleSelect(tag)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
                >
                  ✕
                </button>
                <div className="flex items-start gap-2">
                  {tag.img && (
                    <img
                      src={tag.img}
                      alt={tag.label}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <span className="font-medium">{tag.label}</span>
                    {tag.verifiedStatus === "0" ? (
                      <span className="block text-red-500 text-sm">
                        unverified
                      </span>
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
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/admin/companies/${tag.value}`, "_blank");
                  }}
                  className="absolute bottom-2 right-2 text-gray-500 hover:text-blue-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No companies selected</p>
          )}
        </div>

        {/* Invited Pros */}
        {invitedcompanies.length > 0 && (
          <div className="border rounded-lg p-4 overflow-y-auto max-h-[70vh]">
            <h2 className="font-semibold mb-3 text-lg">Invited Pros</h2>
            {invitedcompanies.map((company, idx) => (
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
                      <span className="block text-red-500 text-xs">
                        {company.description}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 text-xs">
                        <img
                          src="/images/4.png"
                          alt="Verified"
                          className="w-3 h-3"
                        />
                        verified
                      </span>
                    )}
                    {company.address && (
                      <p className="text-xs text-gray-500">{company.address}</p>
                    )}



                      <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            company.Status === 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {company.Status === 0 ? "Pending" : "Registered"}
                      </span>


                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

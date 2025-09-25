"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function SearchForPros({ companyname, zipcode }) {
  const [roofingContractors, setRoofingContractors] = useState([]);
  const [servielist, setServicelist] = useState([]);
  const [loading, setLoading] = useState(false); // For table loader
  const [btnLoading, setBtnLoading] = useState(false); // For search button loader
  const [refreshing, setRefreshing] = useState(false); // For refresh loader
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchprosdata("test", zipcode, companyname);
    fetchservices();
  }, []);

  // Fetch contractors list
  const fetchprosdata = async (service, zipcodes, companyname) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-search-pros-list`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyname: companyname,
            services: service,
            zip: zipcodes,
          }),
        }
      );

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          setRoofingContractors(
            result.data.map((item) => ({
              id : item.id,
              name: item.companyName,
              status: item.verifiedStatus,
              profileImg:
                "https://static.wixstatic.com/media/8de7f9_acbb695fd7e94f47b58c7ef118d8f3a6~mv2.png/v1/fill/w_174,h_94,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8de7f9_acbb695fd7e94f47b58c7ef118d8f3a6~mv2.png",
              verified: item.verifiedStatus == 0 ? false : true,
            }))
          );
        } else {
          setRoofingContractors([]);
        }
      }
    } catch (err) {
      console.error("Error fetching contractors:", err);
    } finally {
      setLoading(false);
      setBtnLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch available services
  const fetchservices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-servies`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        const names = result.data.map((item) => item.name);
        setServicelist(names);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  // Handle form submit
  const onsubmit = async (data) => {
    setBtnLoading(true);
    fetchprosdata(data.service, data.zipcode, "test");
  };

  // Refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    reset(); // clear form fields
    setRoofingContractors([]);
    setServicelist([]);
    fetchprosdata("test", zipcode, companyname);
    fetchservices();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 mt-20">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-center mb-4">
          Pro Directory - Search Results
        </h1>

        {/* Search Form */}
        {!companyname && (
          <form onSubmit={handleSubmit(onsubmit)}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 bg-white shadow-md p-6 rounded-lg max-w-3xl mx-auto">
              {/* Service Dropdown */}
              <div className="flex flex-col w-full sm:w-60">
                <select
                  className="border border-gray-300 rounded px-4 py-2 focus:ring-red-400 focus:outline-none"
                  defaultValue=""
                  {...register("service", {
                    required: "Please select services",
                  })}
                >
                  <option value="" disabled>
                    Service type dropdown
                  </option>
                  {servielist.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.service.message}
                  </p>
                )}
              </div>

              {/* Zip Code Input */}
              <div className="flex flex-col w-full sm:w-40">
                <input
                  type="text"
                  placeholder="Enter Zip Code"
                  className="border border-gray-300 rounded px-4 py-2 focus:ring-red-400 focus:outline-none"
                  {...register("zipcode", {
                    required: "Please enter zip code",
                  })}
                />
                {errors.zipcode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.zipcode.message}
                  </p>
                )}
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={btnLoading}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded shadow transition w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {btnLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Results Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Roofing Contractors
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-800 transition"
            >
              {refreshing ? (
                <svg
                  className="animate-spin h-5 w-5"
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
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zm0 0h3m-3 0h3m0 0V9m0 3v3"
                  />
                </svg>
              )}
              Refresh
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mb-6">
            Click to View{" "}
            <strong>
              Pro<span className="text-red-500">Files</span>
            </strong>
            <sup>™</sup>
          </p>

          {loading ? (
            <div className="flex justify-center py-10">
              <svg
                className="animate-spin h-8 w-8 text-cyan-600"
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
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </div>
          ) : roofingContractors.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No contractors found.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Company Name</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">
                    Pro<span className="text-red-500">file</span>
                    <sup>™</sup>
                  </th>
                </tr>
              </thead>
              <tbody>
                {roofingContractors.map(
                  ({ name, status, profileImg, verified ,id }, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-200 ${
                        verified ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      <td className="flex items-center gap-2 py-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            verified ? "bg-cyan-500" : "bg-red-500"
                          }`}
                        >
                          {verified ? (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                            </svg>
                          )}
                        </div>
                        <span>{name}</span>
                      </td>
                      <td
                        className={`py-3 font-semibold ${
                          verified ? "text-cyan-600" : "text-red-600"
                        }`}
                      >
                        {status == "0" ? "Unverified" : "Verified"}
                      </td>
                      <td className="py-3" onClick={()=>{
                        router.push(`/pro-overview/${id}`)
                      }}>

                        <img
                          src={profileImg}
                          alt={`ProFile for ${name}`}
                          className="w-10 h-10 opacity-80"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://placehold.co/40x40?text=PF";
                          }}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {formatDateToUS } from "../../../lib/utils/dateFormatter";
import {formatAmountUSD } from "../../../lib/utils/formatAmountUSD";

export function CompanyBid({ projectId, proId }) {
  const [companyBids, setCompanyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBids = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("Admintoken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get-bids-company-price-only/${projectId}/${proId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }

      const result = await res.json();
      setCompanyBids(result.data || []);
    } catch (err) {
      console.error("Failed to fetch bids:", err);
      setError("Could not load bids. Please try again.");
      setCompanyBids([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && proId) {
      fetchBids();
    }
  }, [projectId, proId]);

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // e.g. "9/19/2025, 10:30 AM"
  };

  // Sort bids by createdAt descending
  const sortedBids = [...companyBids].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="p-4 border rounded-lg">
      <p className="font-semibold">Bid Prices</p>

      {loading ? (
        <p className="text-gray-500">Loading bids...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : sortedBids.length > 0 ? (
        <ul className="mt-2 max-h-40 overflow-y-auto space-y-2">
          {sortedBids.slice(0, 5).map((data) => (
            <li
              key={data.id}
              className="p-3 bg-gray-100 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium"> {formatAmountUSD(data.amount)}</p> 
              </div>
              <span className="text-xs text-gray-500">
                {formatDateToUS(data.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-2">No bids available</p>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";

const statusColors: Record<string, string> = {
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const bids = [
  {
    bidId: "BID-2025-127",
    from: "SkyHigh Contractors",
    submitted: "Mar 18, 2025",
    projectId: "PRJ-2025-088",
    projectTitle: "Roof repair for a small office building, approximately 5,000...",
    customer: "Emily Roberts",
    amount: "$8,100",
    budgetStatus: "4.7% under budget",
    budgetColor: "text-green-600",
    start: "Mar 29, 2025",
    end: "Apr 4, 2025",
    status: "Accepted",
  },
  {
    bidId: "BID-2025-126",
    from: "Sunshine Roofing Co",
    submitted: "Mar 18, 2025",
    projectId: "PRJ-2025-088",
    projectTitle: "Roof repair for a small office building, approximately 5,000...",
    customer: "Emily Roberts",
    amount: "$8,450",
    budgetStatus: "0.6% under budget",
    budgetColor: "text-green-600",
    start: "Mar 30, 2025",
    end: "Apr 5, 2025",
    status: "Rejected",
  },
  {
    bidId: "BID-2025-125",
    from: "AllStar Roofers",
    submitted: "Mar 18, 2025",
    projectId: "PRJ-2025-088",
    projectTitle: "Roof repair for a small office building, approximately 5,000...",
    customer: "Emily Roberts",
    amount: "$8,900",
    budgetStatus: "4.7% over budget",
    budgetColor: "text-red-600",
    start: "Mar 28, 2025",
    end: "Apr 3, 2025",
    status: "Rejected",
  },
];

export default function BiddingActivity() {
  const [filter, setFilter] = useState("All Statuses");

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Bid Management</h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 mb-4">
          <div className="flex space-x-3">
            <select
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Accepted</option>
              <option>Rejected</option>
              <option>Pending</option>
            </select>

            <input
              type="text"
              placeholder="Search bids..."
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-60"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-600 uppercase text-xs">
                <th className="px-4 py-3">Bid Info</th>
                <th className="px-4 py-3">Project Details</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Timeline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bids
                .filter((b) => filter === "All Statuses" || b.status === filter)
                .map((bid, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium">{bid.bidId}</div>
                      <div className="text-xs text-gray-600">From: {bid.from}</div>
                      <div className="text-xs text-gray-400">Submitted: {bid.submitted}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-medium">{bid.projectId}</div>
                      <div className="text-xs text-gray-600">{bid.projectTitle}</div>
                      <div className="text-xs text-gray-400">Customer: {bid.customer}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold">{bid.amount}</div>
                      <div className={`text-xs ${bid.budgetColor}`}>{bid.budgetStatus}</div>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div className="text-xs">Start: {bid.start}</div>
                      <div className="text-xs">End: {bid.end}</div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-semibold text-xs ${statusColors[bid.status]}`}
                      >
                        {bid.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">👁 View</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// Chart Data
const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Users",
      data: [5, 10, 8, 12, 15, 10, 13],
      borderColor: "rgb(59, 130, 246)",
      tension: 0.4,
    },
    {
      label: "Projects",
      data: [2, 4, 5, 6, 8, 5, 6],
      borderColor: "rgb(34, 197, 94)",
      tension: 0.4,
    },
    {
      label: "Bids",
      data: [3, 6, 4, 8, 10, 7, 9],
      borderColor: "rgb(251, 146, 60)",
      tension: 0.4,
    },
  ],
};

// Chart Options
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

const AnalyticManagement = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Filters */}
      <section className="flex justify-between px-10 py-6 bg-gray-50">
        <div className="flex space-x-4">
          <select className="border rounded p-2">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <select className="border rounded p-2">
            <option>Previous period</option>
            <option>Same period last month</option>
          </select>
        </div>
      </section>

      {/* Chart Section */}
      <section className="flex-1 px-10 pb-10 overflow-hidden">
        <div className="bg-white p-6 h-full rounded-lg shadow border flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Platform Growth</h3>

          <div className="flex-1 relative">
            <Line data={data} options={options} />
          </div>

          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
            <span className="text-blue-500">● Users</span>
            <span className="text-green-500">● Projects</span>
            <span className="text-orange-500">● Bids</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticManagement;

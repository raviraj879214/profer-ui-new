import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";

export function DoughnutChartDemo() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [selectedYear, setSelectedYear] = useState("2023");

  const years = [
    { label: "2021", value: "2021" },
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
  ];

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary =
      documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    // Mock year-wise data (12 months each)
    const yearlyData = {
      2021: [30, 45, 50, 60, 70, 80, 90, 75, 65, 55, 45, 35],
      2022: [40, 55, 65, 75, 85, 95, 100, 90, 80, 70, 60, 50],
      2023: [65, 59, 80, 81, 56, 55, 40, 60, 72, 85, 78, 66],
      2024: [28, 48, 40, 19, 86, 27, 90, 70, 58, 45, 68, 77],
    };

    const data = {
      labels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      datasets: [
        {
          label: `Projects for ${selectedYear}`,
          data: yearlyData[selectedYear],
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [selectedYear]); // re-run when year changes

  return (
    <div className="card">
      <div className="flex items-center mb-3 gap-2">
        <label htmlFor="year">Select Year:</label>
        <Dropdown
          id="year"
          value={selectedYear}
          options={years}
          onChange={(e) => setSelectedYear(e.value)}
          placeholder="Select a year"
        />
      </div>
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
}

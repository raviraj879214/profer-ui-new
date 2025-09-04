import React, { useState, useEffect } from "react"
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";


export function CompaniesChartDemo() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [selectedYear, setSelectedYear] = useState(null);
  const [years, setYears] = useState([]);
  const [yearlyData, setYearlyData] = useState({});

  useEffect(() => {
    // Fetch analytics from backend
    axios
      .get("http://localhost:8000/api/get-companies-analytics")
      .then((res) => {
        if (res.data.status === 200) {
          setYearlyData(res.data.data.yearlyData || {});
          setYears(res.data.data.years || []);

          // Default select first year
          if (res.data.data.years.length > 0) {
            setSelectedYear(res.data.data.years[0].value);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching project analytics:", err);
      });
  }, []);

  useEffect(() => {
    if (!selectedYear || !yearlyData[selectedYear]) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary =
      documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const data = {
      labels: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ],
      datasets: [
        {
          label: `Companies for ${selectedYear}`,
          data: yearlyData[selectedYear],
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          backgroundColor: documentStyle.getPropertyValue("--blue-200"),
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
  }, [selectedYear, yearlyData]);

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
      {selectedYear && <Chart type="line" data={chartData} options={chartOptions} />}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const CastewiseDropoutAnalysis = ({
  selectedCity,
  selectedTaluka,
  selectedDistrict,
  selectedState,
}) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Dropouts",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "histogram",
        height: 350,
      },
      title: {
        text: "Caste wise Dropout Analysis",
        align: "center",
        margin: 50,
        style: {
          fontSize: "22px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
      xaxis: {
        categories: [], // Castes will be filled dynamically
        title: {
          text: "Caste",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#263238",
          },
        },
      },
      yaxis: {
        title: {
          text: "Number of Dropout Students",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#263238",
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "70%",
        },
      },
      colors: ["#f97316"], // Orange bars
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val; // Just show dropout count
        },
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          colors: ["#000"],
        },
      },
    },
  });

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `http://localhost:3000/FilterStudentinGroup/Caste?state=${selectedState}&district=${selectedDistrict}&city=${selectedCity}&taluka=${selectedTaluka}&school`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const datas = result.data;

        const categories = datas.StudentsData.map((s) => s.Caste);
        const dropouts = datas.StudentsData.map((student) => student.numOfStudent);

        setChartData((prev) => ({
          ...prev,
          series: [
            {
              name: "Dropouts",
              data: dropouts,
            },
          ],
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: categories,
            },
          },
        }));
      })
      .catch((error) => console.log("error", error));
  }, [selectedCity, selectedDistrict, selectedState, selectedTaluka]);

  return (
    <div className="chart m-8">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar" // Histogram in ApexCharts is shown as a bar chart
        height={chartData.options.chart.height}
      />
    </div>
  );
};

export default CastewiseDropoutAnalysis;

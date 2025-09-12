import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const GenderwiseDropoutAnalysis = ({
  selectedCity,
  selectedTaluka,
  selectedDistrict,
  selectedState,
}) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
        height: 350,
      },
      labels: [],
      legend: {
        position: "bottom",
      },
      title: {
        text: "Gender wise Dropout Analysis",
        align: "center",
        style: {
          fontSize: "22px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return `${opts.w.config.series[opts.seriesIndex]} students`;
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
      `http://localhost:3000/FilterStudentinGroup/Gender?state=${selectedState}&district=${selectedDistrict}&city=${selectedCity}&taluka=${selectedTaluka}&school`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Caste result: ", result);

        const datas = result.data.StudentsData;

        const labels = datas.map((g) => g.Gender);
        const series = datas.map((g) => g.numOfStudent);

        setChartData((prev) => ({
          ...prev,
          series: series,
          options: {
            ...prev.options,
            labels: labels,
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
        type="donut"
        height={chartData.options.chart.height}
      />
    </div>
  );
};

export default GenderwiseDropoutAnalysis;

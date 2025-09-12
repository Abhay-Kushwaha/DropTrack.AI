import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const MediumwiseDropoutAnalysis = ({
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
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val; // just show the number, no %
        },
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          colors: ["#000"],
        },
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: "Number of Dropout Students",
          style: {
            fontSize: "12px",
            color: "#770000",
          },
        },
      },
      colors: ["#009900"], // green color
      title: {
        text: "Medium wise Dropout Analysis",
        align: "center",
        margin: 50,
        style: {
          fontSize: "22px",
          fontWeight: "bold",
          color: "#770000",
        },
      },
      fill: {
        opacity: 1,
      },
    },
  });

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `http://localhost:3000/mediumWise?state=${selectedState}&district=${selectedDistrict}&city=${selectedCity}&taluka=${selectedTaluka}&school`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Medium wise: ", result);

        const datas = result.data;
        const categories = datas.StudentsData.map((s) => s.schoolType);

        // just take the raw dropout numbers (no percentage)
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
        type="bar"
        height={chartData.options.chart.height}
      />
    </div>
  );
};

export default MediumwiseDropoutAnalysis;

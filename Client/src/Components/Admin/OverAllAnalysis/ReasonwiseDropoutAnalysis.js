// import React, { useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";

// const ReasonwiseDropoutAnalysis = ({
//   selectedCity,
//   selectedTaluka,
//   selectedDistrict,
//   selectedState,
// }) => {
//   const [chartData, setChartData] = useState({
//     series: [
//       {
//         name: "Reason",
//         data: [],
//       },
//     ],
//     options: {
//       chart: {
//         type: "bar",
//         height: 350,
//       },
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: "55%",
//           endingShape: "rounded",
//         },
//       },
//       dataLabels: {
//         enabled: true,
//         offsetY: -10,
//         style: {
//           fontSize: "12px",
//           fontWeight: "bold",
//           colors: ["#000"],
//         },
//         formatter: (val) => val + "%",
//       },
//       xaxis: {
//         categories: [],
//       },
//       yaxis: {
//         title: {
//           text: "Percentage of Dropout Students",
//           style: {
//             fontSize: "12px",
//             color: "#263238",
//           },
//         },
//       },
//       colors: ["#f97316", "#fbbf24", "#ea580c"],
//       title: {
//         text: "Reason wise Dropout Analysis",
//         align: "center",
//         margin: 50,
//         style: {
//           fontSize: "26px",
//           fontWeight: "bold",
//           color: "#263238",
//         },
//       },
//       fill: {
//         opacity: 1,
//       },
//     },
//   });

//   useEffect(() => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(
//       `http://localhost:3000/FilterStudentinGroup/Reasons?state=${selectedState}&district=${selectedDistrict}&city=${selectedCity}&taluka=${selectedTaluka}`,
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("API Response:", result);

//         const datas = result?.data;
//         if (!datas?.StudentsData || !datas?.total) return;

//         // Categories (reasons)
//         const categories = datas.StudentsData.map((s) =>
//           !s.Reasons ? "Without Reason" : s.Reasons
//         );

//         // Total number of students (last entry)
//         const totalStudent =
//           datas.total[datas.total.length - 1]?.numOfStudent || 0;

//         // Percentages
//         const percentage = datas.StudentsData.map((student) =>
//           totalStudent
//             ? parseFloat(
//                 ((student.numOfStudent / totalStudent) * 100).toFixed(2)
//               )
//             : 0
//         );

//         // Update chart
//         setChartData((prev) => ({
//           ...prev,
//           series: [{ name: "Reason", data: percentage }],
//           options: {
//             ...prev.options,
//             xaxis: { ...prev.options.xaxis, categories },
//           },
//         }));
//       })
//       .catch((error) => console.error("Error fetching reasons:", error));
//   }, [selectedCity, selectedDistrict, selectedState, selectedTaluka]);

//   return (
//     <div className="chart m-8">
//       <ReactApexChart
//         options={chartData.options}
//         series={chartData.series}
//         type="bar"
//         height={chartData.options.chart.height}
//       />
//     </div>
//   );
// };

// export default ReasonwiseDropoutAnalysis;
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ReasonwiseDropoutAnalysis = ({
  selectedCity,
  selectedTaluka,
  selectedDistrict,
  selectedState,
}) => {
  const [chartData, setChartData] = useState({
    series: [], // percentages will go here
    options: {
      chart: {
        type: "pie",
        height: 350,
      },
      labels: [], // reasons
      title: {
        text: "Reason wise Dropout Analysis",
        align: "center",
        margin: 20,
        style: {
          fontSize: "22px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
      legend: {
        position: "bottom",
      },
      colors: ["#f97316", "#fbbf24", "#ea580c", "#38bdf8", "#34d399", "#ef4444"],
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toFixed(1) + "%",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
    },
  });

  useEffect(() => {
    fetch(
      `http://localhost:3000/FilterStudentinGroup/Reasons?state=${selectedState}&district=${selectedDistrict}&city=${selectedCity}&taluka=${selectedTaluka}`
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("API Response:", result);

        const datas = result?.data;
        if (!datas?.StudentsData || !datas?.total) return;

        // Labels (reasons)
        const labels = datas.StudentsData.map((s) =>
          !s.Reasons ? "Without Reason" : s.Reasons
        );

        // Total students
        const totalStudent =
          datas.total[datas.total.length - 1]?.numOfStudent || 0;

        // Percentages
        const percentages = datas.StudentsData.map((student) =>
          totalStudent
            ? parseFloat(
                ((student.numOfStudent / totalStudent) * 100).toFixed(2)
              )
            : 0
        );

        // Update chart
        setChartData((prev) => ({
          ...prev,
          series: percentages,
          options: {
            ...prev.options,
            labels,
          },
        }));
      })
      .catch((error) => console.error("Error fetching reasons:", error));
  }, [selectedCity, selectedDistrict, selectedState, selectedTaluka]);

  return (
    <div className="chart m-8">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="pie"
        height={chartData.options.chart.height}
      />
    </div>
  );
};

export default ReasonwiseDropoutAnalysis;


import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import FusionMaps from "fusioncharts/fusioncharts.maps";
import India from "fusionmaps/maps/fusioncharts.india";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Register dependencies
ReactFC.fcRoot(FusionCharts, FusionMaps, India, FusionTheme);

// Map data (focus on UP and Rajasthan with high values)
const mapData = [
  { id: "IN.UP", value: 550 }, // Uttar Pradesh
  { id: "IN.RJ", value: 500 }, // Rajasthan
  { id: "IN.MH", value: 400 },
  { id: "IN.BR", value: 350 },
  { id: "IN.TG", value: 250 },
  { id: "IN.KA", value: 300 },
  { id: "IN.GJ", value: 220 },
  { id: "IN.MP", value: 360 },
  { id: "IN.WB", value: 280 },
  { id: "IN.OR", value: 210 },
  { id: "IN.TN", value: 260 },
  { id: "IN.PB", value: 200 },
  { id: "IN.HR", value: 180 },
  { id: "IN.DL", value: 150 },
  { id: "IN.CH", value: 120 },
];

// Adjusted color range to match value distribution
const colorrange = {
  minvalue: "0",
  startlabel: "Low",
  endlabel: "High",
  gradient: "1",
  color: [
    { maxvalue: "100", code: "#ffffff" },   // White
    { maxvalue: "200", code: "#FFEB3B" },   // Yellow
    { maxvalue: "300", code: "#4CAF50" },   // Green
    { maxvalue: "400", code: "#FF9800" },   // Orange
    { maxvalue: "600", code: "#B71C1C" },   // Dark Red
  ],
};

// Chart configurations
const chartConfigs = {
  type: "maps/india",
  width: "65%",
  height: "650",
  dataFormat: "json",
  dataSource: {
    chart: {
      animation: "0",
      showlegend: "1",
      legendposition: "BOTTOM",
      caption: "Dropout Rate in India",
      fillalpha: "100",        // full opacity for better color visibility
      hovercolor: "#CCCCCC",
      theme: "fusion",
    },
    colorrange: colorrange,
    data: mapData,
  },
};

// IndiaMap component
const IndiaMap = () => {
  return (
    <div className="m-auto max-w-6xl">
      <ReactFC {...chartConfigs} />
    </div>
  );
};

export default IndiaMap;

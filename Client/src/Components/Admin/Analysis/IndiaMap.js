// IndiaMap.js — robust, name-based binding (no more ID mismatch)
import React, { useMemo, useRef } from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import FusionMaps from "fusioncharts/fusioncharts.maps";
import India from "fusionmaps/maps/fusioncharts.india"; // same style as your Rajasthan import
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, FusionMaps, India, FusionTheme);

// 1) Human-readable data (no IDs needed)
const stateValues = [
  { state: "Uttar Pradesh", value: 550 },
  { state: "Rajasthan", value: 500 },
  { state: "Maharashtra", value: 400 },
  { state: "Bihar", value: 350 },
  { state: "Telangana", value: 250 },
  { state: "Karnataka", value: 300 },
  { state: "Gujarat", value: 220 },
  { state: "Madhya Pradesh", value: 360 },
  { state: "West Bengal", value: 280 },
  { state: "Odisha", value: 210 },
  { state: "Tamil Nadu", value: 260 },
  { state: "Punjab", value: 200 },
  { state: "Haryana", value: 180 },
  { state: "Delhi", value: 150 },
  { state: "Chandigarh", value: 120 },
];

// 2) Color range for values (0 → 600)
const colorrange = {
  minvalue: "0",
  startlabel: "Low",
  endlabel: "High",
  gradient: "1",
  color: [
    { maxvalue: "100", code: "#ffffff" },
    { maxvalue: "200", code: "#FFEB3B" },
    { maxvalue: "300", code: "#4CAF50" },
    { maxvalue: "400", code: "#FF9800" },
    { maxvalue: "600", code: "#B71C1C" },
  ],
};

// 3) Base config (we inject data after we learn the entity IDs)
const baseConfig = {
  type: "maps/india",
  width: "80%",
  height: "650",
  dataFormat: "json",
  dataSource: {
    chart: {
      caption: "Dropout Rate in India",
      theme: "fusion",
      showlegend: "1",
      legendposition: "BOTTOM",
      animation: "0",
      fillalpha: "100",
      hovercolor: "#CCCCCC",
      nullentitycolor: "#f4f5f7",
      showlabels: "1",
      // debug the binding during dev if needed:
      // entitytooltext: "$id | $lname | $value",
      entitytooltext: "$lname: <b>$value</b>",
    },
    colorrange,
    data: [], // <- fill later after we read entity IDs
  },
};

export default function IndiaMap() {
  const chartRef = useRef(null);

  // 4) Event: after render, fetch entity IDs and set mapped data
  const events = useMemo(
    () => ({
      rendered: (evt) => {
        const chart = evt?.sender;
        if (!chart) return;

        // Get the map’s entities (each has id, shortName, label, longName)
        const entities = chart.getJSONData?.().map?.entities || chart.getEntityList?.() || [];
        if (!entities || entities.length === 0) return;

        // Build lookup tables by long name and by label/shortName (case-insensitive)
        const byLongName = Object.create(null);
        const byLabel = Object.create(null);
        entities.forEach((e) => {
          const id = e.id;
          if (!id) return;
          if (e.longName) byLongName[e.longName.toLowerCase()] = id;
          if (e.label) byLabel[e.label.toLowerCase()] = id;
          if (e.sname) byLabel[e.sname.toLowerCase()] = id;
        });

        // Map the human data to real entity IDs
        const data = stateValues
          .map(({ state, value }) => {
            const key = state.toLowerCase();
            const id = byLongName[key] || byLabel[key];
            return id ? { id, value } : null;
          })
          .filter(Boolean);

        // Inject into chart
        const current = chart.getJSONData();
        current.data = data;                  // some builds expect data at root
        if (current.dataSource) {
          current.dataSource.data = data;     // most builds expect under dataSource
        }
        chart.setJSONData(current);
      },
    }),
    []
  );

  return (
    <div className="m-auto">
      <ReactFC
        ref={chartRef}
        {...baseConfig}
        events={events}
      />
    </div>
  );
}
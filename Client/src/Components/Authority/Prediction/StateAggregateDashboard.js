// StateAggregateDashboard.js
import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";

/** Backend base URL (complete) */
const BASE_URL = "http://127.0.0.1:8000";

/** API endpoints */
const ENDPOINTS = {
  districts: "/ML_api/predict/state/aggregate/districts/",
  talukas: "/ML_api/predict/state/aggregate/talukas/",
  cities: "/ML_api/predict/state/aggregate/cities/",
};

export default function StateAggregateDashboard() {
  const [stateName, setStateName] = useState("Rajasthan");
  const [activeView, setActiveView] = useState(null); // 'districts' | 'talukas' | 'cities'
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [payload, setPayload] = useState(null);
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);

  const fetchAgg = async (viewKey) => {
    if (!stateName.trim()) {
      setErr("Please enter a state name.");
      return;
    }
    setErr("");
    setActiveView(viewKey);
    setLoading(true);
    setPayload(null);
    setSelectedGroupIdx(0);

    try {
      const res = await fetch(`${BASE_URL}${ENDPOINTS[viewKey]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state_name: stateName,
          with_top_students: true,
          top_n: 5,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.detail || "Request failed");
      setPayload(json);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const groups = payload?.groups || [];
  const categories = useMemo(() => groups.map((g) => g.group_label), [groups]);

  const seriesCounts = useMemo(() => {
    const high = groups.map((g) => g.counts?.high ?? 0);
    const med = groups.map((g) => g.counts?.medium ?? 0);
    const low = groups.map((g) => g.counts?.low ?? 0);
    return [
      { name: "High", data: high },
      { name: "Medium", data: med },
      { name: "Low", data: low },
    ];
  }, [groups]);

  const seriesAvgProb = useMemo(() => {
    const probs = groups.map((g) => +(g.avg_dropout_probability ?? 0).toFixed(4));
    return [{ name: "Avg Dropout Probability", data: probs }];
  }, [groups]);

  const stackedBarOpts = useMemo(
    () => ({
      chart: { stacked: true, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false, borderRadius: 6 } },
      xaxis: { categories, labels: { rotate: -30 } },
      yaxis: { title: { text: "Students" } },
      legend: { position: "top" },
      tooltip: { shared: true, intersect: false },
      dataLabels: { enabled: false },
    }),
    [categories]
  );

  const probColOpts = useMemo(
    () => ({
      chart: { toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: "55%", borderRadius: 6 } },
      xaxis: { categories, labels: { rotate: -30 } },
      yaxis: {
        min: 0,
        max: 1,
        tickAmount: 5,
        labels: { formatter: (v) => v.toFixed(2) },
        title: { text: "Avg Probability (0–1)" },
      },
      tooltip: { y: { formatter: (val) => val.toFixed(4) } },
      dataLabels: { enabled: false },
    }),
    [categories]
  );

  const selectedGroup = groups[selectedGroupIdx] || null;

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>State Prediction — Dropout Risk (Aggregates)</h2>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
        <label>
          <span style={{ marginRight: 6 }}>State Name:</span>
          <input
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            placeholder="Enter state name"
            style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #ddd" }}
          />
        </label>

        <button onClick={() => fetchAgg("districts")} style={btnStyle(activeView === "districts")}>
          Districts
        </button>
        <button onClick={() => fetchAgg("talukas")} style={btnStyle(activeView === "talukas")}>
          Talukas
        </button>
        <button onClick={() => fetchAgg("cities")} style={btnStyle(activeView === "cities")}>
          Cities
        </button>
      </div>

      {/* Status */}
      {loading && <p style={{ color: "#555" }}>Loading…</p>}
      {err && (
        <div style={{ background: "#ffe6e6", color: "#a00", padding: 10, borderRadius: 8, marginBottom: 10 }}>
          {String(err)}
        </div>
      )}

      {/* Charts */}
      {payload && groups.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>
                {payload.group_by?.toUpperCase()} — Risk Counts (High/Medium/Low)
              </h3>
              <Chart options={stackedBarOpts} series={seriesCounts} type="bar" height={360} />
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>
                {payload.group_by?.toUpperCase()} — Avg Dropout Probability
              </h3>
              <Chart options={probColOpts} series={seriesAvgProb} type="bar" height={320} />
            </div>
          </div>

          {/* Group picker & Top students */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <h3 style={{ ...cardTitleStyle, marginBottom: 0 }}>Top Students (selected {payload.group_by})</h3>
              <select
                value={selectedGroupIdx}
                onChange={(e) => setSelectedGroupIdx(parseInt(e.target.value, 10))}
                style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #ddd" }}
              >
                {groups.map((g, i) => (
                  <option key={g.group_id || i} value={i}>
                    {g.group_label} — total {g.counts?.total ?? 0}
                  </option>
                ))}
              </select>
            </div>

            {selectedGroup ? (
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Risk Level</th>
                      <th>Risk Score</th>
                      <th>Dropout Prob.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedGroup.top_students || []).map((s, idx) => (
                      <tr key={idx}>
                        <td>{s.StudentLabel}</td>
                        <td>{s.Risk_Level}</td>
                        <td>{Number(s.Risk_Score).toFixed(0)}</td>
                        <td>{Number(s.Dropout_Probability).toFixed(2)}</td>
                      </tr>
                    ))}
                    {(!selectedGroup.top_students || selectedGroup.top_students.length === 0) && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
                          No top students in this group.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#888" }}>Select a {payload.group_by} to view top students.</p>
            )}
          </div>

          {/* Raw JSON */}
          <div style={{ ...cardStyle, background: "#fafafa" }}>
            <h3 style={cardTitleStyle}>Raw JSON</h3>
            <pre style={preStyle}>{JSON.stringify(payload, null, 2)}</pre>
          </div>
        </>
      )}

      {/* Empty state */}
      {payload && groups.length === 0 && !loading && !err && (
        <p style={{ color: "#666" }}>No groups found. Try a different state.</p>
      )}
    </div>
  );
}

/* ---------- small styling helpers ---------- */
function btnStyle(active) {
  return {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: active ? "#2563eb" : "#f3f4f6",
    color: active ? "#fff" : "#111",
    cursor: "pointer",
  };
}
const cardStyle = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 14,
  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
};
const cardTitleStyle = { margin: "2px 0 10px", fontSize: 16, fontWeight: 600 };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const preStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #eee",
  background: "#f6f8fa",
  fontSize: 12,
  overflowX: "auto",
  maxHeight: 400,
};

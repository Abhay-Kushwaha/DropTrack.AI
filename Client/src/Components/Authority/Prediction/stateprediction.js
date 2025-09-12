
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function StatePredictionPage() {
    const stateData = useSelector((state) => state.user.user);
    const stateId = stateData?.State?.StateID || 0; // get stateId from Redux
    const stateName = stateData?.State?.name || ""; // get stateId from Redux
    const feesMonths = 12; // default

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    // Backend API endpoint
    const API_BASE = "http://127.0.0.1:8000/ML_api/predict/state/";

    const colorMap = {
        Low: "bg-green-50 text-green-800",
        Medium: "bg-orange-50 text-orange-800",
        High: "bg-red-50 text-red-800",
    };

    async function handleSubmit(e) {
        e && e.preventDefault();
        setError("");
        setLoading(true);
        setResults([]);

        // <<< ADD THIS LINE HERE for 10 seconds delay >>>
        await new Promise((resolve) => setTimeout(resolve, 10000));
        try {
            const res = await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    state_public_id: Number(stateId),
                    state_name: stateName,
                    fees_months_denom: feesMonths,
                    with_gemini:true,
                    //   {
                    //         "state_name": "Rajasthan",
                    //         "fees_months_denom": 12,
                    //         "with_gemini": true,
                    //         "gemini_max_students": 10,
                    //         "gemini_max_chars": 1800,
                    //         "force_retrain": false
                    //     }
                }),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Server error: ${res.status} - ${txt}`);
            }

            const data = await res.json();

            const enriched = (data.results || []).map((r, idx) => ({
                StudentID: r.StudentID || `S-${idx + 1}`,
                Risk_Score: r.Risk_Score ?? "N/A",
                Risk_Level: r.Risk_Level || r.Predicted_Risk_Level || "Unknown",
                Dropout_Reason: r.Dropout_Reason || "Not specified",
                Dropout_Probability:
                    typeof r.Dropout_Probability === "number" ? r.Dropout_Probability : null,
                Description: r.Description || generateFallbackDescription(r),
            }));

            setResults(enriched);
        } catch (err) {
            console.error(err);
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    function generateFallbackDescription(r) {
        const parts = [];
        if (r.Risk_Level) parts.push(`Risk level is ${r.Risk_Level}`);
        if (r.Dropout_Reason) parts.push(`because: ${r.Dropout_Reason}`);
        if (typeof r.Dropout_Probability === "number")
            parts.push(`probability ${Math.round(r.Dropout_Probability * 100)}%`);
        return parts.length > 0 ? parts.join(". ") + "." : "No description available.";
    }

    function downloadJSON() {
        const payload = {
            query: {
                state_public_id: Number(stateId),
                fees_months_denom: feesMonths,
            },
            results,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `prediction_${stateId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="w-full justify-center mx-auto p-6">
            <h1 className="text-4xl text-center font-bold mb-5">
                State Prediction - Dropout Risk
            </h1>

            {/* Run Prediction Button */}
            <div className=" flex gap-10 justify-center mb-6">
                <button
                    onClick={handleSubmit}
                    className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
                    disabled={loading}
                >
                    {loading ? "Predicting..." : "Run Prediction"}
                </button>

                <button
                    type="button"
                    onClick={downloadJSON}
                    className="ml-3 bg-gray-100 border px-3 py-2 rounded"
                >
                    Download JSON
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-800 border rounded">
                    {error}
                </div>
            )}

            {/* Results */}
            <div className="space-y-4">
                {results.length === 0 && !loading && (
                    <div className="text-sm text-gray-500">
                        No results yet. Run predict to see student-level risk table.
                    </div>
                )}

                {results.map((r, idx) => (
                    <div
                        key={r.StudentID || idx}
                        className={`border rounded p-4 ${colorMap[r.Risk_Level] || "bg-white"}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-sm text-gray-600">
                                    StudentID: <span className="font-mono">{r.StudentID}</span>
                                </div>
                                <div className="mt-1 text-lg font-semibold">
                                    Risk Score: {r.Risk_Score} — <span className="font-medium">{r.Risk_Level}</span>
                                </div>
                                <div className="text-sm text-gray-700 mt-2">
                                    Dropout Reason: {r.Dropout_Reason}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm">Probability</div>
                                <div className="text-2xl font-bold">
                                    {typeof r.Dropout_Probability === "number"
                                        ? Math.round(r.Dropout_Probability * 100) + "%"
                                        : "N/A"}
                                </div>
                            </div>
                        </div>

                        <hr className="my-3" />

                        <div>
                            <div className="text-sm text-gray-600 mb-1">Description (generated):</div>
                            <div className="bg-white p-3 rounded border text-sm text-gray-800">{r.Description}</div>
                        </div>

                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => navigator.clipboard.writeText(JSON.stringify(r, null, 2))}
                                className="text-xs px-3 py-1 border rounded"
                            >
                                Copy JSON
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6">
                <div className="text-sm font-medium mb-2">Legend</div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-sm bg-green-500" /> <span className="text-sm">Low (Green)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-sm bg-orange-500" /> <span className="text-sm">Medium (Orange)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-sm bg-red-500" /> <span className="text-sm">High (Red)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// RAGClient.js (client-friendly UI)
// Minimal, dependency-free React component that calls your DRF RAG endpoints
// and renders human-readable results for non-technical users.
// Endpoints:
//  - POST http://127.0.0.1:8000/RAG_api/rag/build-from-dir/
//  - POST http://127.0.0.1:8000/RAG_api/rag/build-from-upload/
//  - POST http://127.0.0.1:8000/RAG_api/rag/ask/

import React, { useMemo, useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

export default function RAGClient() {
  // API results
  const [buildDirResult, setBuildDirResult] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [askResult, setAskResult] = useState(null);

  // UI state
  const [uploading, setUploading] = useState(false);
  const [building, setBuilding] = useState(false);
  const [asking, setAsking] = useState(false);

  const [question, setQuestion] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const [showBuildDirJSON, setShowBuildDirJSON] = useState(false);
  const [showUploadJSON, setShowUploadJSON] = useState(false);
  const [showAskJSON, setShowAskJSON] = useState(false);

  // ------------------------ Helpers ------------------------
  function baseName(p) {
    if (!p) return "";
    const norm = String(p).replaceAll("\\\\", "/");
    return norm.split("/").pop();
  }

  function FriendlyStatus({ ok, message }) {
    if (ok === undefined || ok === null) return null;
    const color = ok ? "#065f46" : "#991b1b";
    const bg = ok ? "#ecfdf5" : "#fee2e2";
    const border = ok ? "#a7f3d0" : "#fecaca";
    return (
      <div style={{ background: bg, border: `1px solid ${border}`, color, padding: 12, borderRadius: 10 }}>
        <span style={{ fontWeight: 700, marginRight: 6 }}>{ok ? "✓ Success:" : "⚠ Error:"}</span>
        <span>{message || (ok ? "Operation completed successfully." : "Something went wrong.")}</span>
      </div>
    );
  }

  function StatRow({ label, value }) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed #e5e7eb" }}>
        <div style={{ color: "#6b7280" }}>{label}</div>
        <div style={{ fontWeight: 600 }}>{value}</div>
      </div>
    );
  }

  function BuildStats({ data }) {
    if (!data) return null;
    const docs = data?.stats?.documents ?? "-";
    const chunks = data?.stats?.chunks ?? "-";
    return (
      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>What got prepared?</div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
          <StatRow label="Documents processed" value={docs} />
          <StatRow label="Text chunks created" value={chunks} />
        </div>
      </div>
    );
  }

  function SourceList({ sources }) {
    if (!Array.isArray(sources) || sources.length === 0) return null;
    return (
      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Where did this answer come from?</div>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          {sources.map((s, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              <code>{baseName(s.source)}</code>
              {typeof s.page !== "undefined" && <span>{" — page "}{s.page}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function JSONToggle({ open, onToggle, data }) {
    if (!data) return null;
    return (
      <details open={open} onToggle={onToggle} style={{ marginTop: 10 }}>
        <summary style={{ cursor: "pointer", color: "#2563eb" }}>Show technical details (JSON)</summary>
        <pre style={{ background: "#f3f4f6", padding: 12, borderRadius: 10, overflow: "auto", marginTop: 8 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    );
  }

  const hasSelectedFiles = useMemo(() => (files && files.length > 0), [files]);

  // ------------------------ API Calls ------------------------
  async function buildFromDir() {
    try {
      setError("");
      setBuilding(true);
      setBuildDirResult(null);
      const res = await fetch(`${BASE_URL}/RAG_api/rag/build-from-dir/`, { method: "POST" });
      const data = await res.json();
      setBuildDirResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setBuilding(false);
    }
  }

  async function buildFromUpload(e) {
    e.preventDefault();
    if (!hasSelectedFiles) { setError("Please choose one or more PDF files."); return; }
    try {
      setError("");
      setUploading(true);
      setUploadResult(null);
      const form = new FormData();
      // Change "file" to "files" if your backend expects that key.
      for (const f of files) form.append("files", f);
      const res = await fetch(`${BASE_URL}/RAG_api/rag/build-from-upload/`, { method: "POST", body: form });
      const data = await res.json();
      setUploadResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setUploading(false);
    }
  }

  async function askQuestion(e) {
    e.preventDefault();
    if (!question.trim()) { setError("Please enter your question."); return; }
    try {
      setError("");
      setAsking(true);
      setAskResult(null);
      const res = await fetch(`${BASE_URL}/RAG_api/rag/ask/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAskResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setAsking(false);
    }
  }

  // ------------------------ Styles ------------------------
  const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 16, background: "#fff" };
  const btn = { padding: "10px 14px", borderRadius: 10, border: "1px solid #111827", background: "#111827", color: "#fff", fontWeight: 600 };
  const input = { padding: 10, borderRadius: 10, border: "1px solid #d1d5db", flex: 1 };

  return (
    <div style={{ minHeight: "100vh", padding: 16, background: "#f9fafb" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Understand the documents with RAG.ai</h1>
      <p style={{ color: "#4b5563", marginBottom: 16 }}>
        Build your knowledge base from files, then ask questions in plain English. We'll show the answer and where it came from.
      </p>

      {error ? (
        <div style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: 12, borderRadius: 10, color: "#991b1b", marginBottom: 12 }}>{error}</div>
      ) : null}

      {/* Build from Directory */}
      <section style={box}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Build from server folder</div>
            <div style={{ color: "#6b7280" }}>Use documents already placed on the server.</div>
          </div>
          <button onClick={buildFromDir} disabled={building} style={{ ...btn, opacity: building ? 0.6 : 1 }}>
            {building ? "Preparing..." : "Build now"}
          </button>
        </div>

        {buildDirResult && (
          <div style={{ marginTop: 12 }}>
            <FriendlyStatus ok={buildDirResult?.ok} message={buildDirResult?.message} />
            <BuildStats data={buildDirResult} />
            <JSONToggle open={showBuildDirJSON} onToggle={() => setShowBuildDirJSON(!showBuildDirJSON)} data={buildDirResult} />
          </div>
        )}
      </section>

      {/* Build from Upload */}
      <section style={box}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Add your PDFs</div>
        <form onSubmit={buildFromUpload} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <input type="file" accept="application/pdf" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
          <button type="submit" disabled={uploading} style={{ ...btn, opacity: uploading ? 0.6 : 1 }}>
            {uploading ? "Uploading..." : "Upload & Build"}
          </button>
        </form>
        {hasSelectedFiles && (
          <div style={{ marginTop: 8, color: "#6b7280" }}>
            Files selected: {files.map((f) => baseName(f.name)).join(", ")}
          </div>
        )}
        {uploadResult && (
          <div style={{ marginTop: 12 }}>
            <FriendlyStatus ok={uploadResult?.ok} message={uploadResult?.message} />
            <BuildStats data={uploadResult} />
            <JSONToggle open={showUploadJSON} onToggle={() => setShowUploadJSON(!showUploadJSON)} data={uploadResult} />
          </div>
        )}
      </section>

      {/* Ask */}
      <section style={box}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Ask a question</div>
        <form onSubmit={askQuestion} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g., What scholarships cover tuition for STEM students?" style={input} />
          <button type="submit" disabled={asking} style={{ ...btn, opacity: asking ? 0.6 : 1 }}>
            {asking ? "Searching..." : "Get answer"}
          </button>
        </form>

        {askResult && (
          <div style={{ marginTop: 12 }}>
            <FriendlyStatus ok={askResult?.ok} message={askResult?.ok ? "Answer ready" : askResult?.message || "Could not get an answer"} />
            {askResult?.answer && (
              <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Answer</div>
                <p style={{ margin: 0, lineHeight: 1.6 }}>{askResult.answer}</p>
              </div>
            )}
            <SourceList sources={askResult?.sources} />
            <JSONToggle open={showAskJSON} onToggle={() => setShowAskJSON(!showAskJSON)} data={askResult} />
          </div>
        )}
      </section>

      <footer style={{ color: "#6b7280", fontSize: 12 }}>
        Tip: Use PDFs for best results. You can always expand the technical JSON if you want to see raw details.
      </footer>
    </div>
  );
}

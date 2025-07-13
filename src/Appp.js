import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function App() {
  const [file, setFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [jobUploadMessage, setJobUploadMessage] = useState("");
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [matchScore, setMatchScore] = useState(null);
  const [timestamp, setTimestamp] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/history");
      setHistory(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch history", err);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadMessage("");
  };

  const handleJobFileChange = (event) => {
    setJobFile(event.target.files[0]);
    setJobUploadMessage("");
  };

  const handleUploadResume = async () => {
    if (!file) return alert("Please select a resume file.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8080/api/upload-resume", formData);
      setUploadMessage(`✅ ${res.data}`);
    } catch (err) {
      setUploadMessage("❌ Error uploading resume");
    }
  };

  const handleUploadJob = async () => {
    if (!jobFile) return alert("Please select a job description file.");
    const formData = new FormData();
    formData.append("file", jobFile);

    try {
      const res = await axios.post("http://localhost:8080/api/upload-job", formData);
      setJobUploadMessage(`✅ ${res.data}`);
    } catch (err) {
      setJobUploadMessage("❌ Failed to upload job description");
    }
  };

  const handleMatchResult = async () => {
    if (!file || !jobFile) return alert("Upload both resume and job first.");
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:8080/api/getMatchResult", {
        params: {
          resumeId: 1,
          jobId: 1,
        },
      });

      const result = res.data;
      setMatchedSkills(result.matchedSkills?.split(",").map((s) => s.trim()) || []);
      setMissingSkills(result.missingSkills?.split(",").map((s) => s.trim()) || []);
      setMatchScore(result.matchScore || 0);
      setTimestamp(new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }));
      fetchHistory(); // Refresh history after match
    } catch (err) {
      alert("Failed to fetch match result.");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setFile(null);
    setJobFile(null);
    setUploadMessage("");
    setJobUploadMessage("");
    setMatchedSkills([]);
    setMissingSkills([]);
    setMatchScore(null);
    setTimestamp("");
    setLoading(false);
  };

  const handleDownloadCSV = () => {
    const rows = [
      ["Field", "Value"],
      ["Resume File", file?.name || ""],
      ["Job File", jobFile?.name || ""],
      ["Match Score", `${matchScore}%`],
      ["Matched Skills", matchedSkills.join(", ")],
      ["Missing Skills", missingSkills.join(", ")],
      ["Timestamp", timestamp],
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "match_result.csv");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Resume Match Result", 14, 20);

    const row = [
      ["Resume File", file?.name || ""],
      ["Job File", jobFile?.name || ""],
      ["Match Score", `${matchScore}%`],
      ["Matched Skills", matchedSkills.join(", ")],
      ["Missing Skills", missingSkills.join(", ")],
      ["Timestamp", timestamp],
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: row,
      styles: { cellWidth: "wrap" },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { cellWidth: 130 },
      },
    });

    doc.save("match_result.pdf");
  };

  return (
    <div className="App">
      <h1>Resume Upload</h1>
      <input type="file" onChange={handleFileChange} />
      {file && <p>Selected Resume: {file.name}</p>}
      <button onClick={handleUploadResume}>Upload Resume</button>
      <p>{uploadMessage}</p>

      <h1>Job Description Upload</h1>
      <input type="file" onChange={handleJobFileChange} />
      {jobFile && <p>Selected Job Description: {jobFile.name}</p>}
      <button onClick={handleUploadJob}>Upload Job Description</button>
      <p>{jobUploadMessage}</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleMatchResult} disabled={loading}>
          {loading ? "⏳ Processing..." : "Get Match Result"}
        </button>
        <button onClick={handleReset} style={{ marginLeft: "10px" }}>🔄 Reset</button>
        <button onClick={handleDownloadCSV} disabled={!matchScore} style={{ marginLeft: "10px" }}>
          📥 Download CSV
        </button>
        <button onClick={handleDownloadPDF} disabled={!matchScore} style={{ marginLeft: "10px" }}>
          🧾 Download PDF
        </button>
      </div>

      {matchScore !== null && (
        <div className="result-box">
          <h2>🔍 Match Result</h2>
          <p><strong>Match Score:</strong> {matchScore}%</p>
          <p><strong>✅ Matched Skills:</strong></p>
          <ul>
            {matchedSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
          <p><strong>❌ Missing Skills:</strong></p>
          <ul>
            {missingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
          <p><strong>🕒 Matched on:</strong> {timestamp}</p>
        </div>
      )}

      {/* Match History Table */}
      <div className="history-section">
        <h2>📜 Previous Match Results</h2>
        {history.length === 0 ? (
          <p>No previous records found.</p>
        ) : (
          <table border="1" cellPadding="8" style={{ marginTop: "10px", width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Resume ID</th>
                <th>Job ID</th>
                <th>Matched Skills</th>
                <th>Missing Skills</th>
                <th>Score</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.resumeId}</td>
                  <td>{entry.jobId}</td>
                  <td>{entry.matchedSkills}</td>
                  <td>{entry.missingSkills}</td>
                  <td>{entry.matchScore}%</td>
                  <td>{entry.timestamp ? new Date(entry.timestamp).toLocaleString("en-IN") : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;

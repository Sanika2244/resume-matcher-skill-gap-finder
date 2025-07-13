import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RefreshIcon from "@mui/icons-material/Refresh";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";

function Home() {
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

  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
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
    } catch {
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
    } catch {
      setJobUploadMessage("❌ Error uploading job description");
    }
  };

  const handleMatchResult = async () => {
    if (!file || !jobFile) return alert("Upload both resume and job first.");
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/getMatchResult", {
        params: { resumeId: 1, jobId: 1 },
      });

      const result = res.data;
      setMatchedSkills(result.matchedSkills?.split(",").map((s) => s.trim()) || []);
      setMissingSkills(result.missingSkills?.split(",").map((s) => s.trim()) || []);
      setMatchScore(result.matchScore || 0);
      setTimestamp(new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }));
      fetchHistory(); // update history after match
    } catch {
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
    const csvContent = rows.map(row => row.join(",")).join("\n");
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
    });
    doc.save("match_result.pdf");
  };

  return (
    <>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Resume Matcher Dashboard</Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {/* Upload Sections */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Upload Resume</Typography>
              <input type="file" onChange={handleFileChange} />
              {file && <Typography variant="body2">Selected: {file.name}</Typography>}
              <Button
                variant="contained"
                startIcon={<UploadFileIcon />}
                sx={{ mt: 1 }}
                onClick={handleUploadResume}
              >
                Upload Resume
              </Button>
              <Typography sx={{ mt: 1 }}>{uploadMessage}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Upload Job Description</Typography>
              <input type="file" onChange={handleJobFileChange} />
              {jobFile && <Typography variant="body2">Selected: {jobFile.name}</Typography>}
              <Button
                variant="contained"
                startIcon={<UploadFileIcon />}
                sx={{ mt: 1 }}
                onClick={handleUploadJob}
              >
                Upload Job Description
              </Button>
              <Typography sx={{ mt: 1 }}>{jobUploadMessage}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Buttons */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item>
            <Button variant="contained" onClick={handleMatchResult} startIcon={<AssessmentIcon />} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : "Get Match Result"}
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" startIcon={<RefreshIcon />} onClick={handleReset}>
              Reset
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" disabled={!matchScore} startIcon={<DownloadIcon />} onClick={handleDownloadCSV}>
              CSV
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" disabled={!matchScore} startIcon={<DownloadIcon />} onClick={handleDownloadPDF}>
              PDF
            </Button>
          </Grid>
        </Grid>

        {/* Match Result */}
        {matchScore !== null && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6">🔍 Match Result</Typography>
              <Typography>Match Score: <strong>{matchScore}%</strong></Typography>

              <Typography sx={{ mt: 2 }}>✅ Matched Skills:</Typography>
              <List>
                {matchedSkills.map((skill, i) => (
                  <ListItem key={i} disablePadding>
                    <ListItemText primary={skill} />
                  </ListItem>
                ))}
              </List>

              <Typography sx={{ mt: 2 }}>❌ Missing Skills:</Typography>
              <List>
                {missingSkills.map((skill, i) => (
                  <ListItem key={i} disablePadding>
                    <ListItemText primary={skill} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="body2" sx={{ mt: 2 }}>🕒 {timestamp}</Typography>
            </CardContent>
          </Card>
        )}

        {/* History Table */}
        <Paper sx={{ mt: 5, p: 2 }}>
          <Typography variant="h6" gutterBottom><HistoryIcon sx={{ mr: 1 }} />Previous Match Results</Typography>
          {history.length === 0 ? (
            <Typography>No previous records found.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Resume ID</TableCell>
                    <TableCell>Job ID</TableCell>
                    <TableCell>Matched Skills</TableCell>
                    <TableCell>Missing Skills</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.id}</TableCell>
                      <TableCell>{entry.resumeId}</TableCell>
                      <TableCell>{entry.jobId}</TableCell>
                      <TableCell>{entry.matchedSkills}</TableCell>
                      <TableCell>{entry.missingSkills}</TableCell>
                      <TableCell>{entry.matchScore}%</TableCell>
                      <TableCell>{entry.timestamp ? new Date(entry.timestamp).toLocaleString("en-IN") : "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default Home;

# 🤖 Resume Matcher + Skill Gap Finder

An AI-powered web application that matches candidate resumes with job descriptions, highlights matched and missing skills, and identifies skill gaps — built using **Spring Boot**, **Python NLP**, **MySQL**, and **React.js**.

## 🚀 Features

- ✅ HR Login Authentication
- 📄 Upload Resume and Job Description (PDF/DOCX)
- 🔍 NLP-based Skill Extraction
- 📊 Skill Matching & Match Score Calculation
- 🧠 Missing Skill Detection
- 🗃️ Match History Dashboard
- 📤 Export Results as CSV or PDF
- 💡 “Remember Me”, Dark/Light Mode, Loading Spinner
- 🎨 Styled using **Material UI (MUI)**

---

## 🛠️ Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | React.js + MUI |
| Backend      | Spring Boot (Java) |
| AI/NLP       | Python (spaCy / custom extraction) |
| Database     | MySQL |
| File Uploads | REST API + FormData |
| Export       | jsPDF + FileSaver.js |
| Hosting      | GitHub (Demo link locally run) |


---

## 📦 Setup Instructions

### 1️⃣ Backend (Spring Boot)

```bash
cd resumematcher
./mvnw spring-boot:run




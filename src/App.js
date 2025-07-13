import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
        />
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

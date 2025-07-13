import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Login({ toggleTheme, isDarkMode }) {
  const [username, setUsername] = useState(localStorage.getItem("rememberedUsername") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem("rememberedUsername"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      if (response.status === 200 && response.data === "Login successful") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }
        setError("");
        navigate("/home");
      } else {
        setError("❌ Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("❌ Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: isDarkMode ? "#121212" : "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 350,
          bgcolor: isDarkMode ? "#1e1e1e" : "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          🔐 HR Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          }
          label="Remember me"
        />

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "🔓 Login"}
        </Button>

        <Box display="flex" justifyContent="center" mt={2}>
          <FormControlLabel
            control={<Switch checked={isDarkMode} onChange={toggleTheme} />}
            label={isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Login;

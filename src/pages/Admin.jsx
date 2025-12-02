import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import puplogo from "../assets/images/LandingPage/puplogo.png";
import cybernest from "../assets/images/LandingPage/cybernest.png";
import flow from "../assets/images/LandingPage/flow.png";

export default function Admin() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    if (!formData.username) {
      toast.warning("Username is required!");
      return;
    }

    if (!formData.username.includes("@gmail.com")) {
      toast.error("Username must be a valid Gmail address.");
      return;
    }

    if (!formData.password) {
      toast.warning("Password is required!");
      return;
    }

    setLoading(true);

    // TODO: Replace with real API
    setTimeout(() => {
      toast.success("Admin logged in! (Placeholder)");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] flex flex-col items-center justify-between py-8">

      {/* Toastify Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />

      {/* Top Section */}
      <div className="w-full max-w-[360px] flex flex-col items-center text-center">

        {/* Logo */}
        <img src={puplogo} alt="TBIDO Logo" className="h-14 mb-4" />

        {/* Title */}
        <h1 className="text-lg font-extrabold bg-gradient-to-r from-[#6D0C22] to-[#0E386B] bg-clip-text text-transparent mb-1">
          Admin Login
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Access administrative tools and system controls.
        </p>

        {/* Form Fields */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: "333px",
            mb: 2,
          }}
        >
          {/* Email Username */}
          <TextField
            label="Admin Username (Gmail)"
            name="username"
            value={formData.username}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Password Field with Eye Toggle */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full max-w-[333px] py-3 text-sm font-semibold rounded-lg transition 
            bg-gradient-to-r from-[#6D0C22] to-[#0E386B] text-white
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      {/* Powered By */}
      <div className="flex flex-col items-center mt-8 space-y-1">
        <p className="text-[10px] text-gray-400">Powered By:</p>
        <div className="flex items-center space-x-2">
          <img src={cybernest} alt="Cybernest Solutions" className="h-12" />
          <img src={flow} alt="Flow" className="h-4" />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import SuccessModal from "../components/SucessModal"; // New modal import
import puplogo from "../assets/images/LandingPage/puplogo.png";
import cybernest from "../assets/images/LandingPage/cybernest.png";
import flow from "../assets/images/LandingPage/flow.png";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    office: "",
    position: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // state to control the new modal
  const [sessionId, setSessionId] = useState(""); // store session_id for redirection
  const navigate = useNavigate();
  const location = useLocation();

  const prefilledEmail = location.state?.email || "";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLogin = async () => {
    if (!formData.email && !prefilledEmail) {
      toast.warning("Email is required!");
      return;
    }
    if (!formData.terms) {
      toast.info("You must agree to the terms before logging in.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://tbidoflowapi.azurewebsites.net/login",
        {
          email: formData.email || prefilledEmail,
          name: formData.name,
          office: formData.office,
          position: formData.position,
          terms: formData.terms,
        }
      );

      const { status, message, session_id } = res.data;

      setSessionId(session_id);

      // Trigger the modal upon success
      setIsModalOpen(true);

      if (status === "already_logged_in") {
        toast.success(message);
      } else {
        toast.success("Successfully logged in!");
      }

    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage = err?.response?.data?.message || "Login failed. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/", {
      state: {
        email: formData.email || prefilledEmail,
        sessionId: sessionId,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] flex flex-col items-center justify-between py-8">
      {/* Top Section */}
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="w-full max-w-[360px] flex flex-col items-center text-center">
        {/* Logo */}
        <img src={puplogo} alt="TBIDO Logo" className="h-15 mb-4" />

        {/* Title with Gradient */}
        <h1 className="text-lg font-extrabold bg-gradient-to-r from-[#6D0C22] to-[#0E386B] bg-clip-text text-transparent mb-1">
          Login
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          View the current status and updates of <br /> your incubatee application.
        </p>

        {/* MUI Form Fields */}
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
          {/* Email Address */}
          <TextField
            type="email"
            name="email"
            label="Email Address"
            value={formData.email || prefilledEmail}
            onChange={handleChange}
            disabled={!!prefilledEmail}
            size="small"
            fullWidth
          />

          {/* Full Name */}
          <TextField
            type="text"
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Office */}
          <TextField
            type="text"
            name="office"
            label="Office"
            value={formData.office}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Position */}
          <TextField
            type="text"
            name="position"
            label="Position"
            value={formData.position}
            onChange={handleChange}
            size="small"
            fullWidth
          />
        </Box>

        {/* Terms */}
        <label className="flex items-start text-left w-full max-w-[333px] text-xs text-gray-600 mb-5">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            className="mr-2 mt-[2px]"
          />
          <span>
            I have read and agreed to the{" "}
            <a href="#" className="text-[#0E386B] font-semibold hover:underline">
              Privacy Notice
            </a>
            ,{" "}
            <a href="#" className="text-[#0E386B] font-semibold hover:underline">
              Terms and Conditions
            </a>
            , and{" "}
            <a href="#" className="text-[#0E386B] font-semibold hover:underline">
              Terms of Use
            </a>
            .
          </span>
        </label>

        {/* Next Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full max-w-[333px] py-3 text-sm font-semibold rounded-lg transition bg-gradient-to-r from-[#6D0C22] to-[#0E386B] text-white ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Logging in..." : "Next"}
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

      {/* Success Modal */}
      <SuccessModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="You're already logged in!"
        message="Redirecting you to logout to complete your session."
      />
    </div>
  );
}

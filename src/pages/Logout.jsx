import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import puplogo from "../assets/images/LandingPage/puplogo.png";
import cybernest from "../assets/images/LandingPage/cybernest.png";
import flow from "../assets/images/LandingPage/flow.png";

import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ThankYouModal from "../components/ThankYouModal";

export default function Logout() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: "",
    resources: [],
    feedback: "",
    otherResource: "",
  });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resourceOptions = [
    "Computer",
    "Projector with Clicker",
    "TV",
    "Printer",
    "Co-working Tables",
  ];

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const newResources = checked
        ? [...prevState.resources, value]
        : prevState.resources.filter((item) => item !== value);
      return { ...prevState, resources: newResources };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    const emailToUse = formData.email || prefilledEmail;

    if (!emailToUse) {
      toast.error("Email is required!");
      return;
    }

    const allResources = [...formData.resources];
    if (formData.otherResource.trim() !== "") {
      allResources.push(formData.otherResource.trim());
    }

    setLoading(true);
    try {
      const res = await axios.post("https://tbidoflowapi.azurewebsites.net/logout", {
        email: emailToUse,
        resources: allResources.join(", "),
        feedback: formData.feedback,
      });

      const { message, status } = res.data;

      if (status === "already_logged_out") {
        toast.success(message);
      } else {
        ""
      }

      setIsModalOpen(true);
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] flex flex-col items-center justify-between py-8">
      {/* Toasts */}
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Top Content */}
      <div className="w-full max-w-[360px] flex flex-col items-center text-center">
        <img src={puplogo} alt="TBIDO Logo" className="h-12 mb-4" />
        <h1 className="text-lg font-extrabold bg-gradient-to-r from-[#6D0C22] to-[#0E386B] bg-clip-text text-transparent mb-1">
          Logout
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          View the current status and updates of <br /> your incubatee application.
        </p>

        {/* Email Field */}
        <TextField
          type="email"
          name="email"
          label="Email Address"
          value={formData.email || prefilledEmail}
          onChange={handleChange}
          disabled={!!prefilledEmail}
          size="small"
          fullWidth
          sx={{ mb: 2 }}
          className="max-w-[333px] font-[Montserrat]"
        />

        {/* Resources */}
        <div className="w-full max-w-[333px] text-left text-sm font-semibold mb-1 font-[Montserrat]">
          Resources Used:
        </div>
        <FormGroup className="w-full max-w-[333px]">
          {resourceOptions.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  value={option}
                  checked={formData.resources.includes(option)}
                  onChange={handleCheckboxChange}
                />
              }
              label={option}
              className="text-sm"
            />
          ))}
        </FormGroup>

        {/* Other Resource */}
        <TextField
          name="otherResource"
          label="Other Resource"
          value={formData.otherResource}
          onChange={handleChange}
          size="small"
          fullWidth
          sx={{ mb: 2 }}
          className="max-w-[333px] font-[Montserrat]"
        />

        {/* Feedback */}
        <TextField
          name="feedback"
          label="Feedback"
          value={formData.feedback}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          sx={{ mb: 2 }}
          className="max-w-[333px] font-[Montserrat]"
        />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`w-full max-w-[333px] py-3 text-sm font-semibold rounded-lg transition bg-gradient-to-r from-[#6D0C22] to-[#0E386B] text-white ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center mt-8 space-y-1">
        <p className="text-[10px] text-gray-400">Powered By:</p>
        <div className="flex items-center space-x-2">
          <img src={cybernest} alt="Cybernest Solutions" className="h-12" />
          <img src={flow} alt="Flow" className="h-4" />
        </div>
      </div>

      {/* Reusable Thank You Modal */}
      <ThankYouModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Thank you!"
        message="You have successfully logged out."
      />
    </div>
  );
}

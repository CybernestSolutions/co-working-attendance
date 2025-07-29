import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import coWorking from "../assets/images/LandingPage/co-working.svg";
import venue from "../assets/images/LandingPage/venue.svg";
import cybernest from "../assets/images/LandingPage/cybernest.png";
import puplogo from "../assets/images/LandingPage/puplogo.png";
import flow from "../assets/images/LandingPage/flow.png";

import ErrorModal from "../components/Error"; 
import WrongNetworkModal from "../components/WrongNetworkModal";

export default function LandingPage() {
  const [selected, setSelected] = useState(null);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (option) => {
    setSelected(option);
  };

  const handleNext = async () => {
    //  If venue is selected → show Venue Modal
    if (selected === "venue") {
      setIsVenueModalOpen(true);
      return;
    }

    
    if (selected === "coworking") {
      setLoading(true);
      try {
        const res = await axios.get("http://192.168.0.191:3000/api/check-network");

        if (res.data?.connected) {
          navigate("/logbook"); 
        } else {
          setIsNetworkModalOpen(true); 
        }
      } catch (err) {
        console.error("Network check failed:", err);
        setIsNetworkModalOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] flex justify-center">
      <div className="w-full max-w-[360px] flex flex-col items-center text-center pt-6 sm:pt-10">
        {/* Logo */}
        <img src={puplogo} alt="TBIDO Logo" className="h-12 sm:h-14 mb-4" />

        {/* Title */}
        <h1 className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight mb-1">
          <span className="text-[#6D0C22]">Status</span> to{" "}
          <span className="text-[#0E386B]">Dashboard</span>
        </h1>
        <p className="text-[11px] sm:text-sm text-gray-600 leading-snug mb-5">
          Easily track your access, attendance, and reservations as part of your incubatee journey.
        </p>
          {/* Co-Working */}
          <button
            onClick={() => handleSelect("coworking")}
            className={`mb-2 cursor-pointer w-full max-w-[333px] rounded-4xl overflow-hidden shadow-md hover:shadow-lg transition ${
              selected === "coworking"
                ? "border-3 border-[#0E386B]"
                : "border border-transparent"
            }`}
          >
            <img
              src={coWorking}
              alt="Access Co-Working Space"
              className="w-full h-auto rounded-2xl"
            />
          </button>

          {/*Info note for coworking selection */}
          {selected === "coworking" && (
            <div className="mb-4 max-w-[333px] w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded-md text-xs shadow-sm transition-opacity duration-300">
              <strong>Heads up!</strong> Please make sure you're connected to the <span className="font-semibold">TBIDO WiFi</span> before proceeding to access the co-working space.
            </div>
          )}

        {/* Venue */}
        <button
          onClick={() => handleSelect("venue")}
          className={`mb-5 cursor-pointer w-full max-w-[333px] rounded-4xl overflow-hidden shadow-md hover:shadow-lg transition ${
            selected === "venue"
              ? "border-3 border-[#6D0C22]"
              : "border border-transparent"
          }`}
        >
          <img
            src={venue}
            alt="Venue Reservation"
            className="w-full h-auto rounded-2xl"
          />
        </button>

        {/* Next Button */}
        <button
          disabled={!selected || loading}
          onClick={handleNext}
          className={`w-full cursor-pointer max-w-[333px] py-3 text-sm font-semibold rounded-lg transition ${
            selected
              ? "bg-gradient-to-r from-[#6D0C22] to-[#0E386B] text-white hover:opacity-90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading
            ? "Checking Network..."
            : selected
            ? "Next"
            : "Please Select an Option"}
        </button>

        {/* Powered By */}
        <div className="flex flex-col items-center justify-center mt-6 space-y-1">
          <p className="text-[10px] sm:text-[11px] text-gray-400">Powered By:</p>
          <div className="flex items-center space-x-3">
            <img src={cybernest} alt="Cybernest Solutions" className="h-11 sm:h-12" />
            <img src={flow} alt="Flow" className="h-4 sm:h-5" />
          </div>
        </div>
      </div>

      {/* ✅ Venue Error Modal */}
      <ErrorModal isOpen={isVenueModalOpen} onClose={() => setIsVenueModalOpen(false)} />

      {/* ✅ Wrong Network Modal */}
      <WrongNetworkModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
      />
    </div>
  );
}

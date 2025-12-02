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
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCoworking = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://tbidoflowapi.azurewebsites.net/check-network");

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
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-white font-[Montserrat] flex justify-center">
      <div className="w-full max-w-[360px] flex flex-col items-center text-center pt-6 sm:pt-10">

        {/* Logo */}
        <img src={puplogo} alt="TBIDO Logo" className="h-12 sm:h-14 mb-4" />

        {/* Title */}
        <h1 className="text-lg sm:text-lg font-extrabold text-gray-900 leading-tight mb-1">
          <span className="text-[#6D0C22]">Status</span>{" "}
          <span className="text-[#0E386B]">Dashboard</span>
        </h1>

        <p className="text-[11px] sm:text-sm text-gray-600 leading-snug mb-5">
          Easily track your access, attendance, and reservations as part of your incubatee journey.
        </p>

        {/* Co-Working Button - DIRECT ACTION */}
        <button
          onClick={handleCoworking}
          disabled={loading}
          className={`mb-2 cursor-pointer w-full max-w-[333px] rounded-4xl overflow-hidden 
            shadow-md hover:shadow-lg active:scale-[0.98] transition border-2 
            ${loading ? "opacity-50 cursor-not-allowed" : "border-transparent"}`}
        >
          <img
            src={coWorking}
            alt="Access Co-Working Space"
            className="w-full h-auto rounded-2xl"
          />
        </button>

        {/* Enhanced Interactive Announcement Box */}
        <div className="w-full max-w-[333px] mt-3 rounded-2xl bg-gradient-to-br from-gray-50 to-white 
                        shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
          
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-[#6D0C22] to-[#0E386B] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
              <h3 className="text-sm font-bold text-white tracking-wide">
                ANNOUNCEMENTS
              </h3>
            </div>
            <button 
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="text-white/80 hover:text-white hover:scale-110 transition-all"
              aria-label="Expand announcements"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"/>
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[140px] p-4 space-y-3 custom-scrollbar">
            
            {/* Priority Alert */}
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg hover:bg-red-100 transition-colors">
              <div className="flex items-start space-x-2">
                <span className="text-red-500 font-bold text-xs mt-0.5">⚠️</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-red-800 mb-1">Network Requirement</p>
                  <p className="text-[11px] text-red-700 leading-relaxed">
                    Must be connected to <span className="font-bold">TBIDO Wi-Fi</span> for co-working space access
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 text-xs mt-0.5">🕐</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-800 mb-1">Operating Hours</p>
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    <span className="font-bold">8:00 AM – 5:00 PM</span> daily<br/>
                    Maintenance: <span className="font-semibold">Fridays 4:30–5:00 PM</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Security Policy */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 text-xs mt-0.5">🆔</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-purple-800 mb-1">Security Policy</p>
                  <p className="text-[11px] text-purple-700 leading-relaxed">
                    Incubatee ID must be <span className="font-bold">visible at all times</span> within the facility
                  </p>
                </div>
              </div>
            </div>

            {/* Room Booking */}
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg hover:bg-green-100 transition-colors">
              <div className="flex items-start space-x-2">
                <span className="text-green-500 text-xs mt-0.5">📅</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-green-800 mb-1">Meeting Rooms</p>
                  <p className="text-[11px] text-green-700 leading-relaxed">
                    Reserve rooms in advance to secure your preferred time slot
                  </p>
                </div>
              </div>
            </div>

            {/* General Guidelines */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg hover:bg-amber-100 transition-colors">
              <div className="flex items-start space-x-2">
                <span className="text-amber-500 text-xs mt-0.5">📋</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-800 mb-1">Space Guidelines</p>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Keep workspace clean • Respect quiet zones • Report any facility issues immediately
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-4 py-2 text-center border-t border-gray-200">
            <p className="text-[10px] text-gray-500">
              Last updated: {currentDate}
            </p>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #6D0C22, #0E386B);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #8D0C22, #1E486B);
          }
        `}</style>

        {/* Powered By */}
        <div className="flex flex-col items-center justify-center mt-6 space-y-1">
          <p className="text-[10px] sm:text-[11px] text-gray-400">Powered By:</p>
          <div className="flex items-center space-x-3">
            <img src={cybernest} alt="Cybernest Solutions" className="h-11 sm:h-12" />
            <img src={flow} alt="Flow" className="h-4 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ErrorModal isOpen={isVenueModalOpen} onClose={() => setIsVenueModalOpen(false)} />
      <WrongNetworkModal isOpen={isNetworkModalOpen} onClose={() => setIsNetworkModalOpen(false)} />
      
      {/* Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#6D0C22] to-[#0E386B] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  ANNOUNCEMENTS
                </h2>
              </div>
              <button 
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="text-white/80 hover:text-white hover:rotate-90 transition-all duration-300"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6 space-y-4 custom-scrollbar">
              
              {/* Priority Alert */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl hover:bg-red-100 transition-colors">
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold text-lg mt-0.5">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-800 mb-2">Network Requirement</p>
                    <p className="text-sm text-red-700 leading-relaxed">
                      Must be connected to <span className="font-bold">TBIDO Wi-Fi</span> for co-working space access. Ensure your device is connected before attempting to check in.
                    </p>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl hover:bg-blue-100 transition-colors">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500 text-lg mt-0.5">🕐</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-blue-800 mb-2">Operating Hours</p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      <span className="font-bold">Monday - Friday: 8:00 AM – 5:00 PM</span><br/>
                      The co-working space is closed on weekends and holidays.<br/>
                      <span className="font-semibold">Weekly Maintenance: Fridays 4:30–5:00 PM</span><br/>
                      Limited access during maintenance periods.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Policy */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-xl hover:bg-purple-100 transition-colors">
                <div className="flex items-start space-x-3">
                  <span className="text-purple-500 text-lg mt-0.5">🆔</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-purple-800 mb-2">Security Policy</p>
                    <p className="text-sm text-purple-700 leading-relaxed">
                      Incubatee ID must be <span className="font-bold">visible at all times</span> within the facility. Security personnel reserve the right to verify your identity. Lost IDs should be reported immediately to the front desk.
                    </p>
                  </div>
                </div>
              </div>

              {/* Room Booking */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl hover:bg-green-100 transition-colors">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-lg mt-0.5">📅</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-green-800 mb-2">Meeting Room Reservations</p>
                    <p className="text-sm text-green-700 leading-relaxed">
                      Reserve meeting rooms in advance to secure your preferred time slot. Bookings can be made up to 2 weeks in advance. Walk-ins are subject to availability. Maximum booking duration is 3 hours per session.
                    </p>
                  </div>
                </div>
              </div>

              {/* General Guidelines */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl hover:bg-amber-100 transition-colors">
                <div className="flex items-start space-x-3">
                  <span className="text-amber-500 text-lg mt-0.5">📋</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-amber-800 mb-2">Space Guidelines</p>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      • Keep your workspace clean and organized<br/>
                      • Respect designated quiet zones<br/>
                      • No food or drinks near equipment<br/>
                      • Report any facility issues immediately to management<br/>
                      • Be mindful of noise levels during calls
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-xl hover:bg-indigo-100 transition-colors">
                <div className="flex items-start space-x-3">
                  <span className="text-indigo-500 text-lg mt-0.5">💡</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-indigo-800 mb-2">Need Help?</p>
                    <p className="text-sm text-indigo-700 leading-relaxed">
                      For technical support, facility inquiries, or booking assistance, please contact our front desk or email <span className="font-semibold">support@tbido.com</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 px-6 py-4 text-center border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Last updated: {currentDate}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
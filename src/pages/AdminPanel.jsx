import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // ==============================
  // AUTH GUARD
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) window.location.href = "/admin";
  }, []);

  // ==============================
  // PH TIME FORMATTER (FIXED)
  // ==============================
  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";

    // 1. Force UTC interpretation:
    const strictDateStr = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`;
    const dateObj = new Date(strictDateStr);

    // 2. Convert to Asia/Manila for display
    return dateObj.toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  // ==============================
  // FETCH ANALYTICS (DATE-BASED)
  // ==============================
  const fetchStats = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/analytics/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: startDate || null,
          end_date: endDate || null
        })
      });

      const data = await response.json();

      if (data.status === "success") {
        const logsArr = data.logs || [];
        const uniqueVisitors = new Set(logsArr.map((l) => l.email)).size;
        const breakdown = data.per_day_breakdown || {};

        const chartData = Object.entries(breakdown).map(([day, count]) => ({
          day,
          count: Number(count)
        }));

        // Calculate Peak Hour in PH Time (UTC + 8)
        let formattedPeakHour = "N/A";
        if (data.peak_hour !== null && data.peak_hour !== undefined) {
            const utcHour = Number(data.peak_hour);
            const phHourStart = (utcHour + 8) % 24; // Shift +8 hours, wrap around 24
            const phHourEnd = (phHourStart + 1) % 24;
            // Pad with leading zeros for nice formatting (e.g., 09:00 - 10:00)
            const startStr = phHourStart.toString().padStart(2, '0');
            const endStr = phHourEnd.toString().padStart(2, '0');
            formattedPeakHour = `${startStr}:00 – ${endStr}:00`;
        }

        setStats({
          total_logs: logsArr.length,
          unique_visitors: uniqueVisitors,
          peak_day: data.peak_day || "N/A",
          peak_hour: formattedPeakHour,
          chartData
        });

        setLogs(logsArr);
      } else {
        toast.warning("No data found for this range.");
        setLogs([]);
        setStats({
            total_logs: 0,
            unique_visitors: 0,
            peak_day: "N/A",
            peak_hour: "N/A",
            chartData: []
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch analytics.");
    }

    setLoading(false);
  };

  // ==============================
  // ANNOUNCEMENTS FUNCTIONS
  // ==============================
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements/all`);
      const data = await res.json();

      if (data.status === "success") {
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load announcements");
    }
  };

  const saveAnnouncement = async () => {
    if (!newTitle || !newBody) {
      return toast.warning("Title and body are required.");
    }

    try {
      const res = await fetch(`${API_BASE}/announcements/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          message: newBody,
          author: "Admin"
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Announcement added!");
        setShowAddModal(false);
        setNewTitle("");
        setNewBody("");
        fetchAnnouncements();
      } else {
        toast.error(data.message || "Failed to save.");
      }
    } catch (error) {
      toast.error("Server error.");
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      const res = await fetch(`${API_BASE}/announcements/delete/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Announcement deleted.");
        fetchAnnouncements();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Server error.");
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchStats();
    fetchAnnouncements(); // Load announcements on mount
  }, []);

  // ==============================
  // SEND EMAIL REPORT
  // ==============================
  const sendEmailReport = async () => {
    if (!startDate || !endDate) {
      toast.warning("Please select start and end dates first.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/reports/send-range`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Attendance report emailed successfully.");
      } else {
        toast.error(data.message || "Failed to send report.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while sending report.");
    }

    setSending(false);
  };

  // ==============================
  // LOADING STATE
  // ==============================
  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-[Montserrat]">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* FILTERS */}
      <div className="bg-white p-4 shadow mx-4 mt-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold">Start Date</label>
            <input
              type="date"
              className="mt-1 w-full p-2 border rounded-lg"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">End Date</label>
            <input
              type="date"
              className="mt-1 w-full p-2 border rounded-lg"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button
            onClick={fetchStats}
            className="bg-[#0E386B] text-white font-semibold mt-6 py-2 rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4">
        <StatCard label="Total Logs" value={stats.total_logs} />
        <StatCard label="Unique Visitors" value={stats.unique_visitors} />
        <StatCard label="Peak Day" value={stats.peak_day} />
        <StatCard label="Peak Hour (PH Time)" value={stats.peak_hour} />
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow mx-4 my-4">
        <h2 className="font-bold text-lg mb-3">Daily Visitor Count</h2>

        {stats.chartData.length === 0 ? (
          <p className="text-center text-gray-500">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.chartData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6D0C22" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ATTENDANCE LOGS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow mx-4 my-4">
        <h2 className="font-bold text-lg mb-3">Attendance Logs</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Office</th>
                <th className="p-2 border">Position</th>
                <th className="p-2 border">Time In (PH)</th>
                <th className="p-2 border">Time Out (PH)</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              )}

              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="p-2 border">{log.email}</td>
                  <td className="p-2 border">{log.name}</td>
                  <td className="p-2 border">{log.office}</td>
                  <td className="p-2 border">{log.position}</td>
                  <td className="p-2 border">{formatTime(log.timein)}</td>
                  <td className="p-2 border">{formatTime(log.timeout)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ANNOUNCEMENTS SECTION */}
      <div className="bg-white p-6 rounded-xl shadow mx-4 my-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Announcements</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#6D0C22] text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            + Add Announcement
          </button>
        </div>

        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements available.</p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((a) => (
              <li
                key={a._id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">{a.title}</h3>
                  <p className="text-gray-600 text-sm">{a.message}</p>
                  <span className="text-xs text-gray-400">
                    Posted: {new Date(a.created_at).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => deleteAnnouncement(a._id)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* EMAIL EXPORT BUTTON */}
      <div className="p-4 mx-4 mb-10">
        <button
          onClick={sendEmailReport}
          disabled={sending}
          className={`w-full py-3 text-white font-semibold rounded-lg ${
            sending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#6D0C22] to-[#0E386B]"
          }`}
        >
          {sending ? "Sending Report..." : "Email Attendance Report"}
        </button>
      </div>

      {/* ADD ANNOUNCEMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="font-bold text-lg mb-4">Create Announcement</h2>

            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-3"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <textarea
              className="w-full p-2 border rounded-lg mb-3"
              placeholder="Write announcement..."
              rows={4}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={saveAnnouncement}
                className="px-4 py-2 rounded-lg bg-[#6D0C22] text-white hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================
// STAT CARD COMPONENT
// ==============================
function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
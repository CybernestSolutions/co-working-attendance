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

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // ==============================
  // AUTH GUARD
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/admin";
    }
  }, []);

  // ==============================
  // PH TIME FORMATTER (DISPLAY ONLY)
  // ==============================
  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";

    return new Date(dateStr).toLocaleString("en-PH", {
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
  // FETCH ANALYTICS (DATE-ONLY)
  // ==============================
  const fetchStats = async () => {
    setLoading(true);

    const payload = {
      start_date: startDate || null,
      end_date: endDate || null
    };

    try {
      const response = await fetch(`${API_BASE}/analytics/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.status === "success") {
        const logsArr = data.logs || [];

        const uniqueVisitors = new Set(
          logsArr.map((l) => l.email)
        ).size;

        const breakdown = data.per_day_breakdown || {};
        const chartData = Object.entries(breakdown).map(
          ([day, count]) => ({
            day,
            count: Number(count)
          })
        );

        setStats({
          total_logs: logsArr.length,
          unique_visitors: uniqueVisitors,
          peak_day: data.peak_day || "No Data",
          peak_hour:
            data.peak_hour !== null
              ? `${data.peak_hour}:00 – ${data.peak_hour + 1}:00`
              : "N/A",
          chartData
        });

        setLogs(logsArr);
      } else {
        toast.warning("No data found for this range.");
        setLogs([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ==============================
  // SEND EMAIL REPORT
  // ==============================
  const sendEmailReport = async () => {
    if (!startDate || !endDate) {
      toast.warning("Please select start and end dates first.");
      return;
    }

    const startMonth = startDate.slice(0, 7); // YYYY-MM
    const endMonth = endDate.slice(0, 7);     // YYYY-MM

    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/reports/send-range`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_month: startMonth,
          end_month: endMonth
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Attendance report emailed successfully.");
      } else {
        toast.error(data.message || "Failed to send report.");
      }
    } catch (error) {
      console.error(error);
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

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4">
        <StatCard label="Total Logs" value={stats.total_logs} />
        <StatCard label="Unique Visitors" value={stats.unique_visitors} />
        <StatCard label="Peak Day" value={stats.peak_day} />
        <StatCard label="Peak Hour" value={stats.peak_hour} />
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

      {/* ATTENDANCE TABLE */}
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
                <th className="p-2 border">Time In</th>
                <th className="p-2 border">Time Out</th>
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

      {/* EMAIL REPORT */}
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
          {sending ? "Sending Report..." : "Email Monthly Attendance Report"}
        </button>
      </div>
    </div>
  );
}

// ==============================
// SMALL STAT CARD
// ==============================
function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

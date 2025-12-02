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

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL; // ✅ Use .env backend URL

  // AUTH GUARD
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/admin";
    }
  }, []);

  // ==============================
  // FETCH STATS + LOGS
  // ==============================
  const fetchStats = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/analytics/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          start_date: startDate || null,
          end_date: endDate || null
        })
      });

      const data = await response.json();

      if (data.status === "success") {
        const logsArr = data.logs || [];

        // Count unique emails
        const unique = new Set(logsArr.map((l) => l.email)).size;

        // BUILD CHART
        const breakdown = data.per_day_breakdown || {};

        const chartData = Object.entries(breakdown).map(([day, count]) => {
          const parsed = new Date(day);
          return {
            day: !isNaN(parsed)
              ? parsed.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })
              : day,
            count: Number(count)
          };
        });

        setStats({
          total_logs: logsArr.length,
          unique_visitors: unique,
          peak_day: data.peak_day || "No Data",
          peak_hour: data.peak_hour !== null ? data.peak_hour : "N/A",
          chartData
        });

        setLogs(logsArr);
      } else {
        toast.error("No data found for this range.");
      }
    } catch (error) {
      console.error("Frontend Error →", error);
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    fetchAnnouncements();
  }, []);

  // ==============================
  // EMAIL REPORT
  // ==============================
  const sendReport = async () => {
    if (!startDate || !endDate) {
      return toast.warning("Please select both start and end dates.");
    }

    try {
      const res = await fetch(`${API_BASE}/reports/send-range`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_month: startDate.slice(0, 7),
          end_month: endDate.slice(0, 7)
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Attendance Report Emailed!");
      } else {
        toast.error(data.message || "Failed to send report.");
      }
    } catch (error) {
      toast.error("Server error.");
    }
  };

  // ==============================
  // ANNOUNCEMENTS API
  // ==============================
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements/all`);
      const data = await res.json();

      if (data.status === "success") {
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
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

  // ==============================
  // LOADING SCREEN
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

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#6D0C22] to-[#0E386B] text-white p-6 shadow-lg">
        <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
        <p className="text-sm opacity-80">TBIDO Co-working Analytics</p>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 shadow mx-4 mt-4 rounded-lg">
        <h2 className="font-bold text-lg mb-2">Filters</h2>

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
            className="bg-[#0E386B] text-white font-semibold mt-6 py-2 rounded-lg hover:opacity-90"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4">
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-[#6D0C22]">
          <h3 className="text-sm text-gray-500">Total Logs</h3>
          <p className="text-2xl font-bold">{stats.total_logs}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-[#0E386B]">
          <h3 className="text-sm text-gray-500">Unique Visitors</h3>
          <p className="text-2xl font-bold">{stats.unique_visitors}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-[#6D0C22]">
          <h3 className="text-sm text-gray-500">Peak Day</h3>
          <p className="text-lg font-semibold">{stats.peak_day}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-[#0E386B]">
          <h3 className="text-sm text-gray-500">Peak Hour</h3>
          <p className="text-lg font-semibold">{stats.peak_hour}:00</p>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow mx-4 my-4">
        <h2 className="font-bold text-lg mb-3">Daily Visitor Count</h2>

        {stats.chartData.length === 0 ? (
          <p className="text-center text-gray-500">No visitor data found.</p>
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

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow mx-4 my-4">
        <h2 className="font-bold text-lg mb-3">Attendance Logs</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Time In</th>
                <th className="p-2 border">Time Out</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 border">{log.email}</td>
                  <td className="p-2 border">{log.name}</td>
                  <td className="p-2 border">{log.timein}</td>
                  <td className="p-2 border">{log.timeout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ANNOUNCEMENTS */}
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

      {/* EMAIL RANGE REPORT */}
      <div className="p-4 mx-4 mb-10">
        <button
          onClick={sendReport}
          className="w-full py-3 bg-gradient-to-r from-[#6D0C22] to-[#0E386B] text-white font-semibold rounded-lg hover:opacity-90"
        >
          Email Monthly Attendance Report
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

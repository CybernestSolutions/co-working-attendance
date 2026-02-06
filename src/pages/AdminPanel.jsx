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
  // SIMPLE TIME FORMATTER
  // (backend already sends correct time)
  // ==============================
  const formatTime = (dateStr) => {
    if (!dateStr) return "-";

    return new Date(dateStr).toLocaleString("en-PH", {
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
  // FETCH STATS + LOGS
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

        const uniqueVisitors = new Set(
          logsArr.map((l) => l.email)
        ).size;

        const breakdown = data.per_day_breakdown || {};

        const chartData = Object.entries(breakdown).map(([day, count]) => ({
          day,
          count: Number(count)
        }));

        setStats({
          total_logs: logsArr.length,
          unique_visitors: uniqueVisitors,
          peak_day: data.peak_day || "No Data",
          peak_hour:
            data.peak_hour !== null ? `${data.peak_hour}:00` : "N/A",
          chartData
        });

        setLogs(logsArr);
      } else {
        toast.error("No data found for this range.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    fetchAnnouncements();
  }, []);

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
    } catch {
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
    } catch {
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
    } catch {
      toast.error("Server error.");
    }
  };

  // ==============================
  // LOADING
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
              {logs.map((log, index) => (
                <tr key={index}>
                  <td className="p-2 border">{log.email}</td>
                  <td className="p-2 border">{log.name}</td>
                  <td className="p-2 border">{log.office}</td>
                  <td className="p-2 border">{log.position}</td>
                  <td className="p-2 border">
                    {formatTime(log.timein)}
                  </td>
                  <td className="p-2 border">
                    {formatTime(log.timeout)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EMAIL REPORT BUTTON */}
      <div className="p-4 mx-4 mb-10">
        <button
          className="w-full py-3 bg-gradient-to-r from-[#6D0C22] to-[#0E386B] text-white font-semibold rounded-lg"
        >
          Email Monthly Attendance Report
        </button>
      </div>
    </div>
  );
}

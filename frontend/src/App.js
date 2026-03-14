import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import PaymentPage from "./pages/PaymentPage";
import AdminPayments from "./pages/AdminPayments";
import GenerateQRPage from "./pages/GenerateQRPage";
import ScanAttendancePage from "./pages/ScanAttendancePage";
import AttendanceReport from "./pages/AttendanceReport";
import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="topbar">
          <h1>Finance & Attendance Management</h1>
          <p>University LMS Module</p>
        </header>

        <nav className="navbar">
          <Link to="/payment">Payment</Link>
          <Link to="/admin-payments">Admin Payments</Link>
          <Link to="/generate-qr">Generate QR</Link>
          <Link to="/scan-attendance">Scan Attendance</Link>
          <Link to="/attendance-report">Attendance Report</Link>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/payment" />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/admin-payments" element={<AdminPayments />} />
            <Route path="/generate-qr" element={<GenerateQRPage />} />
            <Route path="/scan-attendance" element={<ScanAttendancePage />} />
            <Route path="/attendance-report" element={<AttendanceReport />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
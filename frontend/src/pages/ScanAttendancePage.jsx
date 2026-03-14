import React, { useState } from "react";
import api from "../services/api";
import { QrReader } from "react-qr-reader";

export default function ScanAttendancePage() {
  const [studentId, setStudentId] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleScanResult = (result) => {
    if (result) {
      setToken(result?.text);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!/^IT\d{4,}$/.test(studentId)) {
      setMessage("Student ID must be like IT2023001");
      return;
    }

    if (!token) {
      setMessage("Please scan the QR code first");
      return;
    }

    try {
      const res = await api.post("/attendance/scan", {
        studentId,
        token,
      });

      setMessage(res.data.message || "Attendance marked successfully");

      setStudentId("");
      setToken("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Attendance failed");
    }
  };

  return (
    <div className="page-card">
      <h2>Student Attendance Scan</h2>

      {/* QR SCANNER */}
      <div style={{ width: "300px", margin: "20px auto" }}>
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (!!result) {
              handleScanResult(result);
            }

            if (!!error) {
              handleError(error);
            }
          }}
          style={{ width: "100%" }}
        />
      </div>

      <form onSubmit={handleScan} className="form-grid">
        <div>
          <label>Student ID</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter student ID"
            required
          />
        </div>

        <div>
          <label>QR Token (Auto Filled)</label>
          <input
            type="text"
            value={token}
            readOnly
            placeholder="Scan QR code"
          />
        </div>

        <button type="submit" className="btn-primary">
          Mark Attendance
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
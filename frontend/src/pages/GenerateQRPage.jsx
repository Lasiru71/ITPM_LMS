import React, { useEffect, useState } from "react";
import api from "../services/api";
import { QRCodeCanvas } from "qrcode.react";

export default function GenerateQRPage() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const [studentId, setStudentId] = useState("");
  const [scanMessage, setScanMessage] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load courses");
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setMessage("");
    setResult(null);
    setScanMessage("");

    if (!/^LEC\d{3,}$/.test(lecturerId)) {
      setMessage("Lecturer ID must be like LEC001");
      return;
    }

    if (!courseId) {
      setMessage("Please select a course");
      return;
    }

    try {
      const res = await api.post("/attendance/generate-qr", {
        courseId,
        lecturerId,
      });

      setResult(res.data);
      setMessage("QR session generated successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "QR generation failed");
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setScanMessage("");

    if (!/^IT\d{4,}$/.test(studentId)) {
      setScanMessage("Student ID must be like IT2023001");
      return;
    }

    const token = result?.qrToken || result?.token;

    if (!token) {
      setScanMessage("Please generate QR session first");
      return;
    }

    try {
      const res = await api.post("/attendance/scan", {
        studentId,
        token,
      });

      setScanMessage(res.data.message || "Attendance marked successfully");
      setStudentId("");
    } catch (error) {
      setScanMessage(error.response?.data?.message || "Attendance marking failed");
    }
  };

  const qrValue = result?.qrToken || result?.token || "";

  return (
    <div className="page-card">
      <h2>Lecturer QR Generation & Attendance</h2>

      <form onSubmit={handleGenerate} className="form-grid">
        <div>
          <label>Lecturer ID</label>
          <input
            type="text"
            value={lecturerId}
            onChange={(e) => setLecturerId(e.target.value)}
            placeholder="Enter lecturer ID"
            required
          />
        </div>

        <div>
          <label>Select Course</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary">
          Generate QR Session
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      {result && (
        <div
          className="info-box"
          style={{
            marginTop: "20px",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h3>Generated QR Code</h3>

          <div style={{ margin: "20px 0" }}>
            <QRCodeCanvas value={qrValue} size={220} />
          </div>

          <p>
            <strong>QR Token:</strong> {qrValue}
          </p>
          <p>
            <strong>Valid Until:</strong> {result.validUntil}
          </p>
          <p>
            <strong>Message:</strong> {result.message}
          </p>
        </div>
      )}

      <div
        className="info-box"
        style={{
          marginTop: "30px",
          padding: "25px",
        }}
      >
        {/* <h3>Mark Attendance</h3>

        <form onSubmit={handleMarkAttendance} className="form-grid">
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

          <button type="submit" className="btn-primary">
            Mark Attendance
          </button>
        </form> */}

        {scanMessage && (
          <p className="message" style={{ marginTop: "15px" }}>
            {scanMessage}
          </p>
        )}
      </div>
    </div>
  );
}
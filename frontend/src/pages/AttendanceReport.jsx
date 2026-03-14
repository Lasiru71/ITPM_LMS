import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AttendanceReport() {
  const [studentId, setStudentId] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");

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

  const handleCheck = async (e) => {
    e.preventDefault();
    setMessage("");
    setReport(null);

    try {
      const res = await api.get(`/attendance/monthly/${studentId}/${courseId}`);
      setReport(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch report");
    }
  };

  return (
    <div className="page-card">
      <h2>Attendance Report</h2>

      <form onSubmit={handleCheck} className="form-grid">
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
          <label>Select Course</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary">Check Attendance</button>
      </form>

      {message && <p className="message">{message}</p>}

      {report && (
        <div className="info-box">
          <p><strong>Total Sessions:</strong> {report.totalSessions}</p>
          <p><strong>Attended Sessions:</strong> {report.attendedSessions}</p>
          <p><strong>Percentage:</strong> {report.percentage}%</p>
          <p><strong>Warning:</strong> {String(report.warning)}</p>
        </div>
      )}
    </div>
  );
}
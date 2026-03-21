import React, { useEffect, useMemo, useState } from "react";
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
      setScanMessage(
        error.response?.data?.message || "Attendance marking failed"
      );
    }
  };

  const qrValue = result?.qrToken || result?.token || "";

  const selectedCourse = useMemo(() => {
    return courses.find((course) => course._id === courseId);
  }, [courses, courseId]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-lg shadow-sm">
            <span className="text-white text-lg">▣</span>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            QR Attend
          </span>
        </div>
        <p className="text-sm text-slate-500 hidden sm:block">
          Lecturer Dashboard
        </p>
      </header>

      <main className="px-4 sm:px-8 py-6">
  <div className="w-full">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Lecturer QR Generation & Attendance
            </h1>
            <p className="text-slate-500 mt-1">
              Generate secure QR sessions and manage student attendance quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <span className="text-indigo-600 text-lg">⌁</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Session
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {result ? 1 : 0}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="text-emerald-600 text-lg">◉</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Selected Course
                </p>
                <p className="text-base font-bold text-slate-900 truncate max-w-[180px] sm:max-w-none">
                  {selectedCourse?.title || "Not selected"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <span className="text-blue-600 text-lg">◷</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Session Status
                </p>
                <p className="text-base font-bold text-slate-900">
                  {result ? "Live" : "Idle"}
                </p>
              </div>
            </div>
          </div>

          {(message || scanMessage) && (
            <div className="space-y-3 mb-6">
              {message && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                    message.toLowerCase().includes("success")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : message.toLowerCase().includes("failed") ||
                        message.toLowerCase().includes("must") ||
                        message.toLowerCase().includes("please")
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-indigo-200 bg-indigo-50 text-indigo-700"
                  }`}
                >
                  {message}
                </div>
              )}

              {scanMessage && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                    scanMessage.toLowerCase().includes("success")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : scanMessage.toLowerCase().includes("failed") ||
                        scanMessage.toLowerCase().includes("must") ||
                        scanMessage.toLowerCase().includes("please")
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-indigo-200 bg-indigo-50 text-indigo-700"
                  }`}
                >
                  {scanMessage}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <form
                onSubmit={handleGenerate}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Lecturer ID
                  </label>
                  <input
                    type="text"
                    value={lecturerId}
                    onChange={(e) => setLecturerId(e.target.value)}
                    placeholder="Enter lecturer ID"
                    required
                    className="block w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Select Course
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                    className={`block w-full px-4 py-2.5 rounded-lg border outline-none transition-colors appearance-none bg-white ${
                      !courseId
                        ? "border-slate-300 text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        : "border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  >
                    <option value="">-- Select Course --</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
                >
                  Generate QR Session
                </button>
              </form>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-base font-semibold text-slate-900">
                    Quick Session Details
                  </h3>
                </div>

                <div className="p-6 space-y-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Lecturer ID</span>
                    <span className="font-medium text-slate-900">
                      {lecturerId || "Not entered"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Course</span>
                    <span className="font-medium text-slate-900 text-right">
                      {selectedCourse?.title || "Not selected"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Token</span>
                    <span className="font-mono text-slate-900 text-right break-all">
                      {qrValue || "Not generated"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Valid Until</span>
                    <span className="font-medium text-slate-900 text-right">
                      {result?.validUntil || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="w-full min-h-[420px] flex flex-col items-center justify-center p-8 border border-slate-200 bg-slate-50/50 rounded-xl shadow-sm relative overflow-hidden">
                {!result ? (
                  <div className="flex flex-col items-center text-slate-400">
                    <div className="w-56 h-56 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center mb-4 bg-white/50">
                      <span className="text-sm font-medium">
                        No Active Session
                      </span>
                    </div>
                    <p className="text-sm text-center max-w-[240px]">
                      Generate a QR session to display the attendance code here.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full max-w-sm">
                    <div className="w-full flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-100">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                        </span>
                        <span>Live Session</span>
                      </div>

                      <div className="text-slate-600 font-mono text-sm bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        QR Ready
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full aspect-square mb-6 flex items-center justify-center">
                      <QRCodeCanvas value={qrValue} size={220} />
                    </div>

                    <div className="text-center w-full">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate px-4">
                        {selectedCourse?.title || "Selected Course"}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        Scan to record attendance
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-base font-semibold text-slate-900">
                    Generated Session Info
                  </h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    Current
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-500">QR Token</span>
                    <span className="font-mono text-slate-900 text-right break-all">
                      {qrValue || "Not generated"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-500">Valid Until</span>
                    <span className="font-medium text-slate-900 text-right">
                      {result?.validUntil || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-500">Response Message</span>
                    <span className="font-medium text-slate-900 text-right">
                      {result?.message || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

   
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
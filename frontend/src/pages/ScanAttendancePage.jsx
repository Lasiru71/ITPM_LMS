import React, { useMemo, useState } from "react";
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

  const currentTime = useMemo(() => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-hidden p-4 sm:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[100px] mix-blend-multiply pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-400/20 blur-[100px] mix-blend-multiply pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-500/10 rounded-[2rem] p-6 md:p-8 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Student Attendance Scan
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-slate-500">
                  Scanner Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-slate-600 bg-slate-100/60 py-2 px-4 rounded-full border border-slate-200/60 w-fit">
              <div>{currentTime}</div>
              <div className="w-px h-4 bg-slate-300" />
              <div>
                Token Status:{" "}
                <span className="font-bold text-indigo-600">
                  {token ? "Detected" : "Waiting"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="relative w-full h-[320px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner mb-6 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute inset-6 sm:inset-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-400 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-indigo-400 rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-indigo-400 rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-indigo-400 rounded-br-2xl" />
                </div>

                <div className="absolute top-6 left-8 right-8 h-0.5 bg-indigo-400 shadow-[0_0_15px_3px_rgba(99,102,241,0.6)] animate-pulse z-10" />

                <div className="absolute inset-0 p-4">
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
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>

              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Scan Details
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Student ID</span>
                    <span className="font-medium text-slate-900">
                      {studentId || "Not entered"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">QR Token</span>
                    <span className="font-mono text-slate-900 text-right break-all">
                      {token || "Not scanned yet"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Scanner</span>
                    <span className="font-medium text-emerald-600">Ready</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleScan} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter student ID"
                    required
                    className="block w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    QR Token <span className="text-slate-400 font-normal">(Auto Filled)</span>
                  </label>
                  <input
                    type="text"
                    value={token}
                    readOnly
                    placeholder="Scan QR code"
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 shadow-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
                >
                  Mark Attendance
                </button>
              </form>

              {message && (
                <div
                  className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                    message.toLowerCase().includes("success")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Scanner Status
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Camera Input
                      </p>
                      <p className="text-xs text-slate-500">
                        Live QR scanning enabled
                      </p>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Detected Token
                      </p>
                      <p className="text-xs text-slate-500">
                        Waiting for QR scan result
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                        token
                          ? "text-indigo-600 bg-indigo-50 border-indigo-100"
                          : "text-slate-500 bg-white border-slate-200"
                      }`}
                    >
                      {token ? "Captured" : "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Attendance Submission
                      </p>
                      <p className="text-xs text-slate-500">
                        Submit after scanning and entering student ID
                      </p>
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
              Quick Tips
            </h3>

            <ul className="grid md:grid-cols-3 gap-3">
              <li className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-sm text-slate-600">
                Keep the QR code inside the scanner frame.
              </li>
              <li className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-sm text-slate-600">
                Enter a valid student ID before marking attendance.
              </li>
              <li className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-sm text-slate-600">
                Scan must complete before submitting attendance.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
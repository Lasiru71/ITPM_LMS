import React, { useEffect, useMemo, useState } from "react";
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

  const selectedCourse = useMemo(() => {
    return courses.find((course) => course._id === courseId);
  }, [courses, courseId]);

  const percentage = Number(report?.percentage || 0);
  const totalSessions = Number(report?.totalSessions || 0);
  const attendedSessions = Number(report?.attendedSessions || 0);
  const absentSessions = Math.max(totalSessions - attendedSessions, 0);

  const statusConfig = useMemo(() => {
    if (!report) {
      return {
        label: "No Report",
        badge: "bg-slate-100 text-slate-600 border-slate-200",
        progress: "from-slate-400 to-slate-500",
      };
    }

    if (report.warning === true) {
      return {
        label: "Warning",
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        progress: "from-rose-500 to-red-500",
      };
    }

    if (percentage >= 80) {
      return {
        label: "Excellent",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        progress: "from-emerald-500 to-green-500",
      };
    }

    return {
      label: "Average",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      progress: "from-amber-400 to-orange-500",
    };
  }, [report, percentage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Student Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Attendance Report
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Check total sessions, attended classes, attendance percentage, and
            warning status for a selected course.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Search Attendance
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your student ID and choose a course to view the monthly
                report.
              </p>

              <form onSubmit={handleCheck} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter student ID"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select Course
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700"
                >
                  Check Attendance
                </button>
              </form>

              {message && (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700">
                  {message}
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                  Current Selection
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">Student ID</span>
                    <span className="font-medium text-slate-900">
                      {studentId || "Not entered"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">Course</span>
                    <span className="text-right font-medium text-slate-900">
                      {selectedCourse?.title || "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">Status</span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.badge}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {!report ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 text-4xl shadow-inner">
                    📊
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    No Report Yet
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    Submit your student ID and selected course to see attendance
                    details and summary.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Report Summary
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedCourse?.title || "Selected Course"}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusConfig.badge}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
                      <p className="text-sm font-medium text-blue-700">
                        Total Sessions
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {report.totalSessions}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                      <p className="text-sm font-medium text-emerald-700">
                        Attended Sessions
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {report.attendedSessions}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
                      <p className="text-sm font-medium text-amber-700">
                        Percentage
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {report.percentage}%
                      </p>
                    </div>

                    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 shadow-sm">
                      <p className="text-sm font-medium text-rose-700">
                        Warning
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {report.warning ? "LOW" : "OK"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-slate-900">
                          Attendance Progress
                        </h3>
                        <span className="text-sm font-semibold text-slate-600">
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${statusConfig.progress}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>

                      <div className="mt-6 space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-slate-500">Attended</span>
                            <span className="font-medium text-slate-900">
                              {attendedSessions} / {totalSessions}
                            </span>
                          </div>
                          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
                              style={{
                                width: `${
                                  totalSessions
                                    ? (attendedSessions / totalSessions) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-slate-500">Absent</span>
                            <span className="font-medium text-slate-900">
                              {absentSessions} / {totalSessions}
                            </span>
                          </div>
                          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-500"
                              style={{
                                width: `${
                                  totalSessions
                                    ? (absentSessions / totalSessions) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <h3 className="text-base font-semibold text-slate-900">
                        Detailed Breakdown
                      </h3>

                      <div className="mt-5 space-y-4">
                        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm">
                          <span className="text-sm text-slate-500">
                            Total Sessions
                          </span>
                          <span className="text-base font-semibold text-slate-900">
                            {report.totalSessions}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm">
                          <span className="text-sm text-slate-500">
                            Attended Sessions
                          </span>
                          <span className="text-base font-semibold text-slate-900">
                            {report.attendedSessions}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm">
                          <span className="text-sm text-slate-500">
                            Percentage
                          </span>
                          <span className="text-base font-semibold text-slate-900">
                            {report.percentage}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm">
                          <span className="text-sm text-slate-500">
                            Warning
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                               report.warning
                                ? "bg-rose-100 text-rose-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {report.warning ? "LOW" : "OK"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
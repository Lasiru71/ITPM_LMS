import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments");
      setPayments(res.data);
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("Failed to load payments");
    }
  };

  const approvePayment = async (id) => {
    try {
      await api.put(`/payments/approve/${id}`);
      setMessageType("success");
      setMessage("Payment approved");
      fetchPayments();
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Approve failed");
    }
  };

  const rejectPayment = async (id) => {
    const remark = window.prompt("Enter reason for rejection (optional):");
    try {
      await api.put(`/payments/reject/${id}`, { adminRemark: remark });
      setMessageType("error");
      setMessage("Payment rejected");
      fetchPayments();
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Reject failed");
    }
  };

  const deletePayment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/payments/${id}`);
      setMessageType("success");
      setMessage("Payment deleted successfully");
      fetchPayments();
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const student = payment.studentId?.toLowerCase() || "";
      const course = payment.course?.title?.toLowerCase() || "";
      const method = payment.method?.toLowerCase() || "";
      const status = payment.status || "";

      const matchesSearch =
        student.includes(searchTerm.toLowerCase()) ||
        course.includes(searchTerm.toLowerCase()) ||
        method.includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = useMemo(() => {
    const totalRevenue = payments.reduce(
  (sum, payment) =>
    sum + Number(payment.amount || payment.course?.price || payment.course?.fee || 0),
  0
);
    const approved = payments.filter((p) => p.status === "APPROVED").length;
    const pending = payments.filter((p) => p.status === "PENDING").length;
    const rejected = payments.filter((p) => p.status === "REJECTED").length;

    return { totalRevenue, approved, pending, rejected };
  }, [payments]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const getMethodLabel = (method) => {
    return method === "BANK_TRANSFER" ? "Bank Transfer" : "Card";
  };

  const handleRowClick = (payment, e) => {
    if (e.target.closest(".action-buttons")) return;
    setSelectedPayment(payment);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 min-h-screen fixed left-0 top-0 bottom-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-indigo-500/20 p-1.5 rounded-lg border border-indigo-500/30">
              <div className="w-5 h-5 rounded-md bg-indigo-400" />
            </div>
            <span className="font-semibold tracking-tight text-lg">
              EduAdmin
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Management
          </p>

          <a
            href="#"
            className="group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Dashboard
          </a>

          <a
            href="#"
            className="group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-white bg-slate-800 transition-colors"
          >
            <span className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full" />
            Payments
          </a>

          <a
            href="#"
            className="group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Students
          </a>

          <a
            href="#"
            className="group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Courses
          </a>

          <a
            href="#"
            className="group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Settings
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-slate-400 truncate">
                admin@eduadmin.com
              </p>
            </div>
          </div>
        </div>
      </aside> */}

      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
          <div className="hidden sm:flex items-center text-sm text-slate-500">
            <span className="hover:text-slate-900 cursor-pointer transition-colors">
              Dashboard
            </span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-medium text-slate-900">
              Payment Management
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-4 pr-4 py-2 bg-slate-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all w-64 outline-none"
              />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              🔔
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Payment Management
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Review payment details, verify bank slips, and approve or reject
              submissions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-indigo-500 p-5 flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                  $ {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                💳
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500 p-5 flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Approved Payments
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.approved}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                ✅
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500 p-5 flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Pending Verification
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                ⏳
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-rose-500 p-5 flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Rejected Submissions
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.rejected}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
                ❌
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
                messageType === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Search by Student ID, Course or Method..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-4 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm rounded-lg bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-slate-200">
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map((payment) => (
                      <tr
                        key={payment._id}
                        onClick={(e) => handleRowClick(payment, e)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-indigo-600">
                          {payment.studentId}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {payment.course?.title || "N/A"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">
                        $ {Number(payment.amount || payment.course?.price || payment.course?.fee || 0).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {getMethodLabel(payment.method)}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">
                          {payment.method === "BANK_TRANSFER" ? (
                            payment.slipImage ? (
                              <a
                                href={`${payment.slipImage}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                              >
                                View Slip
                              </a>
                            ) : (
                              <span className="text-slate-400 italic text-xs">
                                No Slip
                              </span>
                            )
                          ) : (
                            <div className="flex flex-col text-xs leading-5">
                              <span>
                                Name:{" "}
                                <span className="text-slate-900">
                                  {payment.cardDetails?.cardName || "N/A"}
                                </span>
                              </span>
                              <span>
                                Card:{" "}
                                <span className="text-slate-900 font-mono">
                                  {payment.cardDetails?.cardLast4
                                    ? `**** ${payment.cardDetails.cardLast4}`
                                    : "N/A"}
                                </span>
                              </span>
                              <span>
                                Expiry:{" "}
                                <span className="text-slate-900 font-mono">
                                  {payment.cardDetails?.expiry || "N/A"}
                                </span>
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                              payment.status
                            )}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
                            {payment.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium action-buttons">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            {payment.status !== "APPROVED" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  approvePayment(payment._id);
                                }}
                                className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                              >
                                Approve
                              </button>
                            )}

                            {payment.status !== "REJECTED" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  rejectPayment(payment._id);
                                }}
                                className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                              >
                                Reject
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePayment(payment._id);
                              }}
                              className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm font-medium text-slate-900">
                            No payments found
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            Try adjusting your search or filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 0 && (
              <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * itemsPerPage,
                          filteredPayments.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredPayments.length}
                      </span>{" "}
                      results
                    </p>
                  </div>

                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Prev
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                              : "bg-white border-slate-300 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPayment(null)}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Payment Details
                </h2>
                <p className="text-sm text-slate-500 font-mono mt-0.5">
                  {selectedPayment._id}
                </p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Amount
                  </p>
                  <p className="text-3xl font-bold text-slate-900 font-mono">
                    $ {Number(selectedPayment.amount || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500 mb-2">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                      selectedPayment.status
                    )}`}
                  >
                    {selectedPayment.status}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1.5">
                      Student ID
                    </div>
                    <p className="text-slate-900 font-mono font-medium">
                      {selectedPayment.studentId}
                    </p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1.5">
                      Course
                    </div>
                    <p className="text-slate-900 font-medium">
                      {selectedPayment.course?.title || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1.5">
                      Method
                    </div>
                    <p className="text-slate-900 font-medium">
                      {getMethodLabel(selectedPayment.method)}
                    </p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1.5">
                      Status
                    </div>
                    <p className="text-slate-900 font-medium">
                      {selectedPayment.status}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">
                    Payment Proof Details
                  </h3>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    {selectedPayment.method === "BANK_TRANSFER" ? (
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Bank Transfer Slip
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {selectedPayment.slipImage
                            ? "Slip uploaded successfully"
                            : "No slip uploaded"}
                        </p>

                        {selectedPayment.slipImage && (
                          <a
                            href={`${selectedPayment.slipImage}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                          >
                            View Slip
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm gap-4">
                          <span className="text-slate-500">Cardholder Name</span>
                          <span className="font-medium text-slate-900">
                            {selectedPayment.cardDetails?.cardName || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm gap-4">
                          <span className="text-slate-500">Card Number</span>
                          <span className="font-medium text-slate-900 font-mono">
                            {selectedPayment.cardDetails?.cardLast4
                              ? `•••• •••• •••• ${selectedPayment.cardDetails.cardLast4}`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm gap-4">
                          <span className="text-slate-500">Expiry</span>
                          <span className="font-medium text-slate-900 font-mono">
                            {selectedPayment.cardDetails?.expiry || "N/A"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
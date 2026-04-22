import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function PaymentPage() {
  const [studentId, setStudentId] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [method, setMethod] = useState("CARD");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [slipImage, setSlipImage] = useState(null);
  const [showSlipUpload, setShowSlipUpload] = useState(false);

  const { courseId: paramCourseId } = useParams();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (paramCourseId && courses.length > 0) {
      const course = courses.find((c) => String(c._id) === String(paramCourseId));
      if (course) {
        setCourseId(course._id);
        setSelectedCourse(course);
      }
    }
  }, [paramCourseId, courses]);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load courses");
    }
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setCourseId(value);
    const course = courses.find((c) => c._id === value);
    setSelectedCourse(course || null);
  };

  const resetForm = () => {
    setStudentId("");
    setCourseId("");
    setMethod("CARD");
    setSelectedCourse(null);
    setCardName("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setSlipImage(null);
    setShowSlipUpload(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!/^IT\d{4,}$/.test(studentId)) {
      setMessage("Student ID must be like IT2023001");
      return;
    }

    if (!courseId) {
      setMessage("Please select a course");
      return;
    }

    // ✅ ADD YOUR CARD VALIDATION HERE
    if (method === "CARD") {
      if (!/^[a-zA-Z\s]+$/.test(cardName)) {
        setMessage("Card holder name must contain only letters");
        return;
      }

      const cleanCard = cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cleanCard)) {
        setMessage("Card number must be exactly 16 digits");
        return;
      }

      if (!/^\d{3}$/.test(cvv)) {
        setMessage("CVV must be exactly 3 digits");
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setMessage("Expiry must be in MM/YY format");
        return;
      }

      const [expMonth, expYear] = expiry.split("/").map(Number);
      if (expMonth < 1 || expMonth > 12) {
        setMessage("Invalid month (01-12 only)");
        return;
      }

      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        setMessage("Card has already expired");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("studentId", studentId);
        formData.append("courseId", courseId);
        formData.append("method", method);
        formData.append("cardName", cardName);
        formData.append("cardNumber", cardNumber);
        formData.append("expiry", expiry);

        const res = await api.post("/payments", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage(
          `Payment created successfully. Status: ${
            res.data.status || res.data.payment?.status || "PENDING"
          }`,
        );

        // Store as paid in localStorage
        const paidCourses = JSON.parse(localStorage.getItem("paidCourses") || "[]");
        if (!paidCourses.includes(courseId)) {
          paidCourses.push(courseId);
          localStorage.setItem("paidCourses", JSON.stringify(paidCourses));
        }

        resetForm();
      } catch (error) {
        setMessage(error.response?.data?.message || "Payment failed");
      }

      return;
    }

    if (method === "BANK_TRANSFER" && !showSlipUpload) {
      setShowSlipUpload(true);
      setMessage("Please upload your bank payment slip to continue");
      return;
    }
  };

  const handleSlipSubmit = async () => {
    setMessage("");

    if (!/^IT\d{4,}$/.test(studentId)) {
      setMessage("Student ID must be like IT2023001");
      return;
    }

    if (!courseId) {
      setMessage("Please select a course");
      return;
    }

    if (!slipImage) {
      setMessage("Please upload the bank payment slip");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("courseId", courseId);
      formData.append("method", method);
      formData.append("slipImage", slipImage);

      const res = await api.post("/payments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(
        `Bank transfer submitted successfully. Status: ${
          res.data.status || res.data.payment?.status || "PENDING"
        }`,
      );

      // Store as paid in localStorage
      const paidCourses = JSON.parse(localStorage.getItem("paidCourses") || "[]");
      if (!paidCourses.includes(courseId)) {
        paidCourses.push(courseId);
        localStorage.setItem("paidCourses", JSON.stringify(paidCourses));
      }

      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || "Slip upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Secure Payment Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Student Course Payment
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Complete your course payment quickly and securely using card or bank
            transfer. Select your course, choose a payment method, and confirm
            your registration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  1. Student Information
                </h2>

                <div className="mt-5 grid gap-5">
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
                      onChange={handleCourseChange}
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
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  2. Payment Method
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("CARD");
                      setShowSlipUpload(false);
                      setSlipImage(null);
                      setMessage("");
                    }}
                    className={`rounded-2xl border-2 px-5 py-4 text-left transition ${
                      method === "CARD"
                        ? "border-indigo-600 bg-indigo-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          Card Payment
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Fast and instant checkout
                        </p>
                      </div>
                      {method === "CARD" && (
                        <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMethod("BANK_TRANSFER");
                      setShowSlipUpload(false);
                      setSlipImage(null);
                      setMessage("");
                    }}
                    className={`rounded-2xl border-2 px-5 py-4 text-left transition ${
                      method === "BANK_TRANSFER"
                        ? "border-indigo-600 bg-indigo-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          Bank Transfer
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Upload payment slip after transfer
                        </p>
                      </div>
                      {method === "BANK_TRANSFER" && (
                        <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </section>

              {method === "CARD" && (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">
                    3. Card Details
                  </h2>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(value)) {
                            setCardName(value);
                          }
                        }}
                        placeholder="Enter card holder name"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length > 16) value = value.slice(0, 16);
                          const formatted = value
                            .replace(/(.{4})/g, "$1 ")
                            .trim();
                          setCardNumber(formatted);
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length > 4) value = value.slice(0, 4);
                            if (value.length >= 3) {
                              value = value.slice(0, 2) + "/" + value.slice(2);
                            }
                            setExpiry(value);
                          }}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length > 3) value = value.slice(0, 3);
                            setCvv(value);
                          }}
                          placeholder="123"
                          maxLength="4"
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {method === "BANK_TRANSFER" && (
                <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">
                    3. Bank Transfer Details
                  </h2>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-amber-100 bg-white p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Bank
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        Bank of Ceylon
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-white p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Account Name
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        University LMS
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-white p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Account Number
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        1234567890
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-white p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Branch
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        Colombo Main Branch
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm text-slate-600">
                    Please complete the transfer and upload your payment slip
                    for verification.
                  </p>

                  {showSlipUpload && (
                    <div className="mt-6 rounded-2xl border border-dashed border-amber-300 bg-white p-5">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Upload Payment Slip
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setSlipImage(e.target.files[0])}
                        className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-amber-600"
                      />

                      <button
                        type="button"
                        onClick={handleSlipSubmit}
                        className="mt-4 inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
                      >
                        Submit Slip
                      </button>
                    </div>
                  )}
                </section>
              )}

              {!showSlipUpload && (
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-indigo-800"
                >
                  {method === "CARD" ? "Pay Now" : "Continue"}
                </button>
              )}

              {message && (
                <div
                  className={`rounded-2xl border px-4 py-4 text-sm font-medium ${
                    message.toLowerCase().includes("success")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-500" />
                <div className="text-sm font-medium text-white/70">
                  Secure Card
                </div>
              </div>

              <div className="mt-10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Card Number
                </p>
                <p className="mt-2 font-mono text-2xl tracking-[0.2em] text-white">
                  {cardNumber || "•••• •••• •••• ••••"}
                </p>
              </div>

              <div className="mt-10 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Card Holder
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-white">
                    {cardName || "YOUR NAME"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Expires
                  </p>
                  <p className="mt-2 font-mono text-sm text-white">
                    {expiry || "MM/YY"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Order Summary
                </h3>
              </div>

              <div className="space-y-4 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedCourse
                        ? selectedCourse.title
                        : "No course selected"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Tuition Fee</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    ${" "}
                    {selectedCourse
                      ? selectedCourse.price || selectedCourse.fee || 0
                      : 0}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Payment Method
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {method === "CARD" ? "Card Payment" : "Bank Transfer"}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {method === "CARD" ? "Instant" : "Manual Review"}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-slate-900">
                      Total
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      ${" "}
                      {selectedCourse
                        ? selectedCourse.price || selectedCourse.fee || 0
                        : 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-center text-xs font-medium text-slate-500">
                Secure payment submission
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
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

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setCourseId(value);
    const course = courses.find((c) => c._id === value);
    setSelectedCourse(course || null);
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

    if (method === "CARD") {
      if (!cardName || !cardNumber || !expiry || !cvv) {
        setMessage("Please fill all card details");
        return;
      }

      if (cardNumber.replace(/\s/g, "").length < 16) {
        setMessage("Card number must be 16 digits");
        return;
      }

      if (cvv.length < 3) {
        setMessage("CVV must be at least 3 digits");
        return;
      }
    }

    try {
      const res = await api.post("/payments", {
        studentId,
        courseId,
        method,
        cardDetails:
          method === "CARD"
            ? {
                cardName,
                cardNumber,
                expiry,
              }
            : null,
      });

      setMessage(
        `Payment created successfully. Status: ${
          res.data.status || res.data.payment?.status || "PENDING"
        }`
      );

      setStudentId("");
      setCourseId("");
      setMethod("CARD");
      setSelectedCourse(null);
      setCardName("");
      setCardNumber("");
      setExpiry("");
      setCvv("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="page-card">
      <h2>Student Payment</h2>

      <form onSubmit={handleSubmit} className="form-grid">
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
          <select value={courseId} onChange={handleCourseChange} required>
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <div className="info-box">
            <p>
              <strong>Course:</strong> {selectedCourse.title}
            </p>
            <p>
              <strong>Fee:</strong> Rs. {selectedCourse.fee}
            </p>
          </div>
        )}

        <div>
          <label>Payment Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="CARD">Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        {method === "CARD" && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              background: "#f8fbff",
              marginTop: "10px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Card Payment Gateway</h3>

            <div style={{ marginBottom: "15px" }}>
              <label>Card Holder Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Enter card holder name"
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>

              <div>
                <label>CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength="4"
                />
              </div>
            </div>
          </div>
        )}

        {method === "BANK_TRANSFER" && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              background: "#fff8f0",
              marginTop: "10px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Bank Transfer Details</h3>
            <p><strong>Bank:</strong> Bank of Ceylon</p>
            <p><strong>Account Name:</strong> University LMS</p>
            <p><strong>Account Number:</strong> 1234567890</p>
            <p><strong>Branch:</strong> Colombo Main Branch</p>
            <p>Please complete the transfer and keep your receipt for verification.</p>
          </div>
        )}

        <button type="submit" className="btn-primary">
          Pay Now
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
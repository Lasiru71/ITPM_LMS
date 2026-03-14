import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

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
    try {
      await api.put(`/payments/reject/${id}`);
      setMessageType("error");
      setMessage("Payment rejected");
      fetchPayments();
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Reject failed");
    }
  };

  const deletePayment = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this payment?");

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          background: "#dcfce7",
          color: "#166534",
          border: "1px solid #86efac",
        };
      case "REJECTED":
        return {
          background: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fca5a5",
        };
      default:
        return {
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fcd34d",
        };
    }
  };

  return (
    <div
      className="page-card"
      style={{
        borderRadius: "20px",
        padding: "32px",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
        boxShadow: "0 14px 35px rgba(0,0,0,0.08)",
        border: "1px solid #e6ecf5",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            margin: "0 0 8px 0",
            fontSize: "2rem",
            color: "#0f172a",
          }}
        >
          Admin Payment Management
        </h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: "15px" }}>
          Review, approve, reject, or delete student payment records.
        </p>
      </div>

      {message && (
        <div
          style={{
            marginBottom: "18px",
            padding: "14px 16px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px",
            background: messageType === "success" ? "#ecfdf3" : "#fef2f2",
            color: messageType === "success" ? "#166534" : "#b91c1c",
            border:
              messageType === "success"
                ? "1px solid #bbf7d0"
                : "1px solid #fecaca",
          }}
        >
          {message}
        </div>
      )}

      <div className="table-wrap" style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#eff6ff" }}>
              <th style={thStyle}>Student ID</th>
              <th style={thStyle}>Course</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Method</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={tdStyle}>{payment.studentId}</td>
                  <td style={tdStyle}>
                    {payment.course?.title || payment.courseId?.title || "N/A"}
                  </td>
                  <td style={tdStyle}>Rs. {payment.amount}</td>
                  <td style={tdStyle}>{payment.method}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontWeight: "700",
                        fontSize: "12px",
                        ...getStatusStyle(payment.status),
                      }}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => approvePayment(payment._id)}
                        style={{
                          background: "#16a34a",
                          color: "#fff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectPayment(payment._id)}
                        style={{
                          background: "#f59e0b",
                          color: "#fff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => deletePayment(payment._id)}
                        style={{
                          background: "#dc2626",
                          color: "#fff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
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
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#64748b",
                    fontWeight: "600",
                  }}
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "14px 16px",
  fontSize: "14px",
  color: "#1e3a8a",
};

const tdStyle = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#0f172a",
};
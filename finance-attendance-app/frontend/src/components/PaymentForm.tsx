import { useState } from "react";
import axios from "../api/axios";

export default function PaymentForm() {

  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [method, setMethod] = useState("CARD");

  const submitPayment = async () => {

    try {

      await axios.post("/finance/pay", {
        studentId,
        courseId,
        method
      });

      alert("Payment submitted!");

    } catch (error) {
      console.error(error);
    }

  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Course Payment</h2>

      <input
        placeholder="Student ID"
        onChange={(e) => setStudentId(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Course ID"
        onChange={(e) => setCourseId(e.target.value)}
      />

      <br /><br />

      <select onChange={(e) => setMethod(e.target.value)}>
        <option value="CARD">Card Payment</option>
        <option value="BANK_TRANSFER">Bank Transfer</option>
      </select>

      <br /><br />

      <button onClick={submitPayment}>
        Submit Payment
      </button>
    </div>
  );
}
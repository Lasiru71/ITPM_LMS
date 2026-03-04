import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      gap: "20px",
      padding: "15px",
      background: "#1e293b",
      color: "white"
    }}>
      <h3>SLIIT LMS</h3>

      <Link to="/payment" style={{ color: "white" }}>Payments</Link>

      <Link to="/scan" style={{ color: "white" }}>Scan Attendance</Link>

      <Link to="/generate-qr" style={{ color: "white" }}>Generate QR</Link>

      <Link to="/admin/payments" style={{ color: "white" }}>Approve Payments</Link>
    </nav>
  );
}
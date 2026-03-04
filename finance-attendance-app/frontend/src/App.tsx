import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import PaymentCreate from "./pages/student/PaymentCreate";
import AttendanceScan from "./pages/student/AttendanceScan";
import GenerateQR from "./pages/lecturer/GenerateQR";
import ApprovePayments from "./pages/admin/ApprovePayments";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Student */}
        <Route path="/" element={<PaymentCreate />} />
        <Route path="/scan" element={<AttendanceScan />} />

        {/* Lecturer */}
        <Route path="/generate-qr" element={<GenerateQR />} />

        {/* Admin */}
        <Route path="/admin/payments" element={<ApprovePayments />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Lasiru/LoginPage.jsx";
import RegisterPage from "./pages/Lasiru/RegisterPage.jsx";
import AdminDashboard from "./pages/Lasiru/AdminDashboard.jsx";
import UserProfile from "./pages/Lasiru/UserProfile.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}

export default App;

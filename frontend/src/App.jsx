import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Lasiru/LoginPage.jsx";
import RegisterPage from "./pages/Lasiru/RegisterPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Future protected routes for Student/Lecturer/Admin dashboards can be added here */}
    </Routes>
  );
}

export default App;

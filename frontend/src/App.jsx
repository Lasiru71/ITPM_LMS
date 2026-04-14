import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Lasiru/LoginPage.jsx";
import RegisterPage from "./pages/Lasiru/RegisterPage.jsx";
import AdminDashboard from "./pages/Lasiru/AdminDashboard.jsx";
import UserProfile from "./pages/Lasiru/UserProfile.jsx";
import LecturerDashboard from "./pages/Lasiru/LecturerDashboard.jsx";
import StudentDashboard from "./pages/Lasiru/StudentDashboard.jsx";

// Home imports
import MainLayout from "./layouts/Home/MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/Home/About.jsx";
import Contact from "./pages/Home/Contact.jsx";
import ReviewsPage from "./pages/Lasiru/ReviewsPage.jsx";
import NotificationsPage from "./pages/Lasiru/NotificationsPage.jsx";

function App() {
  return (
    <Routes>
      {/* Home Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Dashboard Routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}

export default App;

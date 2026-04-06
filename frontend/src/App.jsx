import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Lasiru/LoginPage.jsx";
import RegisterPage from "./pages/Lasiru/RegisterPage.jsx";
import AdminDashboard from "./pages/Lasiru/AdminDashboard.jsx";
import UserProfile from "./pages/Lasiru/UserProfile.jsx";
import LecturerDashboard from "./pages/Lasiru/LecturerDashboard.jsx";
import StudentDashboard from "./pages/Lasiru/StudentDashboard.jsx";
import EditCourse from "./pages/Lasiru/EditCourse.jsx";
import CourseDetailPage from "./pages/Lasiru/CourseDetailPage.jsx";
import ExamLogin from "./pages/sadeepa/ExamLogin.jsx";
import AttendExam from "./pages/sadeepa/AttendExam.jsx";
import Project from "./pages/sadeepa/Project.jsx";
import ReviewsPage from "./pages/Lasiru/ReviewsPage.jsx";

// Home imports
import MainLayout from "./layouts/Home/MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/Home/About.jsx";
import Contact from "./pages/Home/Contact.jsx";
import Courses from "./pages/Home/Courses.jsx";
import News from "./pages/Home/News.jsx";
import FreeExam from "./pages/Home/FreeExam.jsx";
import GptHelper from "./pages/Home/GptHelper.jsx";

import NotificationsPage from "./pages/Lasiru/NotificationsPage.jsx";
import ProtectedRoute from "./components/Lasiru/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Home Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/news" element={<News />} />
        <Route path="/create-free-exam" element={<FreeExam />} />
        <Route path="/gpt-helper" element={<GptHelper />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Dashboard Routes - PROTECTED */}
      <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/lecturer-dashboard" element={<ProtectedRoute><LecturerDashboard /></ProtectedRoute>} />
      <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/edit-course/:id" element={<ProtectedRoute><EditCourse /></ProtectedRoute>} />
      <Route path="/lecturer/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
      <Route path="/exam-login" element={<ProtectedRoute><ExamLogin /></ProtectedRoute>} />
      <Route path="/exam-login/:id" element={<ProtectedRoute><AttendExam /></ProtectedRoute>} />
      <Route path="/project" element={<ProtectedRoute><Project /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;

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

// Course Management Imports
import CourseDetailPage from "./pages/Lasiru/CourseDetailPage.jsx";
import CreateCourse from "./pages/Lasiru/CreateCourse.jsx";
import EditCourse from "./pages/Lasiru/EditCourse.jsx";

// Sadeepa Validation Imports
import AttendExam from "./pages/sadeepa/AttendExam.jsx";
import ExamLogin from "./pages/sadeepa/ExamLogin.jsx";
import Project from "./pages/sadeepa/Project.jsx";

// Financial and Attendance Imports
import AdminPayments from "./pages/AdminPayments.jsx";
import AttendanceReport from "./pages/AttendanceReport.jsx";
import GenerateQRPage from "./pages/GenerateQRPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ScanAttendancePage from "./pages/ScanAttendancePage.jsx";

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

      {/* Course Management Routes */}
      <Route path="/courses/:id" element={<CourseDetailPage />} />
      <Route path="/create-course" element={<CreateCourse />} />
      <Route path="/edit-course/:id" element={<EditCourse />} />

      {/* Sadeepa Routes */}
      <Route path="/attend-exam" element={<AttendExam />} />
      <Route path="/exam-login" element={<ExamLogin />} />
      <Route path="/project" element={<Project />} />

      {/* Financial & Attendance Routes */}
      <Route path="/admin/payments" element={<AdminPayments />} />
      <Route path="/reports/attendance" element={<AttendanceReport />} />
      <Route path="/generate-qr" element={<GenerateQRPage />} />
      <Route path="/scan-attendance" element={<ScanAttendancePage />} />
      <Route path="/payment" element={<PaymentPage />} />
    </Routes>
  );
}

export default App;

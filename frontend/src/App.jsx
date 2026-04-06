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

// Home imports
import MainLayout from "./layouts/Home/MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/Home/About.jsx";
import Contact from "./pages/Home/Contact.jsx";
import Courses from "./pages/Home/Courses.jsx";
import News from "./pages/Home/News.jsx";
import FreeExam from "./pages/Home/FreeExam.jsx";
import GptHelper from "./pages/Home/GptHelper.jsx";
import PublicCourseDetail from "./pages/Home/PublicCourseDetail.jsx";

function App() {
  return (
    <Routes>
      {/* Home Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<PublicCourseDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/create-free-exam" element={<FreeExam />} />
        <Route path="/gpt-helper" element={<GptHelper />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Dashboard Routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/edit-course/:id" element={<EditCourse />} />
      <Route path="/lecturer/courses/:courseId" element={<CourseDetailPage />} />
      <Route path="/exam-login" element={<ExamLogin />} />
      <Route path="/exam-login/:id" element={<AttendExam />} />
      <Route path="/project" element={<Project />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}

export default App;

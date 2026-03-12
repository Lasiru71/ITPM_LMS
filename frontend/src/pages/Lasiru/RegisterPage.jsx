import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/Lasiru/AuthLayout.jsx";
import { registerUser } from "../../api/Lasiru/authApi.js";
import "./../../Styles/Lasiru/Register.css";
import { useToast } from "../../components/Lasiru/ToastProvider.jsx";

function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    role: "Student", // Default to Learn
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      showToast("error", "Full Name is required.");
      return;
    }

    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      showToast("error", "Please enter a valid email address.");
      return;
    }

    if (!form.studentId.trim()) {
      showToast("error", "Student ID is required.");
      return;
    }

    if (!form.password || form.password.length < 6) {
      showToast("error", "Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("success", "Account created successfully.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
      showToast("error", err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your learning journey in seconds"
      illustrationSide="left"
      illustrationTitle="Join Our Community"
      illustrationSubtitle="Create your free account and get access to premium courses, expert mentors, and certificates."
    >
      <form className="lasiru-auth-form" onSubmit={handleSubmit}>
        
        <div className="lasiru-field">
          <label htmlFor="name">Full Name</label>
          <div className="lasiru-input-wrapper">
            <span className="lasiru-input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="lasiru-field">
          <label htmlFor="email">Email Address</label>
          <div className="lasiru-input-wrapper">
            <span className="lasiru-input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="lasiru-field">
          <label htmlFor="studentId">Student ID</label>
          <div className="lasiru-input-wrapper">
            <span className="lasiru-input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </span>
            <input
              id="studentId"
              name="studentId"
              type="text"
              placeholder="Enter your student ID"
              value={form.studentId}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="lasiru-field">
          <label htmlFor="password">Password</label>
          <div className="lasiru-input-wrapper">
            <span className="lasiru-input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              className="lasiru-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {showPassword ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9-4-10-8 0-.54.08-1.06.21-1.56" />
                    <path d="M6.17 6.17A9.82 9.82 0 0 1 12 4c5 0 9 4 10 8-.23.93-.57 1.81-.99 2.61" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                ) : (
                  <>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {error && <p className="lasiru-error">{error}</p>}

        <button
          className="lasiru-primary-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="lasiru-switch-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;

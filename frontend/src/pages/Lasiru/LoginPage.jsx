import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/Lasiru/AuthLayout.jsx";
import { loginUser } from "../../api/Lasiru/authApi.js";
import "./../../Styles/Lasiru/Login.css";
import { useToast } from "../../components/Lasiru/ToastProvider.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
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

    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      showToast("error", "Please enter a valid email address.");
      return;
    }

    if (!form.password.trim()) {
      showToast("error", "Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      showToast("success", "Successfully signed in.");

      if (data.user.role === "Admin") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "Lecturer") {
        navigate("/lecturer-dashboard");
      } else if (data.user.role === "Student") {
        navigate("/student-dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.message);
      showToast("error", err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your learning journey"
      illustrationSide="right"
      illustrationTitle="Start Learning Today"
      illustrationSubtitle="Access 234+ expert-led courses and join 45,000+ learners advancing their careers."
    >
      <form className="lasiru-auth-form" onSubmit={handleSubmit}>
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
          <label htmlFor="password">Password</label>
          <div className="lasiru-input-wrapper">
            <span className="lasiru-input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
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
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="lasiru-login-extra">
          <h4>QUICK DEMO ACCESS</h4>
        </div>

        <p className="lasiru-switch-link">
          Don&apos;t have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;

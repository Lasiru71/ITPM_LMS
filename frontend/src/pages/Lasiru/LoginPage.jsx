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
    setLoading(true);
    try {
      const data = await loginUser(form);
      // Save token & role for later use (client-side session)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      showToast("success", "Successfully signed in.");

      // Route based on role
      if (data.user.role === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard"); // Default for Student/Lecturer
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
      title="Welcome back to EduVault"
      subtitle="Sign in securely to access your personalised dashboard."
      illustrationSide="left"
    >
      <form className="lasiru-auth-form" onSubmit={handleSubmit}>
        <div className="lasiru-field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="lasiru-field">
          <label htmlFor="password">Password</label>
          <div className="lasiru-password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
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
                strokeWidth="1.7"
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
          {loading ? "Signing you in..." : "Sign in"}
        </button>

        <p className="lasiru-switch-link">
          Don&apos;t have an account?{" "}
          <Link to="/register">Create one now</Link>
        </p>

        <div className="lasiru-login-extra">
          <h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Role-Based Access
          </h4>
          <p>
            Depending on your role, you will be directed to:
          </p>
          <ul>
            <li><strong>Admin Dashboard:</strong> Manage lectures & students.</li>
            <li><strong>Lecturer Portal:</strong> Publish course materials.</li>
            <li><strong>Student Hub:</strong> Access your modules.</li>
          </ul>
        </div>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;


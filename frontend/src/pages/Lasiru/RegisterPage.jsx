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
    address: "",
    phone: "",
    email: "",
    password: "",
    studentId: "",
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
      title="Create your EduVault account"
      subtitle="Join as a student start managing learning activities."
      illustrationSide="right"
    >
      <form className="lasiru-auth-form" onSubmit={handleSubmit}>
        <div className="lasiru-two-column">
          <div className="lasiru-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Lasiru Perera"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="lasiru-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+94 77 123 4567"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="lasiru-field">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Colombo, Sri Lanka"
            value={form.address}
            onChange={handleChange}
          />
        </div>

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
          <label htmlFor="studentId">Student ID (Optional for non-students)</label>
          <input
            id="studentId"
            name="studentId"
            type="text"
            placeholder="e.g. IT12345678"
            value={form.studentId}
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
              autoComplete="new-password"
              required
              placeholder="Create a strong password"
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
          {loading ? "Creating your account..." : "Create account"}
        </button>

        <p className="lasiru-switch-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;


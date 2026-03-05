import "./../../Styles/Lasiru/AuthLayout.css";

function AuthLayout({ illustrationSide = "left", title, subtitle, children }) {
  return (
    <div className="lasiru-auth-page">
      <div
        className={`lasiru-auth-card ${
          illustrationSide === "right" ? "reverse" : ""
        }`}
      >
        <div className="lasiru-auth-illustration">
          <div className="lasiru-auth-gradient-orbit" />
          <div className="lasiru-auth-graphic">
            <svg
              viewBox="0 0 260 220"
              className="lasiru-auth-graphic-svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="lasiruBoard"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#16a34a" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <rect
                x="26"
                y="26"
                width="208"
                height="140"
                rx="18"
                fill="url(#lasiruBoard)"
                stroke="rgba(34,197,94,0.7)"
                strokeWidth="1.4"
              />
              <rect
                x="40"
                y="44"
                width="60"
                height="46"
                rx="10"
                fill="rgba(15,23,42,0.9)"
                stroke="rgba(45,212,191,0.6)"
                strokeWidth="1.2"
              />
              <rect
                x="106"
                y="44"
                width="98"
                height="18"
                rx="9"
                fill="rgba(22,163,74,0.75)"
              />
              <rect
                x="106"
                y="70"
                width="84"
                height="10"
                rx="5"
                fill="rgba(148,163,184,0.45)"
              />
              <rect
                x="40"
                y="102"
                width="164"
                height="18"
                rx="9"
                fill="rgba(15,23,42,0.9)"
              />
              <circle
                cx="220"
                cy="46"
                r="8"
                fill="rgba(34,197,94,0.9)"
              />
              <circle
                cx="200"
                cy="170"
                r="18"
                fill="rgba(6,95,70,0.96)"
                stroke="rgba(45,212,191,0.6)"
                strokeWidth="1.4"
              />
              <path
                d="M192 172l6 6 9-12"
                fill="none"
                stroke="#a7f3d0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="lasiru-auth-floating-card">
            <h2>EduVault</h2>
            <p>Your smart learning companion</p>
            <ul>
              <li>Personalised student experience</li>
              <li>Powerful tools for lecturers</li>
              <li>Full control for administrators</li>
            </ul>
          </div>
          <div className="lasiru-auth-metrics">
            <div>
              <span>3</span>
              <p>Roles</p>
            </div>
            <div>
              <span>24/7</span>
              <p>Access</p>
            </div>
            <div>
              <span>Secure</span>
              <p>JWT Auth</p>
            </div>
          </div>
        </div>

        <div className="lasiru-auth-form-wrapper">
          <header className="lasiru-auth-header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </header>
          <div className="lasiru-auth-form-container">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;


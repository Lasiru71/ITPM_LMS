import "./../../Styles/Lasiru/AuthLayout.css";

function AuthLayout({ 
  illustrationSide = "left", 
  title, 
  subtitle,
  illustrationTitle,
  illustrationSubtitle,
  children 
}) {
  return (
    <div className="lasiru-auth-page">
      <div
        className={`lasiru-auth-card ${
          illustrationSide === "left" ? "reverse" : ""
        }`}
      >
        <div className="lasiru-auth-form-wrapper">
          <header className="lasiru-auth-header">
            <div className="lasiru-logo-container">
              <div className="lasiru-logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              </div>
              <span className="lasiru-logo-text">EduVault</span>
            </div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </header>
          <div className="lasiru-auth-form-container">{children}</div>
        </div>

        <div className="lasiru-auth-illustration">
          <div className="lasiru-illustration-content">
            <div className="lasiru-illustration-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            <h2>{illustrationTitle}</h2>
            <p>{illustrationSubtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Bell, Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';
import { APP_NAME, NAV_LINKS } from '../../constants/Home/config';

/* ── tiny nav link helper with JS hover ─────────── */
function NavLink({ to, children, style = {} }) {
  const [hover, setHover] = useState(false);
  return (
    <Link to={to}
      style={{ padding: '0.4rem 0.875rem', fontSize: '0.875rem', fontWeight: 500, color: hover ? '#059669' : '#475569', background: hover ? '#f0fdf4' : 'transparent', borderRadius: '0.5rem', transition: 'color 0.15s, background 0.15s', textDecoration: 'none', whiteSpace: 'nowrap', ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      {children}
    </Link>
  );
}

/* ── ghost icon button helper ───────────────────── */
function IconBtn({ onClick, title, children }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} title={title}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '0.5rem', background: hover ? '#f1f5f9' : 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'background 0.15s' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      {children}
    </button>
  );
}

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setProfileOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'Admin':    return '/admin-dashboard';
      case 'Lecturer': return '/lecturer-dashboard';
      case 'Student':  return '/student-dashboard';
      default:         return '/profile';
    }
  };

  /* ── EXTRA links shown right of left nav ─────── */
  const EXTRA_LINKS = [
    { label: 'Exam Login',       href: 'http://localhost:8081/login', external: true },
    { label: 'Books & Projects', href: 'http://localhost:8082/',       external: true },
    { label: 'Reviews & Ratings',href: '/reviews',                     external: false },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 64, maxWidth: 1600, margin: '0 auto', width: '100%' }}>

        {/* ── Left: logo + nav links ─────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
              <BookOpen style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
            <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{APP_NAME}</span>
          </Link>

          {/* Primary nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {NAV_LINKS.map(link => <NavLink key={link.path} to={link.path}>{link.label}</NavLink>)}
          </nav>
        </div>

        {/* ── Right: extra links + auth ──────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }} className="desktop-nav">
          {/* Extra links */}
          {EXTRA_LINKS.map(({ label, href, external }) =>
            external
              ? <a key={label} href={href} target="_blank" rel="noreferrer"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', fontWeight: 500, color: '#475569', borderRadius: '0.5rem', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.15s, background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#059669'; e.currentTarget.style.background = '#f0fdf4'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}>
                  {label}
                </a>
              : <NavLink key={label} to={href}>{label}</NavLink>
          )}

          {/* Separator */}
          <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 0.5rem' }} />

          {!isAuthenticated ? (
            <>
              <NavLink to="/login">Sign In</NavLink>
              <Link to="/register">
                <button
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 36, padding: '0 1.125rem', background: '#10b981', border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s', boxShadow: '0 4px 12px rgba(16,185,129,0.25)', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                  onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                >
                  Get Started
                </button>
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to={getDashboardPath()}>
                <IconBtn title="Notifications"><Bell style={{ width: 18, height: 18 }} /></IconBtn>
              </Link>

              {/* Profile dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.625rem 0.25rem 0.375rem', background: 'transparent', border: 'none', borderRadius: '999px', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 800, fontSize: '0.875rem', border: '2px solid rgba(16,185,129,0.2)' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown style={{ width: 14, height: 14, color: '#94a3b8' }} />
                </button>

                {profileOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 220, background: '#fff', borderRadius: '0.875rem', boxShadow: '0 16px 48px rgba(15,23,42,0.14)', border: '1px solid #f1f5f9', padding: '0.375rem', zIndex: 100 }}>
                    <div style={{ padding: '0.625rem 0.875rem 0.75rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.25rem' }}>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{user?.name}</p>
                      <p style={{ margin: '0.125rem 0 0.375rem', fontSize: '0.75rem', color: '#94a3b8' }}>{user?.email}</p>
                      <span style={{ display: 'inline-block', padding: '0.125rem 0.5rem', fontSize: '0.625rem', fontWeight: 800, color: '#059669', background: '#d1fae5', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{user?.role}</span>
                    </div>
                    {[
                      { to: getDashboardPath(), icon: LayoutDashboard, label: 'Dashboard' },
                      { to: '/profile', icon: User, label: 'Profile' },
                    ].map(({ to, icon: Icon, label }) => (
                      <Link key={label} to={to} onClick={() => setProfileOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#374151', borderRadius: '0.5rem', textDecoration: 'none', transition: 'background 0.12s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Icon style={{ width: 16, height: 16 }} /> {label}
                      </Link>
                    ))}
                    <button onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#ef4444', borderRadius: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <LogOut style={{ width: 16, height: 16 }} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Hamburger ────────────────────────── */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: 'transparent', border: 'none', cursor: 'pointer', color: '#374151' }}
        >
          {mobileOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
        </button>
      </div>

      {/* ── Mobile menu ──────────────────────── */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '1rem 1.5rem 1.5rem', background: '#fff' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                style={{ padding: '0.625rem 0.75rem', fontSize: '0.9375rem', fontWeight: 500, color: '#374151', borderRadius: '0.5rem', textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
            <div style={{ height: 1, background: '#f1f5f9', margin: '0.5rem 0' }} />
            {EXTRA_LINKS.map(({ label, href, external }) =>
              external
                ? <a key={label} href={href} target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)} style={{ padding: '0.625rem 0.75rem', fontSize: '0.9375rem', fontWeight: 500, color: '#374151', borderRadius: '0.5rem', textDecoration: 'none' }}>{label}</a>
                : <Link key={label} to={href} onClick={() => setMobileOpen(false)} style={{ padding: '0.625rem 0.75rem', fontSize: '0.9375rem', fontWeight: 500, color: '#374151', borderRadius: '0.5rem', textDecoration: 'none' }}>{label}</Link>
            )}
            <div style={{ height: 1, background: '#f1f5f9', margin: '0.5rem 0' }} />
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{ padding: '0.625rem 0.75rem', fontSize: '0.9375rem', fontWeight: 500, color: '#374151', textDecoration: 'none' }}>Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}><button style={{ width: '100%', height: 40, background: '#10b981', border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.25rem' }}>Get Started</button></Link>
              </>
            ) : (
              <>
                <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} style={{ padding: '0.625rem 0.75rem', fontSize: '0.9375rem', fontWeight: 500, color: '#374151', textDecoration: 'none' }}>Dashboard</Link>
                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '0.625rem 0.75rem', fontSize: '0.9375rem', fontWeight: 500, color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>Sign Out</button>
              </>
            )}
          </nav>
        </div>
      )}

      <style>{`
        @media(max-width:1100px) {
          .desktop-nav { gap: 0.125rem !important; }
          .desktop-nav a, .desktop-nav button { padding: 0.4rem 0.5rem !important; font-size: 0.75rem !important; }
        }
        @media(max-width:768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Globe, Award, BookOpen, ArrowRight, Heart, Target, Lightbulb } from 'lucide-react';
import heroImg from '../../assets/hero-illustration.jpg';
import '../../Styles/Home/Home.css';

const team = [
  { name: 'Dr. Sarah Mitchell', role: 'CEO & Founder', bio: 'Former VP of Education at Coursera with 15+ years of EdTech experience.' },
  { name: 'Prof. James Chen', role: 'Head of Curriculum', bio: 'Ex-Google engineering lead who built scalable learning platforms.' },
  { name: 'Dr. Emily Rodriguez', role: 'Chief Learning Officer', bio: 'Published AI researcher and dedicated educator across 3 universities.' },
  { name: 'Marcus Williams', role: 'VP of Product & Design', bio: 'Former UX lead at Figma, passionate about intuitive educational tools.' },
];

const values = [
  { icon: Heart, title: 'Quality First', description: 'Every course is vetted by our expert review board to ensure exceptional outcomes.' },
  { icon: Target, title: 'Outcome-Driven', description: 'Our curriculum is designed around career outcomes, not just theory.' },
  { icon: Lightbulb, title: 'Always Innovating', description: 'We continuously update content to keep pace with industry evolution.' },
  { icon: Globe, title: 'Globally Accessible', description: 'Education should have no borders. Serving learners in 120+ countries.' },
];

const STATS = [
  { icon: Users, value: '45,000+', label: 'Active Learners' },
  { icon: BookOpen, value: '234+', label: 'Expert Courses' },
  { icon: Globe, value: '120+', label: 'Countries Served' },
  { icon: Award, value: '98%', label: 'Satisfaction Rate' },
];

/* ── tiny reusable ghost outline button ───────────── */
function OutlineBtn({ to, children }) {
  return (
    <Link to={to}>
      <button
        style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', height: '3rem', padding: '0 2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '0.625rem', color: '#fff', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {children}
      </button>
    </Link>
  );
}

function PrimaryBtn({ to, children }) {
  return (
    <Link to={to}>
      <button
        style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', height: '3rem', padding: '0 2rem', background: '#10b981', border: 'none', borderRadius: '0.625rem', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}
        onMouseEnter={e => e.currentTarget.style.background = '#059669'}
        onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
      >
        {children}
      </button>
    </Link>
  );
}

export default function About() {
  return (
    <div className="home-page-bg">
      {/* Background Blobs */}
      <div className="blob blob-1" style={{ top: '15%', right: '-10%' }} />
      <div className="blob blob-2" style={{ top: '60%', left: '-5%' }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#0a1628 0%,#0d3d38 55%,#0d5c4a 100%)', color: '#fff', width: '100%', marginBottom: '0' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(10,22,40,0.92) 0%,rgba(10,22,40,0.6) 100%)' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 10, padding: '5rem 0 7rem', textAlign: 'center' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.15em' }}>About EduVault</span>
            <h1 style={{ margin: '1rem 0 1.5rem', fontSize: 'clamp(2.25rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.2, color: '#fff', letterSpacing: '-0.03em' }}>
              Transforming Education Through <br /><span style={{ color: '#34d399' }}>Technology</span> & Expert Knowledge
            </h1>
            <h2 style={{ display: 'none' }}>About Section</h2>
            <p style={{ margin: '0 0 2.5rem', fontSize: '1.125rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: 620 }}>
              Founded in 2020, EduVault has grown from a small startup to a global learning platform serving 45,000+ learners across 120 countries.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <PrimaryBtn to="/register">Join EduVault <ArrowRight style={{ width: 18, height: 18 }} /></PrimaryBtn>
              <OutlineBtn to="/courses">Browse Courses</OutlineBtn>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="page-container" style={{ position: 'relative', zIndex: 20, marginBottom: '4rem', marginTop: '-1.5rem' }}>
        <div className="about-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }}>
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="glass-card" style={{ borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid var(--green-100)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Icon style={{ width: 28, height: 28, color: 'var(--emerald-dk)' }} />
              </div>
              <p style={{ margin: 0, fontSize: '1.875rem', fontWeight: 800, color: 'var(--navy)' }}>{value}</p>
              <p style={{ margin: '0.375rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:768px){.about-stats{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
      </div>

      {/* ── Values ────────────────────────────────────────────── */}
      <section className="section-transparent" style={{ padding: '6rem 0', width: '100%' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-dk)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Our Mission</span>
            <h2 style={{ margin: '0.5rem 0 0', fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>What Drives Us</h2>
          </div>
          <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title}
                style={{ padding: '2.5rem', borderRadius: '1.5rem', background: '#fff', border: '1px solid var(--green-100)', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-400)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-8px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--green-100)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 64, height: 64, borderRadius: '1rem', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Icon style={{ width: 32, height: 32, color: 'var(--emerald)' }} />
                </div>
                <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media(max-width:1100px){.values-grid{grid-template-columns:repeat(2,1fr)!important;}}
          @media(max-width:550px){.values-grid{grid-template-columns:1fr!important;}}
        `}</style>
      </section>

      {/* ── Team ──────────────────────────────────────────────── */}
      <section className="section-green" style={{ padding: '8rem 0', width: '100%' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-dk)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Our Team</span>
            <h2 style={{ margin: '0.5rem 0 0.75rem', fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>Meet the Leaders</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.0625rem' }}>Industry experts dedicated to your success.</p>
          </div>
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
            {team.map((member) => (
              <div key={member.name}
                style={{ borderRadius: '1.5rem', background: '#fff', border: '1px solid var(--green-100)', overflow: 'hidden', transition: 'all 0.3s ease', textAlign: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-8px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ height: 200, background: 'linear-gradient(135deg,#10b981,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>
                    {member.name.charAt(0)}
                  </div>
                </div>
                <div style={{ padding: '1.75rem' }}>
                  <h3 style={{ margin: '0 0 0.375rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--navy)' }}>{member.name}</h3>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--emerald)', fontWeight: 600 }}>{member.role}</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: '8rem 0', width: '100%' }}>
        <div className="page-container">
          <div style={{ position: 'relative', background: 'linear-gradient(135deg,#0a1628 0%,#0d3d38 55%,#059669 100%)', borderRadius: '4rem', overflow: 'hidden', padding: '6rem 2rem', textAlign: 'center', color: '#fff' }}>
            <div style={{ position: 'absolute', top: -150, right: -150, width: 350, height: 350, background: 'rgba(255,255,255,0.07)', borderRadius: '50%', filter: 'blur(80px)' }} />
            <div style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: 'clamp(2rem,4vw,3.25rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>Ready to Start Learning?</h3>
              <p style={{ margin: '0 0 2.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: 1.8 }}>
                Join our global community and take the first step toward mastering the skills that matter.
              </p>
              <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center', gap: '1rem' }} className="cta-buttons">
                <Link to="/register">
                  <button
                    style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '3.75rem', padding: '0 2.75rem', background: '#fff', color: '#059669', border: 'none', borderRadius: '1rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'; }}
                  >
                    Create Free Account <ArrowRight style={{ width: 18, height: 18, marginLeft: 8, flexShrink: 0 }} />
                  </button>
                </Link>
                <Link to="/contact">
                  <button
                    style={{ display: 'inline-flex', alignItems: 'center', height: '3.75rem', padding: '0 2.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '1rem', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

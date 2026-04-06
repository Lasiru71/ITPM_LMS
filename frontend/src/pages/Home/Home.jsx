import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Users, BookOpen, Award, Star, GraduationCap, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '../../components/Home/ui/Button';
import { MOCK_COURSES } from '../../constants/Home/mockData';
import CourseCard from '../../components/Home/CourseCard';
import { useCourseStore } from '../../stores/courseStore';
import heroImg from '../../assets/hero-illustration.jpg';
import '../../Styles/Home/Home.css';

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const STATS = [
  { icon: Users, label: 'Active Learners', value: 45000, suffix: '+' },
  { icon: BookOpen, label: 'Expert Courses', value: 234, suffix: '+' },
  { icon: Award, label: 'Certificates Issued', value: 18000, suffix: '+' },
  { icon: Star, label: 'Average Rating', value: 4.8, suffix: '/5', isDecimal: true },
];

const FEATURES = [
  { icon: GraduationCap, title: 'Expert Instructors', description: 'Learn from industry veterans with real-world experience at top tech companies.' },
  { icon: Zap, title: 'Hands-On Projects', description: 'Build portfolio-worthy projects with guided, step-by-step instructions.' },
  { icon: Shield, title: 'Lifetime Access', description: 'Enroll once, learn forever. All updates and new content included free.' },
  { icon: Globe, title: 'Learn Anywhere', description: 'Access courses on any device. Download lessons for offline learning.' },
];

export default function Home() {
  const { courses, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Map backend courses to add necessary UI flags & fields
  const mappedRealCourses = courses.map(c => ({
    ...c,
    id: c._id || c.id,
    title: c.title,
    instructor: c.instructorName || c.instructor || 'Lecturer',
    price: c.price || 'Free',
    image: c.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    thumbnail: c.thumbnail,
    rating: c.rating || 4.5,
    reviews: c.reviews || 10,
    category: c.category || 'General',
    level: c.level || 'All Levels',
    isBestseller: true, // Show real courses as bestseller to highlight them
    isNew: true         // Show real courses as new
  }));

  const allCourses = [
    ...mappedRealCourses,
    ...MOCK_COURSES.filter(
      (mock) => !mappedRealCourses.some((real) => real.id === mock.id)
    ),
  ];

  const featuredCourses = allCourses.filter((c) => c.isBestseller).slice(0, 4);
  const newCourses = allCourses.filter((c) => c.isNew).slice(0, 4);

  return (
    <div className="home-page-bg">
      {/* Background Blobs */}
      <div className="blob blob-1" style={{ top: '10%', left: '-10%' }} />
      <div className="blob blob-2" style={{ top: '40%', right: '-5%' }} />
      <div className="blob blob-3" style={{ bottom: '10%', left: '15%' }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '500px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a1628 0%, #0d3d38 55%, #0d5c4a 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '2rem 0',
        marginTop: '0px'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          opacity: 0.15,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(10,22,40,0.96) 0%, rgba(10,22,40,0.70) 45%, rgba(10,22,40,0.05) 100%)',
        }} />

        <div className="page-container hero-grid" style={{
          position: 'relative', zIndex: 10,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '3rem', alignItems: 'center',
        }}>
          {/* ── Left text ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem', borderRadius: '999px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)', width: 'fit-content',
            }}>
              ✨ New: Education in 2026
            </div>

            <h1 style={{ margin: 0, fontSize: 'clamp(2.25rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.2, color: '#fff', letterSpacing: '-0.03em' }}>
              Unlock Your<br />
              <span style={{ color: '#34d399' }}>Full Potential</span><br />
              With Expert-Led Courses
            </h1>

            <p style={{ margin: 0, fontSize: '1.125rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: 500 }}>
              Access 234+ expert-led courses and join 45,000+ learners advancing their careers through hands-on education.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/courses">
                <Button size="lg" style={{ height: '3.5rem', padding: '0 2.5rem', background: '#10b981', color: '#fff', border: 'none', boxShadow: '0 8px 24px rgba(16,185,129,0.35)', fontSize: '1rem' }}>
                  Explore Courses <ArrowRight style={{ width: 18, height: 18, marginLeft: 8 }} />
                </Button>
              </Link>
              <Link to="/about">
                <button
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', height: '3.5rem', padding: '0 2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '0.75rem', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Play style={{ width: 18, height: 18 }} /> Watch Demo
                </button>
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingTop: '1rem' }}>
              <div style={{ display: 'flex' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#34d399)', border: '2px solid rgba(10,22,40,0.8)', marginLeft: i === 1 ? 0 : -12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    U{i}
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>4,200+ students</span> enrolled this week
              </p>
            </div>
          </div>

          {/* ── Right image panel ── */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ borderRadius: '2rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', background: '#0d2035', maxWidth: 550, width: '100%' }}>
              <img src={heroImg} alt="EduVault Platform" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }} />
            </div>

            {/* Avg. Rating floating badge */}
            <div className="animate-float" style={{ position: 'absolute', top: -20, right: -10, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '1.25rem', padding: '1rem 1.25rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Star style={{ width: 24, height: 24, color: '#fbbf24', fill: '#fbbf24' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.625rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Avg. Rating</p>
                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>4.8/5</p>
              </div>
            </div>

            {/* Certificates floating badge */}
            <div className="animate-float" style={{ position: 'absolute', bottom: -10, left: -10, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '1.25rem', padding: '1rem 1.25rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: '0.75rem', animationDelay: '1s' }}>
              <Award style={{ width: 24, height: 24, color: '#10b981' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.625rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Certificates</p>
                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>18,420</p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr !important; gap: 4rem !important; }
            .hero-grid > div:last-child { max-width: 450px; margin: 0 auto; }
          }
        `}</style>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <div className="page-container" style={{ position: 'relative', zIndex: 20, marginBottom: '4rem', marginTop: '-1.5rem' }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {STATS.map(({ icon: Icon, label, value, suffix, isDecimal }) => (
            <div key={label} className="glass-card" style={{ borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid var(--green-100)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Icon style={{ width: 28, height: 28, color: 'var(--emerald-dk)' }} />
              </div>
              <p style={{ margin: 0, fontSize: 'clamp(1.75rem,4vw,2.25rem)', fontWeight: 800, color: 'var(--navy)' }}>
                {isDecimal ? <span>{value}{suffix}</span> : <AnimatedCounter target={value} suffix={suffix} />}
              </p>
              <p style={{ margin: '0.375rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
      </div>

      {/* ── Bestselling Courses ───────────────────────────────── */}
      <section className="section-transparent" style={{ padding: '4rem 0 8rem' }}>
        <div className="page-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-dk)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Top Rated</span>
              <h2 style={{ margin: '0.5rem 0 0', fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>Bestselling Courses</h2>
            </div>
            <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700, color: 'var(--emerald-dk)', textDecoration: 'none' }}>
              View All <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
          <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
            {featuredCourses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        </div>
        <style>{`
          @media(max-width:1100px){.courses-grid{grid-template-columns:repeat(2,1fr)!important;}}
          @media(max-width:550px){.courses-grid{grid-template-columns:1fr!important;}}
        `}</style>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="section-green" style={{ padding: '8rem 0', width: '100%', position: 'relative' }}>
        <div className="page-container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-dk)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Why EduVault</span>
            <h2 style={{ margin: '0.5rem 0 1.25rem', fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>Everything You Need to Succeed</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.0625rem' }}>We provide the tools and guidance you need to transform your career.</p>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title}
                style={{ background: '#fff', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid var(--green-100)', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-400)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-8px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--green-100)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 64, height: 64, borderRadius: '1rem', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Icon style={{ width: 32, height: 32, color: 'var(--emerald)' }} />
                </div>
                <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Courses ───────────────────────────────────────── */}
      {newCourses.length > 0 && (
        <section className="section-transparent" style={{ padding: '8rem 0' }}>
          <div className="page-container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-dk)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Just Launched</span>
                <h2 style={{ margin: '0.5rem 0 0', fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>New Courses</h2>
              </div>
              <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700, color: 'var(--emerald-dk)', textDecoration: 'none' }}>
                See More <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
            <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
              {newCourses.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 0 8rem', width: '100%' }}>
        <div className="page-container">
          <div style={{ position: 'relative', background: 'linear-gradient(135deg,#0a1628 0%,#0d3d38 55%,#059669 100%)', borderRadius: '3rem', overflow: 'hidden', padding: '5rem 2rem', textAlign: 'center', color: '#fff' }}>
            <div style={{ position: 'absolute', top: -150, right: -150, width: 350, height: 350, background: 'rgba(255,255,255,0.07)', borderRadius: '50%', filter: 'blur(80px)' }} />
            <div style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto' }}>
              <h2 style={{ margin: '0 0 1rem', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Ready to Start Your<br />Learning Journey?
              </h2>
              <p style={{ margin: '0 0 2rem', color: 'rgba(255,255,255,0.7)', fontSize: '1.0625rem', lineHeight: 1.7 }}>
                Join thousands of learners. 234+ courses, lifetime access & certificates.
              </p>
              <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }} className="cta-buttons">
                <Link to="/register">
                  <button
                    style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '4rem', padding: '0 3rem', background: '#fff', color: '#059669', border: 'none', borderRadius: '1.25rem', fontWeight: 800, fontSize: '1.125rem', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    Get Started Free <ArrowRight style={{ width: 22, height: 22, marginLeft: 10, flexShrink: 0 }} />
                  </button>
                </Link>
                <Link to="/courses">
                  <button
                    style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '4rem', padding: '0 2.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '1.25rem', color: '#fff', fontSize: '1.125rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Browse Courses
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

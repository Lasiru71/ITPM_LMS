import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../../components/Home/ui/Button';
import '../../Styles/Home/Home.css';

const contactInfo = [
  { icon: Mail, label: 'Email Us', value: 'support@eduvault.com', detail: 'We reply within 24 hours' },
  { icon: Phone, label: 'Call Us', value: '+1 (800) 123-4567', detail: 'Mon–Fri, 9am–6pm EST' },
  { icon: MapPin, label: 'Visit Us', value: '123 Learning Ave, San Francisco, CA 94102', detail: 'Open for campus visits' },
  { icon: Clock, label: 'Business Hours', value: 'Mon–Fri: 9am–6pm EST', detail: 'Sat: 10am–4pm EST' },
];

const faqs = [
  { q: 'How do I enroll in a course?', a: 'Simply create an account, browse our course catalog, and click "Enroll" on any course. You can start immediately after payment.' },
  { q: 'Do you offer refunds?', a: 'Yes! We offer a 30-day money-back guarantee on all courses. No questions asked.' },
  { q: 'Can I download course content?', a: 'Learners can access offline-friendly content. Premium courses also enable video downloads via our mobile app.' },
  { q: 'How do I get my certificate?', a: 'Complete all course modules and pass the final assessment. Your certificate will be instantly available to download and share.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="home-page-bg">
      {/* Background Blobs */}
      <div className="blob blob-1" style={{ top: '20%', left: '-10%' }} />
      <div className="blob blob-2" style={{ bottom: '10%', right: '-5%' }} />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#0a1628 0%,#0d3d38 55%,#0d5c4a 100%)', color: '#fff', width: '100%', marginBottom: '0' }}>
        <div className="page-container" style={{ position: 'relative', zIndex: 10, padding: '6rem 0 8rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Contact Us</span>
          <h1 style={{ margin: '1rem 0 1.5rem', fontSize: 'clamp(2.25rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.2, color: '#fff', letterSpacing: '-0.02em' }}>
            We'd Love to <span style={{ color: '#34d399' }}>Hear From You</span>
          </h1>
          <p style={{ margin: '0 auto', fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: 700 }}>
            Have a question, feedback, or partnership inquiry? Our team is ready to help. Reach out and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <div className="page-container" style={{ position: 'relative', zIndex: 20, marginBottom: '4rem', marginTop: '-4rem' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map(({ icon: Icon, label, value, detail }) => (
            <div key={label} className="glass-card" style={{ borderRadius: '1.5rem', padding: '2rem', border: '1px solid var(--green-100)', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-400)'; e.currentTarget.style.transform = 'translateY(-8px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--green-100)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Icon style={{ width: 28, height: 28, color: 'var(--emerald-dk)' }} />
              </div>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-dk)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy)' }}>{value}</p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form + FAQ */}
      <section className="section-transparent" style={{ padding: '4rem 0 10rem' }}>
        <div className="page-container grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form */}
          <div className="glass-card" style={{ padding: '3.5rem', borderRadius: '2rem', border: '1px solid var(--green-100)' }}>
            <h2 style={{ margin: '0 0 0.75rem', fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy)' }}>Send Us a Message</h2>
            <p style={{ margin: '0 0 3rem', color: 'var(--text-muted)', fontSize: '1.0625rem' }}>Fill out the form and our team will respond within 24 hours.</p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle style={{ width: 64, height: 64, color: 'var(--emerald)', margin: '0 auto 1.5rem' }} />
                <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>Message Sent!</h3>
                <p style={{ margin: '0 0 2rem', color: 'var(--text-muted)' }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  style={{ height: '3.5rem', padding: '0 2.5rem', background: 'var(--emerald)', color: '#fff', border: 'none', borderRadius: '1rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)' }}>Your Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe"
                      style={{ width: '100%', height: '3.5rem', padding: '0 1.25rem', borderRadius: '1rem', border: '1.5px solid var(--green-100)', fontSize: '0.9375rem', transition: 'all 0.2s' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)' }}>Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@example.com"
                      style={{ width: '100%', height: '3.5rem', padding: '0 1.25rem', borderRadius: '1rem', border: '1.5px solid var(--green-100)', fontSize: '0.9375rem', transition: 'all 0.2s' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)' }}>Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} required placeholder="How can we help?"
                    style={{ width: '100%', height: '3.5rem', padding: '0 1.25rem', borderRadius: '1rem', border: '1.5px solid var(--green-100)', fontSize: '0.9375rem', transition: 'all 0.2s' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)' }}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell us more..."
                    style={{ width: '100%', padding: '1.25rem', borderRadius: '1.25rem', border: '1.5px solid var(--green-100)', fontSize: '0.9375rem', transition: 'all 0.2s', resize: 'none' }}
                  />
                </div>
                <button type="submit"
                  style={{ height: '3.75rem', padding: '0 2.5rem', background: 'var(--emerald)', color: '#fff', border: 'none', borderRadius: '1rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 20px rgba(16,185,129,0.2)' }}
                >
                  Send Message <ArrowRight style={{ width: 18, height: 18 }} />
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{ margin: '0 0 1rem', fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy)' }}>Frequently Asked Questions</h2>
            <p style={{ margin: '0 0 3.5rem', color: 'var(--text-muted)', fontSize: '1.0625rem' }}>Find quick answers to common questions below.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {faqs.map(({ q, a }) => (
                <details key={q} style={{ background: '#fff', border: '1.5px solid var(--green-100)', borderRadius: '1.5rem', overflow: 'hidden' }}>
                  <summary style={{ padding: '1.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {q} <span style={{ color: 'var(--emerald)', fontSize: '1.5rem' }}>+</span>
                  </summary>
                  <div style={{ padding: '0 1.5rem 1.5rem', fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.7, borderTop: '1px solid var(--green-50)', paddingTop: '1.25rem' }}>
                    {a}
                  </div>
                </details>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{ marginTop: '3.5rem', height: 250, background: 'var(--green-50)', borderRadius: '2rem', border: '1.5px solid var(--green-100)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <MapPin style={{ width: 40, height: 40, color: 'var(--emerald)', marginBottom: '1rem' }} />
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--navy)' }}>Find us at</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>123 Learning Ave, San Francisco, CA</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

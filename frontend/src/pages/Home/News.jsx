import React from 'react';
import { Megaphone, Calendar, Tag, ArrowRight, BookOpen, Star, Info, Zap } from 'lucide-react';

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Welcome to EduVault: Your New Learning Journey Starts Here",
    description: "We are thrilled to launch our brand-new Learning Management System! EduVault is designed to provide a seamless, interactive, and modern learning experience for students and lecturers alike. Explore the features and start your journey today.",
    date: "March 20, 2026",
    category: "Announcement",
    icon: <BookOpen className="text-emerald-500" />,
    type: "news"
  },
  {
    id: 2,
    title: "Introducing 'Free Exams': Sharpen Your Skills at No Cost!",
    description: "Testing your knowledge has never been easier. Our new 'Free Exam' feature allows students to take practice tests across various subjects without any enrollment fees. Get instant feedback and improve your grades.",
    date: "March 18, 2026",
    category: "Feature",
    icon: <Zap className="text-amber-500" />,
    type: "news"
  },
  {
    id: 3,
    title: "Learn on the Go: EduVault Mobile App Now Available",
    description: "Don't let your learning stop when you're away from your desk. The EduVault mobile app is now available for both iOS and Android. Download today and access your courses anytime, anywhere.",
    date: "March 15, 2026",
    category: "Update",
    icon: <Megaphone className="text-blue-500" />,
    type: "news"
  },
  {
    id: 4,
    title: "Congratulations to our Top Students of March 2026!",
    description: "We are proud to recognize the outstanding achievements of our top-performing students this month. Your hard work and dedication to excellence are an inspiration to the entire EduVault community.",
    date: "March 12, 2026",
    category: "Achievement",
    icon: <Star className="text-yellow-500" />,
    type: "news"
  },
  {
    id: 5,
    title: "Upcoming Live Session: Mastering React in 2026",
    description: "Join our industry-expert lecturers for an exclusive live webinar on the latest trends in React development. Learn best practices, performance optimization, and the future of web technologies.",
    date: "March 10, 2026",
    category: "Event",
    icon: <Calendar className="text-purple-500" />,
    type: "news"
  },
  {
    id: 6,
    title: "Now Live: Advanced AI & Machine Learning Specialization",
    description: "Dive deep into the world of artificial intelligence with our newest specialization track. Designed by PhD experts, this course covers everything from neural networks to ethical AI implementation.",
    date: "March 08, 2026",
    category: "Course",
    icon: <Info className="text-indigo-500" />,
    type: "news"
  },
  {
    id: 7,
    title: "Security Update: New Multi-Factor Authentication for All Users",
    description: "Your data security is our top priority. We've implemented enhanced multi-factor authentication (MFA) to ensure your student or lecturer account remains protected. Please update your profile settings today.",
    date: "March 05, 2026",
    category: "Security",
    icon: <Tag className="text-red-500" />,
    type: "news"
  },
  {
    id: 8,
    title: "EduVault Partners with Global Tech Universities for Certification",
    description: "We are excited to announce new partnerships with leading international universities. Our certifications are now internationally recognized, providing you with even more value for your career growth.",
    date: "March 02, 2026",
    category: "Partnership",
    icon: <Star className="text-emerald-600" />,
    type: "news"
  },
  {
    id: 9,
    title: "Unlock Unlimited Access with our Premium Subscription",
    description: "Upgrade to EduVault Premium today and get unlimited access to all courses, exclusive workshops, and prioritized support. Start your 7-day free trial now and take your education to the next level!",
    date: "Ad",
    category: "Promoted",
    icon: <Zap className="text-emerald-500" />,
    type: "ad"
  },
  {
    id: 10,
    title: "Join the EduVault Global Community Forum",
    description: "Connect with thousands of fellow learners from around the world. Share projects, ask questions, and collaborate on exciting new ideas in our official community forum.",
    date: "February 28, 2026",
    category: "Community",
    icon: <BookOpen className="text-blue-600" />,
    type: "news"
  },
  {
    id: 11,
    title: "Whitepaper: The Future of E-Learning in Higher Education",
    description: "Download our latest research paper on how digital platforms are transforming the educational landscape. Gain insights into future trends and the role of LMS in modern degrees.",
    date: "February 25, 2026",
    category: "Research",
    icon: <Info className="text-gray-500" />,
    type: "news"
  },
  {
    id: 12,
    title: "From Student to Software Engineer: Meet Lakshitha's Journey",
    description: "Read how Lakshitha Prasad utilized EduVault resources to land a dream job at a top tech firm. An inspiring story of perseverance and the power of online learning.",
    date: "February 22, 2026",
    category: "Success Story",
    icon: <Star className="text-pink-500" />,
    type: "news"
  },
  {
    id: 13,
    title: "5 Tips for Staying Productive While Learning Remotely",
    description: "Struggling to manage your time? Check out our latest guide on maintaining focus and productivity while taking online courses. Simple hacks for a better learning routine.",
    date: "February 18, 2026",
    category: "Guides",
    icon: <Zap className="text-teal-500" />,
    type: "news"
  },
  {
    id: 14,
    title: "Meet Our New Expert Instructors from Silicon Valley",
    description: "We're expanding our faculty with some of the brightest minds in the industry. Welcome our new instructors who bring decades of experience from companies like Google and Meta.",
    date: "February 15, 2026",
    category: "Faculty",
    icon: <Megaphone className="text-orange-500" />,
    type: "news"
  },
  {
    id: 15,
    title: "Need Help? Our 24/7 Support Center is Ready to Assist",
    description: "Have a question about a course or technical issue? Our dedicated support team is available around the clock to ensure your learning journey is as smooth as possible.",
    date: "February 10, 2026",
    category: "Support",
    icon: <Megaphone className="text-blue-400" />,
    type: "news"
  }
];

export default function News() {
  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '4rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Latest <span style={{ color: '#10b981' }}>News & Updates</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Stay informed with the latest announcements, educational trends, and advertisements from the EduVault community.
          </p>
        </div>

        {/* News Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {NEWS_ITEMS.map((item) => (
            <div 
              key={item.id}
              style={{ 
                backgroundColor: item.type === 'ad' ? '#f0fdf4' : '#fff', 
                borderRadius: '1.5rem', 
                padding: '2rem', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                border: item.type === 'ad' ? '2px dashed #10b981' : '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  backgroundColor: item.type === 'ad' ? '#fff' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {item.icon}
                </div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  color: item.type === 'ad' ? '#059669' : '#64748b',
                  backgroundColor: item.type === 'ad' ? '#d1fae5' : '#f1f5f9',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {item.category}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', lineHeight: 1.4 }}>
                {item.title}
              </h3>
              
              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.8125rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} /> {item.date}
                </span>
                <button style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#10b981', 
                  fontWeight: 600, 
                  fontSize: '0.875rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  cursor: 'pointer' 
                }}>
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{ 
          marginTop: '6rem', 
          backgroundColor: '#111827', 
          borderRadius: '2rem', 
          padding: '4rem', 
          textAlign: 'center', 
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Never Miss an Update</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2.5rem', fontSize: '1.125rem' }}>Subscribe to our newsletter and stay up to date with the latest from EduVault.</p>
            <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={{ 
                  flex: 1, 
                  padding: '1rem 1.5rem', 
                  borderRadius: '0.75rem', 
                  border: '1px solid #374151', 
                  backgroundColor: '#1f2937',
                  color: '#fff'
                }} 
              />
              <button style={{ 
                padding: '1rem 2rem', 
                backgroundColor: '#10b981', 
                color: '#fff', 
                fontWeight: 700, 
                borderRadius: '0.75rem', 
                border: 'none',
                cursor: 'pointer'
              }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

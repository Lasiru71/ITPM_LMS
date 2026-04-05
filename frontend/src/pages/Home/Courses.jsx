import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Star, Clock, User, ArrowRight } from 'lucide-react';
import { MOCK_COURSES } from '../../constants/Home/mockData';
import { getAllCourses } from '../../api/Jeewani/courseApi';
import CourseCard from '../../components/Home/CourseCard';
import '../../Styles/Home/Home.css';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Web Development', 'Data Science', 'Mobile Development', 'Design', 'Business'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const customCourses = await getAllCourses();
        // Combine mock courses and custom courses
        // Note: custom courses from localStorage might need mapping to match MOCK_COURSES structure
        const combined = [...MOCK_COURSES, ...customCourses.map(c => ({
            id: c._id,
            title: c.title,
            instructor: c.instructorName || 'Lecturer',
            price: c.price,
            image: c.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
            thumbnail: c.thumbnail,
            rating: 4.5,
            reviews: 10,
            category: c.category || 'General',
            level: 'All Levels'
        }))];
        setCourses(combined);
        setFilteredCourses(combined);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses(MOCK_COURSES);
        setFilteredCourses(MOCK_COURSES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = courses;
    if (searchTerm) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(c => c.category === selectedCategory);
    }
    setFilteredCourses(result);
  }, [searchTerm, selectedCategory, courses]);

  return (
    <div className="home-page-bg" style={{ minHeight: '100vh', padding: '2rem 0 6rem' }}>
       {/* Background Blobs */}
       <div className="blob blob-1" style={{ top: '10%', left: '-10%' }} />
       <div className="blob blob-2" style={{ top: '40%', right: '-5%' }} />

      <div className="page-container">
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-dk)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Explore</span>
          <h1 style={{ margin: '0.5rem 0 1rem', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>
            Our <span style={{ color: 'var(--emerald)' }}>Courses</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: 600, margin: '0 auto' }}>
            Choose from over 200+ expert-led courses and start your learning journey today.
          </p>
        </header>

        {/* Filters and Search Bar */}
        <div style={{ 
          background: '#fff', 
          padding: '1.5rem', 
          borderRadius: '1.5rem', 
          boxShadow: 'var(--shadow-md)', 
          border: '1px solid var(--green-100)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          alignItems: 'center',
          marginBottom: '3.5rem'
        }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', width: 20, height: 20 }} />
            <input 
              type="text" 
              placeholder="Search courses, instructors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                height: '3.5rem', 
                padding: '0 1rem 0 3rem', 
                borderRadius: '1rem', 
                border: '1.5px solid var(--green-100)', 
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--emerald)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--green-100)'}
            />
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{ 
                  whiteSpace: 'nowrap',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s',
                  background: selectedCategory === cat ? 'var(--emerald)' : 'var(--green-50)',
                  color: selectedCategory === cat ? '#fff' : 'var(--emerald-dk)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid var(--green-100)', borderTopColor: 'var(--emerald)', borderRadius: '50%', margin: '0 auto 1.5rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
            {filteredCourses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '2rem', border: '1px solid var(--green-100)' }}>
            <BookOpen style={{ width: 64, height: 64, color: 'var(--green-200)', margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>No courses found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              style={{ marginTop: '1.5rem', color: 'var(--emerald)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:1100px){.courses-grid{grid-template-columns:repeat(2,1fr)!important;}}
        @media(max-width:550px){.courses-grid{grid-template-columns:1fr!important;}}
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

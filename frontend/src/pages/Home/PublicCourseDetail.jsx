import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronRight, 
  Play, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Globe, 
  Users, 
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lock,
  CreditCard,
  ArrowLeft
} from 'lucide-react';

const API_BASE = "http://localhost:5000/api/courses";

const PublicCourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Try local storage first (consistent with the app's current logic)
        const localCourses = JSON.parse(localStorage.getItem("courses") || "[]");
        const localCourse = localCourses.find(c => c._id === id || c.id === id);

        if (localCourse) {
          setCourse(localCourse);
          setLoading(false);
          // Auto-expand first module
          if (localCourse.modules?.length > 0) {
            setExpandedModules({ 0: true });
          }
          return;
        }

        const response = await axios.get(`${API_BASE}/${id}`);
        setCourse(response.data);
        if (response.data.modules?.length > 0) {
          setExpandedModules({ 0: true });
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
    window.scrollTo(0, 0);
  }, [id]);

  const toggleModule = (index) => {
    setExpandedModules(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium animate-pulse">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Not Found</h2>
          <p className="text-slate-500 mb-8">We couldn't find the course you're looking for. It may have been removed or the link is incorrect.</p>
          <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
            <ArrowLeft size={18} /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalModules = course.modules?.length || 0;
  const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
  const coursePrice = (course.price === 0 || course.price === "0" || course.price === 'Free' || !course.price) ? 'Free' : `$${course.price}`;

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-12 pb-24 md:pb-32 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/10 blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-start relative z-10">
          <div className="md:col-span-8">
            <div className="flex items-center gap-2 mb-6">
              <Link to="/courses" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-sm font-medium transition-colors">
                Courses
              </Link>
              <ChevronRight size={14} className="text-slate-500" />
              <span className="text-slate-400 text-sm">{course.category || 'Professional Development'}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
              {course.title}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl leading-relaxed">
              {course.description || course.shortDescription || "Master the core concepts and advanced techniques in this comprehensive curriculum designed for career-ready skills."}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Language</p>
                  <p className="text-sm font-medium">English</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Students</p>
                  <p className="text-sm font-medium">1.2k+ Enrolled</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Certificate</p>
                  <p className="text-sm font-medium">Included</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Access</p>
                  <p className="text-sm font-medium">Lifetime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 mt-[-80px] md:mt-[-120px] pb-24">
        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Left Column - Details */}
          <div className="md:col-span-8 space-y-8">
            
            {/* Learning Outcomes */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Expert instruction from industry professionals",
                  "Hands-on projects and real-world applications",
                  "Quizzes and assessments to track progress",
                  "Step-by-step guidance on complex topics",
                  "Lifetime access to all course materials",
                  "Verifiable professional certificate upon completion"
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5">
                      <ShieldCheck size={14} />
                    </div>
                    <p className="text-slate-600 text-[15px]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content / Documents Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Course Content</h2>
                  <p className="text-slate-500 text-sm">Explore all the structured learning materials for this course.</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                  <div className="flex flex-col items-center border-r border-slate-200 pr-3">
                    <span className="text-lg font-bold text-slate-800 leading-tight">{totalModules}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Modules</span>
                  </div>
                  <div className="flex flex-col items-center pl-1">
                    <span className="text-lg font-bold text-emerald-600 leading-tight">{totalLessons}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Lessons</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module, mIndex) => (
                    <div key={mIndex} className="border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300">
                      <button 
                        className={`w-full flex items-center justify-between p-5 text-left transition-colors ${expandedModules[mIndex] ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
                        onClick={() => toggleModule(mIndex)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${expandedModules[mIndex] ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {mIndex + 1}
                          </div>
                          <div>
                            <h3 className="text-slate-900 font-bold">{module.title}</h3>
                            <span className="text-xs text-slate-400 font-medium">{module.lessons?.length || 0} Lessons</span>
                          </div>
                        </div>
                        {expandedModules[mIndex] ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                      </button>
                      
                      {expandedModules[mIndex] && (
                        <div className="border-t border-slate-100 p-2 space-y-1">
                          {module.lessons && module.lessons.length > 0 ? (
                            module.lessons.map((lesson, lIndex) => (
                              <div 
                                key={lIndex} 
                                className="group flex items-center justify-between p-3.5 hover:bg-emerald-50 rounded-xl transition-all cursor-default"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                                    {lesson.type === 'video' ? <Play size={16} fill="currentColor" /> : <FileText size={16} />}
                                  </div>
                                  <div>
                                    <h4 className="text-[14px] font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                                      {lesson.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{lesson.type}</span>
                                      {lesson.duration && (
                                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                          <Clock size={10} /> {lesson.duration}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-slate-300">
                                  <Lock size={16} />
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-slate-400 text-sm italic py-12">
                              This module doesn't have any lessons yet.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">No Content Added Yet</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">The instructor is currently building this curriculum. Check back soon for updates!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Instructor</h2>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 overflow-hidden shadow-lg border-2 border-white">
                   <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructorName || course.instructor || "Instructor")}&background=random&size=200`} 
                    alt="Instructor" 
                    className="w-full h-full object-cover"
                   />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{course.instructorName || course.instructor || "Lead Instructor"}</h3>
                  <p className="text-emerald-600 font-bold text-sm mb-2">Subject Matter Expert</p>
                  <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                    With over 10 years of experience in {course.category || 'this field'}, our lead instructor brings practical knowledge and industry insights to every lesson.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Card */}
          <div className="md:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 group/sidebar">
              {/* Preview Image */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={course.image || course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop"} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover/sidebar:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
                   <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg transform scale-90 group-hover/sidebar:scale-100 transition-transform">
                     <Play fill="currentColor" className="ml-1" />
                   </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-600 text-xs font-black uppercase tracking-widest rounded-full shadow-sm">
                    Premium Course
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{coursePrice}</span>
                  {course.price > 0 && <span className="text-slate-400 line-through text-lg">$199.99</span>}
                </div>
                
                <div className="space-y-4 mb-8">
                  <Link 
                    to={`/payment/${course._id || id}`}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-center shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 group/pay"
                  >
                    <CreditCard size={20} className="group-hover/pay:rotate-12 transition-transform" />
                    ENROLL NOW
                  </Link>
                  
                  <button className="w-full py-4 px-6 border-2 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 text-slate-700 rounded-2xl font-bold transition-all">
                    Free Preview
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm py-2 border-b border-dashed border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2 font-medium"><Clock size={16} /> Total Duration</span>
                    <span className="text-slate-900 font-bold">12h 45m</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-b border-dashed border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2 font-medium"><Users size={16} /> Students</span>
                    <span className="text-slate-900 font-bold">1,245+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2">
                    <span className="text-slate-500 flex items-center gap-2 font-medium"><Award size={16} /> Certificate</span>
                    <span className="text-slate-900 font-bold">Verifiable</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-4">Secure Payment Options</p>
                  <div className="flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                    <div className="w-10 h-6 bg-slate-400 rounded-sm"></div>
                    <div className="w-10 h-6 bg-slate-400 rounded-sm"></div>
                    <div className="w-10 h-6 bg-slate-400 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PublicCourseDetail;

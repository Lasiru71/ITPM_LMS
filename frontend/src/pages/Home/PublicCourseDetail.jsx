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
  ArrowLeft,
  CircleCheck,
  Zap,
  Trophy
} from 'lucide-react';

const API_BASE = "http://localhost:5000/api/courses";

const PublicCourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  const [isEnrolled, setIsEnrolled] = useState(false); // Default to not enrolled

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const localCourses = JSON.parse(localStorage.getItem("courses") || "[]");
        const localCourse = localCourses.find(c => c._id === id || c.id === id);

        // Mock check for enrollment (could be from localStorage or API)
        const userEnrollments = JSON.parse(localStorage.getItem("enrolled_courses") || "[]");
        if (userEnrollments.includes(id)) {
          setIsEnrolled(true);
        }

        if (localCourse) {
          setCourse(localCourse);
          setLoading(false);
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

  const handleLessonClick = (lesson) => {
    if (!isEnrolled) {
      alert("🔒 Access Denied: This content is locked. Please enroll in the course to access videos and documents.");
      // Option to scroll to enrollment section
      const enrollButton = document.getElementById('enroll-section');
      if (enrollButton) enrollButton.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    // Proceed to view lesson
    console.log("Viewing lesson:", lesson.title);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Course Not Found</h2>
          <Link to="/courses" className="text-emerald-600 font-bold">Back to Course List</Link>
        </div>
      </div>
    );
  }

  const totalModules = course.modules?.length || 0;
  const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
  const coursePrice = (course.price === 0 || course.price === "0" || course.price === 'Free' || !course.price) ? 'Free' : `$${course.price}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20">
      
      {/* Dark Hero - Classic Style */}
      <div className="bg-[#0f172a] text-white pt-16 pb-32 px-4 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-start relative z-10">
          <div className="md:col-span-8">
            <div className="flex items-center gap-2 mb-6 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <span>Courses</span>
              <ChevronRight size={14} />
              <span>{course.category || 'Professional Development'}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              {course.title || "DSA Mastery"}
            </h1>
            
            <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              {course.description || course.shortDescription || "Gain industry-ready skills with our professional curriculum lead by expert instructors."}
            </p>
            
            <div className="flex flex-wrap gap-8 pt-2">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-slate-400 font-bold" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] leading-none mb-1">Language</span>
                  <span className="text-sm font-bold">English</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] leading-none mb-1">Students</span>
                  <span className="text-sm font-bold">1,245+ Enrolled</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] leading-none mb-1">Status</span>
                  <span className="text-sm font-bold">Accredited</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <Clock size={18} className="text-slate-400" />
                 <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] leading-none mb-1">Access</span>
                  <span className="text-sm font-bold">Lifetime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping Feature Boxes - Precisely as in the user screenshot */}
      <div className="max-w-7xl mx-auto px-4 mt-[-60px] relative z-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Adaptive Learning", desc: "Quizzes and assessments that adjust to your pace.", icon: <Award className="text-emerald-500" /> },
            { title: "Expert Support", desc: "Direct guidance on complex topics from mentors.", icon: <Zap className="text-blue-500" /> },
            { title: "Lifetime Access", desc: "Never lose access to your learning materials.", icon: <ShieldCheck className="text-amber-500" /> },
            { title: "Verified Status", desc: "Get a professional certificate upon completion.", icon: <Trophy className="text-teal-500" /> }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 hover:shadow-xl transition-all">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                {React.cloneElement(item.icon, { size: 18 })}
              </div>
              <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight">{item.title}</h4>
              <p className="text-slate-500 text-[10px] leading-relaxed font-semibold">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 mt-12 mb-32">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-8 space-y-10">
            
            {/* Course Content - Classic Success Style */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Course Content</h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">Structured learning path for this course.</p>
                </div>
                <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="px-5 py-2 text-center">
                    <span className="block text-sm font-black text-slate-900">{totalModules}</span>
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Modules</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200 mt-2"></div>
                  <div className="px-5 py-2 text-center">
                    <span className="block text-sm font-black text-slate-900">{totalLessons}</span>
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Lessons</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module, mIndex) => (
                    <div key={mIndex} className={`bg-white border border-slate-100 rounded-3xl overflow-hidden transition-all duration-300 ${expandedModules[mIndex] ? 'shadow-md border-emerald-50' : ''}`}>
                      <button 
                        className={`w-full flex items-center justify-between p-6 text-left ${expandedModules[mIndex] ? 'bg-slate-50/50' : 'bg-white hover:bg-slate-50/30'}`}
                        onClick={() => toggleModule(mIndex)}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${expandedModules[mIndex] ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-500'}`}>
                            {mIndex + 1}
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase">{module.title}</h3>
                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{module.lessons?.length || 0} Lessons Included</span>
                          </div>
                        </div>
                        {expandedModules[mIndex] ? <ChevronUp size={18} className="text-emerald-500" /> : <ChevronDown size={18} className="text-slate-300" />}
                      </button>
                      
                      {expandedModules[mIndex] && (
                        <div className="px-6 pb-6 pt-2 space-y-2 border-t border-slate-50">
                          {module.lessons && module.lessons.length > 0 ? (
                            module.lessons.map((lesson, lIndex) => (
                              <div 
                                key={lIndex} 
                                onClick={() => handleLessonClick(lesson)}
                                className={`flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 transition-all group ${!isEnrolled ? 'opacity-70 cursor-not-allowed' : 'hover:border-emerald-100 cursor-pointer'}`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-colors ${!isEnrolled ? 'text-slate-300' : 'text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50'}`}>
                                    {lesson.type === 'video' ? <Play size={14} fill="currentColor" /> : <FileText size={14} />}
                                  </div>
                                  <div>
                                    <h4 className="text-[13px] font-bold text-slate-700">{lesson.title}</h4>
                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{lesson.type} • {lesson.duration || "15 mins"}</span>
                                  </div>
                                </div>
                                <div className={`${!isEnrolled ? 'text-slate-300' : 'text-slate-100'}`}>
                                  {isEnrolled ? <CircleCheck size={14} className="text-emerald-500" /> : <Lock size={14} />}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-slate-400 text-xs italic">Upcoming lessons.</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-16 text-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-black text-slate-400">Curriculum Coming Soon</h3>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor - High Contrast & Visible */}
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">Meet Your Instructor</h2>
              <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center font-black text-white border border-slate-800 text-2xl shadow-xl">
                   {course.instructorName ? course.instructorName.charAt(0) : "I"}
                   {course.instructorName ? course.instructorName.charAt(1) : ""}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950 leading-none mb-2">{course.instructorName || "Principal Instructor"}</h3>
                  <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Master Course Lecturer</p>
                  <p className="text-slate-700 text-[13px] leading-relaxed max-w-lg font-medium">
                    "Bringing real-world industry experience directly to your screen, simplifying complex concepts for every learner through expert-led sessions."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Classic Polished */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit" id="enroll-section">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-white">
              <div className="relative aspect-video group">
                <img 
                  src={course.image || course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop"} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                   <div className="w-14 h-14 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-xl">
                     <Play size={20} fill="currentColor" />
                   </div>
                </div>
              </div>
              
              <div className="p-10">
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{coursePrice}</span>
                  {course.price > 0 && <span className="text-slate-500 line-through font-bold text-lg decoration-slate-400">$199.99</span>}
                </div>
                
                <div className="space-y-4 mb-10">
                  <Link 
                    to={`/payment/${course._id || id}`}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-center shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <CreditCard size={20} />
                    ENROLL NOW
                  </Link>
                  <button className="w-full py-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-2xl font-black text-[10px] tracking-widest hover:bg-slate-100 transition-all uppercase">
                    Launch Sneak Peek
                  </button>
                </div>
                
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] block mb-2">Specifications</span>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold flex items-center gap-2"><Clock size={16} /> Total Load</span>
                    <span className="text-slate-900 font-black">12.5 Hours</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-dashed border-slate-100">
                    <span className="text-slate-500 font-bold flex items-center gap-2"><Users size={16} /> Students</span>
                    <span className="text-slate-900 font-black">1,500+</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-dashed border-slate-100">
                    <span className="text-slate-500 font-bold flex items-center gap-2"><Award size={16} /> Certificate</span>
                    <span className="text-emerald-600 font-black">Included</span>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Certified Secure Payments</p>
                  <div className="flex justify-center gap-3">
                    <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black text-[#1A1F71] border border-slate-100 italic tracking-tighter">VISA</div>
                    <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black flex items-center gap-0.5 border border-slate-100">
                      <span className="text-[#EB001B]">Master</span><span className="text-[#F79E1B]">card</span>
                    </div>
                    <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black text-[#003087] border border-slate-100 italic">PayPal</div>
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

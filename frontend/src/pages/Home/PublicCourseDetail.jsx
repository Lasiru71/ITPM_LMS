import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronRight, Play, FileText, Clock, ShieldCheck, Globe, Users, Award,
  BookOpen, ChevronDown, ChevronUp, Lock, CreditCard, CircleCheck, Zap, Trophy,
  Download, Image as ImageIcon, Book
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const PublicCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Fetch course details from DB
        const courseRes = await axios.get(`${API_BASE}/courses/${id}`);
        const fetchedCourse = courseRes.data;
        setCourse(fetchedCourse);
        if (fetchedCourse.modules?.length > 0) setExpandedModules({ 0: true });

        // 2. Check enrollment via payment records
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const payRes = await axios.get(`${API_BASE}/payments`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const payments = Array.isArray(payRes.data) ? payRes.data : payRes.data?.payments || [];
            const enrolled = payments.some(p =>
              (String(p.courseId) === String(id) || String(p.courseId?._id) === String(id)) &&
              (p.status === 'APPROVED' || p.status === 'COMPLETED' || p.status === 'PENDING')
            );
            setIsEnrolled(enrolled);
          }
        } catch (_) {
          // Not logged in or payment check failed — treat as not enrolled
        }

        // 3. Fetch lecture materials (visible to all, access gated)
        try {
          const token = localStorage.getItem('token');
          const matRes = await axios.get(`${API_BASE}/sadeepa/materials`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          setMaterials(Array.isArray(matRes.data) ? matRes.data : []);
        } catch (_) {
          setMaterials([]);
        }

      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    window.scrollTo(0, 0);
  }, [id]);

  const toggleModule = (index) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleLessonClick = (lesson) => {
    if (!isEnrolled) {
      const el = document.getElementById('enroll-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    alert(`Opening: ${lesson.title}`);
  };

  const handleMaterialAccess = (material) => {
    if (!isEnrolled) {
      alert("Payment Required: Please book this course to view and download the lecture materials.");
      const el = document.getElementById('enroll-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    if (material.fileData) {
      const link = document.createElement('a');
      link.href = material.fileData;
      link.download = material.title || 'material_download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`No file attached to: ${material.title}`);
    }
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
  const coursePrice = (!course.price || course.price === 0) ? 'Free' : `$${course.price}`;

  const typeIcon = (type) => {
    if (type === 'video') return <Play size={14} fill="currentColor" />;
    if (type === 'Book') return <Book size={14} />;
    return <FileText size={14} />;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20">

      {/* Dark Hero */}
      <div className="bg-[#0f172a] text-white pt-16 pb-32 px-4 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-start relative z-10">
          <div className="md:col-span-8">
            <div className="flex items-center gap-2 mb-6 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Link to="/courses" className="hover:text-emerald-300">Courses</Link>
              <ChevronRight size={14} />
              <span>{course.category || 'General'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{course.title}</h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              {course.description || course.shortDescription || "Gain industry-ready skills with expert instructors."}
            </p>
            <div className="flex flex-wrap gap-8 pt-2">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Language</span>
                  <span className="text-sm font-bold">{course.language || 'English'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Level</span>
                  <span className="text-sm font-bold">{course.level || 'All Levels'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Lessons</span>
                  <span className="text-sm font-bold">{totalLessons} Lessons</span>
                </div>
              </div>
              {isEnrolled && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
                  <CircleCheck size={16} className="text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-bold">Enrolled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Boxes */}
      <div className="max-w-7xl mx-auto px-4 mt-[-60px] relative z-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Adaptive Learning", desc: "Assessments that adjust to your pace.", icon: <Award className="text-emerald-500" /> },
            { title: "Expert Support", desc: "Direct guidance from mentors.", icon: <Zap className="text-blue-500" /> },
            { title: "Lifetime Access", desc: "Never lose access to your materials.", icon: <ShieldCheck className="text-amber-500" /> },
            { title: "Verified Certificate", desc: "Get certified upon completion.", icon: <Trophy className="text-teal-500" /> }
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-12 mb-32">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-8 space-y-10">

            {/* Course Curriculum */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Course Curriculum</h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Structured learning path</p>
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

              {!isEnrolled && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                  <Lock size={18} className="text-amber-500 flex-shrink-0" />
                  <p className="text-sm text-amber-700 font-semibold">
                    <strong>Book Now</strong> to unlock all lessons and lecture materials.
                  </p>
                  <Link to={`/payment/${id}`} className="ml-auto shrink-0 px-4 py-2 bg-emerald-500 text-white text-xs font-black rounded-xl hover:bg-emerald-600 transition">
                    Book Now
                  </Link>
                </div>
              )}

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
                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{module.lessons?.length || 0} Lessons</span>
                          </div>
                        </div>
                        {expandedModules[mIndex] ? <ChevronUp size={18} className="text-emerald-500" /> : <ChevronDown size={18} className="text-slate-300" />}
                      </button>

                      {expandedModules[mIndex] && (
                        <div className="px-6 pb-6 pt-2 space-y-2 border-t border-slate-50">
                          {module.lessons && module.lessons.length > 0 ? module.lessons.map((lesson, lIndex) => (
                            <div
                              key={lIndex}
                              onClick={() => handleLessonClick(lesson)}
                              className={`flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 transition-all group ${!isEnrolled ? 'cursor-pointer opacity-80' : 'hover:border-emerald-100 cursor-pointer'}`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-colors ${!isEnrolled ? 'text-slate-300' : 'text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50'}`}>
                                  {isEnrolled ? typeIcon(lesson.type) : <Lock size={14} />}
                                </div>
                                <div>
                                  <h4 className="text-[13px] font-bold text-slate-700">{lesson.title}</h4>
                                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{lesson.type} • {lesson.duration || '15 mins'}</span>
                                </div>
                              </div>
                              <div>
                                {isEnrolled ? <CircleCheck size={14} className="text-emerald-500" /> : <Lock size={14} className="text-slate-300" />}
                              </div>
                            </div>
                          )) : (
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

            {/* Lecture Materials Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <FileText size={18} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Lecture Materials</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Books, PDFs &amp; Documents</p>
                </div>
              </div>

              {!isEnrolled && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                  <Lock size={18} className="text-amber-500 flex-shrink-0" />
                  <p className="text-sm text-amber-700 font-semibold">
                    Enroll to download and access all lecture materials.
                  </p>
                </div>
              )}

              {materials.length === 0 ? (
                <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <FileText size={40} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400 font-semibold text-sm">No materials uploaded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.map((material, idx) => (
                    <div
                      key={material._id || idx}
                      onClick={() => handleMaterialAccess(material)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                        isEnrolled
                          ? 'border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20'
                          : 'border-slate-100 opacity-75'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {material.image
                          ? <img src={material.image} alt="" className="w-full h-full object-cover" />
                          : <FileText size={20} className="text-slate-400" />
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${!isEnrolled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{material.title}</p>
                        <p className={`text-xs truncate max-w-xs ${!isEnrolled ? 'text-slate-300 line-through' : 'text-slate-400'}`}>{material.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold">{material.type}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold">{material.category}</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {isEnrolled
                          ? <Download size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                          : <Lock size={16} className="text-slate-300" />
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">Meet Your Instructor</h2>
              <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center font-black text-white text-2xl shadow-xl">
                  {(course.instructor || course.instructorName || 'I').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950 leading-none mb-2">{course.instructor || course.instructorName || 'Principal Instructor'}</h3>
                  <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Course Lecturer</p>
                  <p className="text-slate-700 text-[13px] leading-relaxed max-w-lg font-medium">
                    "Bringing real-world industry experience directly to your screen, simplifying complex concepts for every learner."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit" id="enroll-section">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-white">
              <div className="relative aspect-video group">
                <img
                  src={course.thumbnail || course.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop"}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-8">
                {isEnrolled ? (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                    <CircleCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <p className="font-black text-emerald-700 text-sm">You're Enrolled!</p>
                    <p className="text-xs text-emerald-600 mt-1">You have full access to all course content.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">{coursePrice}</span>
                    </div>
                    <div className="space-y-3 mb-8">
                      <Link
                        to={`/payment/${course._id || id}`}
                        className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-center shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <CreditCard size={20} />
                        BOOK NOW
                      </Link>
                    </div>
                  </>
                )}

                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] block">Course Includes</span>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold flex items-center gap-2"><BookOpen size={16} /> Modules</span>
                    <span className="text-slate-900 font-black">{totalModules}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-dashed border-slate-100 pt-3">
                    <span className="text-slate-500 font-bold flex items-center gap-2"><FileText size={16} /> Lessons</span>
                    <span className="text-slate-900 font-black">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-dashed border-slate-100 pt-3">
                    <span className="text-slate-500 font-bold flex items-center gap-2"><Download size={16} /> Materials</span>
                    <span className="text-slate-900 font-black">{materials.length} Files</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-dashed border-slate-100 pt-3">
                    <span className="text-slate-500 font-bold flex items-center gap-2"><Award size={16} /> Certificate</span>
                    <span className="text-emerald-600 font-black">Included</span>
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

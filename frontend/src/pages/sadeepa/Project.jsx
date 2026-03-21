import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Book, DollarSign, Upload, Users, Download, Calendar, ArrowDownToLine, FileText, Loader2, Search, PlusCircle, X, ArrowLeft, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business', 'Literature', 'History', 'Other'];

const SAMPLE_MATERIALS = [
  { _id: 's1', title: 'Introduction to Algorithms', description: 'Comprehensive guide to algorithms and data structures.', category: 'Computer Science', type: 'Book', uploadDate: '2023-10-12', downloads: 1240, image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80', fileData: '#' },
  { _id: 's2', title: 'Calculus Early Transcendentals', description: 'Essential mathematics textbook for engineering and science.', category: 'Mathematics', type: 'PDF', uploadDate: '2023-11-05', downloads: 856, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80', fileData: '#' },
  { _id: 's3', title: 'Quantum Physics For Beginners', description: 'Simple breakdown of complex quantum mechanics concepts.', category: 'Physics', type: 'Document', uploadDate: '2024-01-20', downloads: 342, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80', fileData: '#' },
  { _id: 's4', title: 'Organic Chemistry Basics', description: 'Fundamental principles of organic chemistry and reactions.', category: 'Chemistry', type: 'Book', uploadDate: '2023-09-15', downloads: 654, image: 'https://images.unsplash.com/photo-1603126856736-66bbf7586528?w=400&q=80', fileData: '#' },
  { _id: 's5', title: 'Molecular Biology Insights', description: 'Detailed notes on genetics and cellular structures.', category: 'Biology', type: 'PDF', uploadDate: '2024-02-10', downloads: 128, image: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=400&q=80', fileData: '#' },
  { _id: 's6', title: 'Thermodynamics Engineering', description: 'Advanced thermodynamics concepts and real-world applications.', category: 'Engineering', type: 'Book', uploadDate: '2023-12-01', downloads: 912, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80', fileData: '#' },
  { _id: 's7', title: 'Modern Business Management', description: 'Corporate strategies, leadership, and market analysis.', category: 'Business', type: 'PDF', uploadDate: '2023-08-22', downloads: 1540, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80', fileData: '#' },
  { _id: 's8', title: 'Classic World Literature', description: 'Analysis of prominent literary works across history.', category: 'Literature', type: 'Document', uploadDate: '2024-01-05', downloads: 215, image: 'https://images.unsplash.com/photo-1476275466078-4007374efac4?w=400&q=80', fileData: '#' },
  { _id: 's9', title: 'Global World History', description: 'Timeline and events shaping modern civilization.', category: 'History', type: 'Book', uploadDate: '2023-07-11', downloads: 765, image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80', fileData: '#' },
  { _id: 's10', title: 'Machine Learning Fundamentals', description: 'Neural networks, deep learning, and data models.', category: 'Computer Science', type: 'PDF', uploadDate: '2024-03-01', downloads: 3012, image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=80', fileData: '#' },
  { _id: 's11', title: 'Linear Algebra Applications', description: 'Matrix operations and vector spaces.', category: 'Mathematics', type: 'Book', uploadDate: '2023-10-30', downloads: 440, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80', fileData: '#' },
  { _id: 's12', title: 'Electromagnetism Principles', description: 'Notes on electric fields and magnetic forces.', category: 'Physics', type: 'PDF', uploadDate: '2024-02-18', downloads: 673, image: 'https://images.unsplash.com/photo-1620508127814-2ec5272a5611?w=400&q=80', fileData: '#' },
  { _id: 's13', title: 'Financial Accounting Standards', description: 'Principles of accounting and financial reporting.', category: 'Business', type: 'Document', uploadDate: '2023-11-20', downloads: 1120, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80', fileData: '#' },
  { _id: 's14', title: 'Civil Engineering Materials', description: 'Properties of concrete, steel, and composites.', category: 'Engineering', type: 'Book', uploadDate: '2023-09-05', downloads: 589, image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80', fileData: '#' },
  { _id: 's15', title: 'Astrophysics Overview', description: 'Understanding stars, galaxies, and the expanding universe.', category: 'Other', type: 'PDF', uploadDate: '2024-01-29', downloads: 405, image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80', fileData: '#' },
];

const SAMPLE_PROJECTS = [
  { _id: 'p1', title: 'E-Commerce Website with React', author: 'Alex Thompson', uploadDate: '2/25/2024', category: 'Computer Science', viewsCount: 145, downloadCount: 52, description: 'Full-stack e-commerce platform with shopping cart, payment integration, and admin panel. Built using React, Node.js, and MongoDB.', languages: ['React', 'Node.js', 'MongoDB', 'Full-stack'] },
  { _id: 'p2', title: 'Climate Change Data Analysis', author: 'Maria Garcia', uploadDate: '2/23/2024', category: 'Mathematics', viewsCount: 98, downloadCount: 22, description: 'Statistical analysis of global temperature data over the past century. Includes visualizations and predictions using Python and Pandas.', languages: ['Python', 'Data Science', 'Statistics'] },
  { _id: 'p3', title: 'IoT Home Automation System', author: 'James Wilson', uploadDate: '2/20/2024', category: 'Engineering', viewsCount: 176, downloadCount: 45, description: 'A smart home system controlling lights, temperature, and security via a mobile app and ESP32 microcontrollers.', languages: ['IoT', 'Arduino', 'C++', 'Mobile'] },
  { _id: 'p4', title: 'Healthcare Patient Portal', author: 'Emma Watson', uploadDate: '2/01/2024', category: 'Business', viewsCount: 112, downloadCount: 41, description: 'A comprehensive system for tracking patient records, appointments, and billing in a clinic setting. Secure and HIPPA compliant.', languages: ['Healthcare', 'Database', 'Admin', 'Web'] },
  { _id: 'p5', title: 'Stock Market Predictor', author: 'Mathisha Perera', uploadDate: '3/05/2024', category: 'Data Science', viewsCount: 178, downloadCount: 65, description: 'Machine learning model that predicts stock trends based on historical data and sentiment analysis from social media feeds.', languages: ['Data Science', 'ML', 'Python', 'Finance'] },
];

export default function Project() {
  const [activeTab, setActiveTab] = useState('Home');
  const [projectSubView, setProjectSubView] = useState('List'); // 'List' or 'Upload'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dbMaterials, setDbMaterials] = useState([]);
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    author: '',
    category: 'Computer Science',
    uploadDate: new Date().toISOString().split('T')[0],
    languages: '',
    fileData: ''
  });

  const [previews, setPreviews] = useState({ file: null });

  useEffect(() => {
    if (activeTab === 'Browse Materials') {
      fetchMaterials();
    } else if (activeTab === 'Student Projects') {
      fetchProjects();
    }
  }, [activeTab]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/sadeepa/materials');
      setDbMaterials(res.data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/sadeepa/projects');
      setDbProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description || !projectForm.author || !projectForm.fileData) {
      alert('Please fill in all required fields and upload a project file');
      return;
    }

    setSubmitting(true);
    try {
      const formattedLanguages = projectForm.languages.split(',').map(tag => tag.trim()).filter(t => t);
      await axios.post('http://localhost:5000/api/sadeepa/projects/upload', {
        ...projectForm,
        languages: formattedLanguages
      });
      alert('Project uploaded successfully!');
      setProjectSubView('List');
      setProjectForm({
        title: '',
        description: '',
        author: '',
        category: 'Computer Science',
        uploadDate: new Date().toISOString().split('T')[0],
        languages: '',
        fileData: ''
      });
      setPreviews({ file: null });
      fetchProjects();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectForm(prev => ({ ...prev, fileData: reader.result }));
        setPreviews({ file: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectAction = async (id, action) => {
    if (id.startsWith('p')) return; // Sample data doesn't update counts on backend
    try {
      await axios.patch(`http://localhost:5000/api/sadeepa/projects/${id}/${action}`);
    } catch (error) {
      console.error(`Failed to increment ${action}:`, error);
    }
  };

  const allMaterials = [...dbMaterials, ...SAMPLE_MATERIALS];
  const allProjects = [...dbProjects, ...SAMPLE_PROJECTS];

  const filteredMaterials = selectedCategory === 'All' 
    ? allMaterials 
    : allMaterials.filter(m => m.category === selectedCategory);

  const filteredProjects = selectedCategory === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.category === selectedCategory);

  const handleDownload = (fileData, title, type) => {
    if (!fileData || fileData === '#') {
       alert(`Requesting ${title} download... (Sample Data)`);
       return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = `${title}.${type.toLowerCase() === 'pdf' ? 'pdf' : 'zip'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Sub-Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EduVault</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 ml-6 mt-1">
             {['Home', 'Browse Materials', 'Student Projects'].map(tab => (
               <button 
                  key={tab}
                  onClick={() => { setActiveTab(tab); setProjectSubView('List'); }} 
                  className={`text-sm font-semibold transition-all ${activeTab === tab ? 'text-emerald-600 border-b-[3px] border-emerald-500 pb-1' : 'text-slate-600 hover:text-emerald-600 border-b-[3px] border-transparent pb-1'}`}
               >
                  {tab}
               </button>
             ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      {activeTab === 'Home' && (
        <div className="animate-in fade-in duration-500">
          <div className="text-white py-28 px-6 md:px-16 lg:px-32 flex flex-col items-start justify-center" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #312e81 100%)' }}>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight mb-10 max-w-4xl leading-tight">Your Gateway to Educational Excellence</h1>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => setActiveTab('Browse Materials')} className="px-6 py-3 bg-white text-blue-700 font-bold rounded-md shadow-md hover:bg-slate-50 transition-colors text-sm tracking-wide">Browse Materials</button>
              <button onClick={() => { setActiveTab('Student Projects'); setProjectSubView('Upload'); }} className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-blue-700 transition-colors text-sm tracking-wide">Upload Your Project</button>
            </div>
          </div>

          {/* Features Cards Section */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setActiveTab('Browse Materials')}>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                   <Book size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-wide">Vast Library</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">Access books, PDFs, and notes across all major subjects.</p>
                <div className="mt-4 text-xs font-semibold text-blue-600 hover:underline">Explore collections →</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-6">
                   <DollarSign size={24} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-wide">Free & Premium</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">Choose from free resources or invest in premium content.</p>
                <div className="mt-4 text-xs font-semibold text-emerald-600 cursor-pointer hover:underline">View pricing plans →</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => { setActiveTab('Student Projects'); setProjectSubView('Upload'); }}>
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-6">
                   <Upload size={24} className="text-purple-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-wide">Share Projects</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">Upload your academic projects and help others learn.</p>
                <div className="mt-4 text-xs font-semibold text-purple-600 hover:underline">Start uploading →</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                   <Users size={24} className="text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-wide">No Barriers</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">No sign-up required. Access and download materials instantly.</p>
                <div className="mt-4 text-xs font-semibold text-orange-500 cursor-pointer hover:underline">Learn more →</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Browse Materials' && (
        <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Browse Materials</h2>
          <p className="text-slate-500 mb-10 text-lg">Access a wide range of academic resources curated for your success.</p>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8 sticky top-[80px] z-40 backdrop-blur-md bg-white/90">
            <div className="flex flex-wrap items-center gap-3">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl border transition-all ${
                    selectedCategory === category ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-4 ring-slate-900/10' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMaterials.map(material => (
              <div key={material._id} className="group bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                  {material.image && <img src={material.image} alt={material.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />}
                  <div className="absolute top-4 left-4 font-bold bg-white/90 px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider">{material.category}</div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">{material.title}</h3>
                  <p className="text-[13px] text-slate-500 mb-8 line-clamp-3 leading-relaxed">{material.description}</p>
                  <div className="mt-auto flex items-center justify-between text-[11px] font-bold text-slate-400 mb-5 uppercase tracking-wider">
                     <div className="flex items-center gap-1.5"><Calendar size={14}/> {material.uploadDate}</div>
                     <div className="flex items-center gap-1.5"><ArrowDownToLine size={14}/> {material.downloads} DLs</div>
                  </div>
                  <button onClick={() => handleDownload(material.fileData, material.title, material.type)} className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-slate-100">
                    <Download size={18} /> Download Resource
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Student Projects' && (
        <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
          {projectSubView === 'List' ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                 <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Student Projects</h2>
                 <button 
                   onClick={() => setProjectSubView('Upload')}
                   className="h-14 px-8 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2"
                 >
                   <PlusCircle size={20} /> Upload Your Project
                 </button>
              </div>

              {/* Categories Filter Block */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8">
                <div className="flex flex-wrap items-center gap-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 text-[13px] font-bold rounded-lg border transition-all ${
                        selectedCategory === category ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm font-bold text-slate-400 mb-8 px-2 uppercase tracking-widest">Showing {filteredProjects.length} results</p>

              <div className="space-y-4">
                {filteredProjects.map(project => (
                  <div key={project._id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-300" 
                       onMouseEnter={() => handleProjectAction(project._id, 'view')}>
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                       <span className="px-3 py-1 rounded-full border border-slate-200 text-[10px] font-medium text-slate-500 uppercase tracking-tight">{project.category}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-[12px] text-slate-500 mb-4">
                       <div className="flex items-center gap-1"><Users size={14} className="text-slate-400"/> {project.author}</div>
                       <div className="flex items-center gap-1"><Calendar size={14} className="text-slate-400"/> {project.uploadDate}</div>
                       <div className="flex items-center gap-1"><Search size={14} className="text-slate-400"/> {project.viewsCount} views</div>
                    </div>

                    <p className="text-slate-600 text-[13px] leading-relaxed mb-4">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.languages.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">{tag}</span>
                      ))}
                    </div>

                    <button 
                      onClick={() => { handleDownload(project.fileData, project.title, 'zip'); handleProjectAction(project._id, 'download'); }}
                      className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2 text-[13px] w-fit"
                    >
                      <Download size={16} /> Download Project
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto py-12 animate-in slide-in-from-bottom duration-500">
               <button onClick={() => setProjectSubView('List')} className="flex items-center gap-2 text-slate-600 font-bold hover:text-emerald-500 transition-all mb-10 group">
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
               </button>

               <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
                  <div className="bg-slate-900 p-12 text-white">
                     <h2 className="text-4xl font-extrabold mb-4">Upload New Project</h2>
                     <p className="text-slate-400 text-lg">Share your code and findings with the global student community.</p>
                  </div>

                  <form onSubmit={handleUploadProject} className="p-12 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Project Name</label>
                           <input type="text" placeholder="e.g. Modern E-Commerce Landing" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                        </div>
                        <div className="space-y-3">
                           <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Your Name (Author)</label>
                           <input type="text" placeholder="e.g. Alex Thompson" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" value={projectForm.author} onChange={e => setProjectForm({...projectForm, author: e.target.value})} />
                        </div>
                        <div className="space-y-3">
                           <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Material Section (Category)</label>
                           <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 appearance-none bg-white" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})}>
                              {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Upload Date Selection</label>
                           <input type="date" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10" value={projectForm.uploadDate} onChange={e => setProjectForm({...projectForm, uploadDate: e.target.value})} />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                           <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Coding Languages / Technologies</label>
                           <input type="text" placeholder="e.g. React, Node.js, Python, Tailwind" className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10" value={projectForm.languages} onChange={e => setProjectForm({...projectForm, languages: e.target.value})} />
                           <p className="text-[11px] text-slate-400 font-bold uppercase pl-2">Separate with commas</p>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                           <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Project Description</label>
                           <textarea rows={4} placeholder="What makes your project unique?" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                           <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block mb-3">Project File Submission</label>
                           <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center hover:bg-emerald-50/20 hover:border-emerald-500 transition-all cursor-pointer relative group">
                              <input type="file" required id="project-file-upload" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                              <div className="space-y-4">
                                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto group-hover:bg-emerald-100 transition-colors">
                                    <FileText size={40} className="text-slate-400 group-hover:text-emerald-600" />
                                 </div>
                                 <div>
                                    <p className="text-xl font-bold text-slate-900">{previews.file || 'Select your project bundle'}</p>
                                    <p className="text-slate-500 font-medium">Drag & drop or browse computer (.zip, .pdf supported)</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-slate-100 flex justify-end">
                        <button type="submit" disabled={submitting} className="h-16 px-12 bg-emerald-500 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center gap-3 disabled:opacity-50">
                           {submitting ? 'Processing Upload...' : <><CheckCircle2 size={24}/> Publish Project Now</>}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

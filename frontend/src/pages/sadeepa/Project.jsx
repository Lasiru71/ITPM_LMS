import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Book, DollarSign, Upload, Users } from 'lucide-react';

export default function Project() {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Sub-Navbar Specific to Project Page */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EduVault</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 ml-6 mt-1">
             <button 
                onClick={() => setActiveTab('Home')} 
                className={`text-sm font-semibold transition-all ${activeTab === 'Home' ? 'text-emerald-600 border-b-[3px] border-emerald-500 pb-1' : 'text-slate-600 hover:text-emerald-600 border-b-[3px] border-transparent pb-1'}`}
             >
                Home
             </button>
             <button 
                onClick={() => setActiveTab('Browse Materials')} 
                className={`text-sm font-semibold transition-all ${activeTab === 'Browse Materials' ? 'text-emerald-600 border-b-[3px] border-emerald-500 pb-1' : 'text-slate-600 hover:text-emerald-600 border-b-[3px] border-transparent pb-1'}`}
             >
                Browse Materials
             </button>
             <button 
                onClick={() => setActiveTab('Student Projects')} 
                className={`text-sm font-semibold transition-all ${activeTab === 'Student Projects' ? 'text-emerald-600 border-b-[3px] border-emerald-500 pb-1' : 'text-slate-600 hover:text-emerald-600 border-b-[3px] border-transparent pb-1'}`}
             >
                Student Projects
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area rendering conditionally based on Tab */}
      {activeTab === 'Home' && (
        <div className="animate-in fade-in duration-500">
          {/* Hero Section */}
          <div 
            className="text-white py-28 px-6 md:px-16 lg:px-32 flex flex-col items-start justify-center"
            style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #312e81 100%)' }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight mb-10 max-w-4xl leading-tight">
              Your Gateway to Educational Excellence
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setActiveTab('Browse Materials')}
                className="px-6 py-3 bg-white text-blue-700 font-bold rounded-md shadow-md hover:bg-slate-50 transition-colors text-sm tracking-wide"
              >
                Browse Materials
              </button>
              <button 
                onClick={() => setActiveTab('Student Projects')}
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-blue-700 transition-colors text-sm tracking-wide"
              >
                Upload Your Project
              </button>
            </div>
          </div>

          {/* Features Cards Section */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                   <Book size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-wide">Vast Library</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                  Access books, PDFs, and notes across all major subjects and disciplines
                </p>
                <div className="mt-4 text-xs font-semibold text-blue-600 cursor-pointer hover:underline">Explore collections →</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-6">
                   <DollarSign size={24} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-wide">Free & Premium</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                  Choose from free resources or invest in premium content for deep learning
                </p>
                <div className="mt-4 text-xs font-semibold text-emerald-600 cursor-pointer hover:underline">View pricing plans →</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-6">
                   <Upload size={24} className="text-purple-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-wide">Share Projects</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                  Upload your academic projects and help other students learn from your work
                </p>
                <div className="mt-4 text-xs font-semibold text-purple-600 cursor-pointer hover:underline" onClick={() => setActiveTab('Student Projects')}>Start uploading →</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                   <Users size={24} className="text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-wide">No Barriers</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                  No sign-up required. Access and download materials instantly
                </p>
                <div className="mt-4 text-xs font-semibold text-orange-500 cursor-pointer hover:underline">Learn more →</div>
              </div>

            </div>
          </div>
        </div>
      )}

      {activeTab === 'Browse Materials' && (
        <div className="max-w-7xl mx-auto px-6 py-24 animate-in fade-in duration-500">
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
            <BookOpen size={48} className="mx-auto text-emerald-500 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Browse Materials Portal</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Our comprehensive collection of course materials, research documents, and textbooks will be structured here for easy filtering and downloading.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'Student Projects' && (
        <div className="max-w-7xl mx-auto px-6 py-24 animate-in fade-in duration-500">
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
            <Upload size={48} className="mx-auto text-blue-500 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Student Projects & Portfolio</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Explore projects collaboratively built by your colleagues, or upload your own to gain traction and contribute to the community.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Submit New Project
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

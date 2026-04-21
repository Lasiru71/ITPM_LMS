import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, Book, Trash2, Plus, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../Lasiru/ToastProvider';

const CATEGORIES = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business', 'Literature', 'History', 'Other'];
const TYPES = ['Book', 'PDF', 'Document'];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function MaterialUpload() {
  const { showToast } = useToast();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Helper to get auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Computer Science',
    type: 'PDF',
    image: '',
    fileData: ''
  });

  const [previews, setPreviews] = useState({
    image: null,
    file: null
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/sadeepa/materials`, getAuthHeader());
      setMaterials(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      showToast('error', 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (field === 'image' && !file.type.startsWith('image/')) {
      showToast('error', 'Please upload an image file for the thumbnail');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result }));
      setPreviews(prev => ({ ...prev, [field]: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.fileData) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/sadeepa/materials/upload`, formData, getAuthHeader());
      showToast('success', 'Material uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        category: 'Computer Science',
        type: 'PDF',
        image: '',
        fileData: ''
      });
      setPreviews({ image: null, file: null });
      fetchMaterials();
    } catch (error) {
      console.error("Upload error:", error);
      showToast('error', 'Failed to upload material');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/sadeepa/materials/${id}`, getAuthHeader());
      showToast('success', 'Material deleted successfully');
      fetchMaterials();
    } catch (error) {
      console.error("Delete error:", error);
      showToast('error', 'Failed to delete material');
    }
  };


  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Upload Form Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Plus size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Upload New Material</h2>
            <p className="text-sm text-slate-500">Add books, PDFs or documents to the library.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Material Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Advanced Calculus Guide"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category Section *</label>
              <select 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description *</label>
              <textarea 
                rows={3}
                placeholder="Briefly describe the contents of this material..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Material Type *</label>
              <div className="flex gap-4">
                {TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({...formData, type: t})}
                    className={`flex-1 py-2.5 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      formData.type === t 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {t === 'Book' && <Book size={16} />}
                    {t === 'PDF' && <FileText size={16} />}
                    {t === 'Document' && <FileText size={16} />}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Upload Thumbnail</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleFileChange(e, 'image')}
                  className="hidden" 
                  id="image-upload" 
                />
                <label 
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer text-slate-500 font-medium"
                >
                  <ImageIcon size={18} />
                  {previews.image || 'Choose image...'}
                </label>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Material File *</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={e => handleFileChange(e, 'fileData')}
                  className="hidden" 
                  id="file-upload" 
                />
                <label 
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center gap-2 w-full py-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/10 transition-all cursor-pointer group"
                >
                  <div className="p-3 bg-slate-50 rounded-full group-hover:bg-emerald-50 transition-colors">
                    <Upload size={24} className="text-slate-400 group-hover:text-emerald-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">{previews.file || 'Click to select material file'}</p>
                    <p className="text-xs text-slate-500 mt-1">Supported formats: PDF, Word (.doc, .docx)</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={submitting}
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Uploading...' : (
                <>
                  <CheckCircle size={18} />
                  Complete Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Materials List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Recently Uploaded Materials</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Material</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materials.map(m => (
                <tr key={m._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        {m.image ? (
                          <img src={m.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{m.title}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{m.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
                      {m.category}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                      {m.type === 'Book' ? <Book size={14} /> : <FileText size={14} />}
                      {m.type}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-500">
                    {new Date(m.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(m._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {materials.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <AlertCircle size={32} />
                      <p className="font-medium">No materials uploaded yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

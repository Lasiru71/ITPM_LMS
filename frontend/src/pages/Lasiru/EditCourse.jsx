import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
  BookOpen, ImageIcon, DollarSign, Tag, Layers, ArrowLeft, Save, Eye, Upload, Loader2, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useCourseStore } from '@/stores/courseStore';
import { CATEGORIES } from '@/constants/Home/mockData';
import { LEVELS } from '@/constants/Home/config';
import { useToast } from '../../components/Lasiru/ToastProvider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import * as courseApi from '../../api/Jeewani/courseApi';

const LESSON_TYPES = [
  { value: 'video', label: 'Video' },
  { value: 'text', label: 'Text' },
  { value: 'ppt', label: 'PPT' },
  { value: 'assignment', label: 'Assignment' }
];

const PLACEHOLDER_THUMBNAILS = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=450&fit=crop'
];

function createEmptyLesson() {
  return {
    id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: '',
    type: 'video',
    duration: '10m',
    isPreview: false
  };
}

function createEmptyModule() {
  return {
    id: `mod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: '',
    lessons: [createEmptyLesson()],
    isExpanded: true
  };
}

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { updateCourse, isLoading } = useCourseStore();
  const { showToast } = useToast();

  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [language, setLanguage] = useState('English');
  const [modules, setModules] = useState([createEmptyModule()]);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadCourse() {
      try {
        const course = await courseApi.getCourseById(id);
        if (course) {
          setTitle(course.title || '');
          setDescription(course.description || '');
          setShortDescription(course.shortDescription || '');
          setThumbnailUrl(course.thumbnail || '');
          setCategory(course.category || '');
          setLevel(course.level || 'Beginner');
          setPrice(course.price?.toString() || '');
          setOriginalPrice(course.originalPrice?.toString() || '');
          setLanguage(course.language || 'English');
          
          if (course.modules && course.modules.length > 0) {
            setModules(course.modules.map(m => ({ ...m, isExpanded: false })));
          }
        } else {
          showToast('error', 'Course not found.');
          navigate('/lecturer-dashboard');
        }
      } catch (err) {
        showToast('error', 'Failed to load course details.');
      } finally {
        setLoadingInitial(false);
      }
    }
    loadCourse();
  }, [id]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold">Please log in to edit a course</h2>
        <Link to="/login" className="mt-4 text-emerald-600 hover:underline">Go to Login</Link>
      </div>
    );
  }

  if (loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-slate-600">Loading course...</h2>
      </div>
    );
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  const addModule = () => {
    setModules([...modules, createEmptyModule()]);
  };

  const removeModule = (moduleId) => {
    if (modules.length <= 1) return;
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  const updateModule = (moduleId, field, value) => {
    setModules(modules.map((m) => m.id === moduleId ? { ...m, [field]: value } : m));
  };

  const toggleModuleExpand = (moduleId) => {
    setModules(modules.map((m) => m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m));
  };

  const addLesson = (moduleId) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, createEmptyLesson()] } : m
      )
    );
  };

  const removeLesson = (moduleId, lessonId) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          if (m.lessons.length <= 1) return m;
          return { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) };
        }
        return m;
      })
    );
  };

  const updateLesson = (moduleId, lessonId, field, value) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, [field]: value } : l)
          };
        }
        return m;
      })
    );
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setThumbnailUrl(event.target.result);
          if (errors.thumbnailUrl) setErrors({ ...errors, thumbnailUrl: "" });
          showToast("success", "Image pasted from clipboard!");
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('error', 'Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailUrl(event.target.result);
        if (errors.thumbnailUrl) setErrors({ ...errors, thumbnailUrl: "" });
        showToast('success', 'Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Course title is required.';
    } else if (title.trim().length < 5 || title.trim().length > 50) {
      newErrors.title = 'Course title must be between 5 and 50 characters.';
    } else if (/[@$#%]/.test(title)) {
      newErrors.title = 'Course title cannot contain symbols like @, $, #, or %.';
    }

    if (!shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required.';
    } else if (shortDescription.trim().length < 20 || shortDescription.trim().length > 200) {
      newErrors.shortDescription = 'Short description must be between 20 and 200 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Long description is required.';
    } else if (description.trim().length < 100) {
      newErrors.description = 'Long description must be at least 100 characters.';
    }

    if (!category) newErrors.category = 'Please select a category.';
    if (!price || Number(price) < 0) newErrors.price = 'Please enter a valid price.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast('error', Object.values(newErrors)[0]);
      return false;
    }

    for (const mod of modules) {
      if (!mod.title.trim()) {
        showToast('error', `Module "${mod.id}" needs a title.`);
        return false;
      }
      for (const lesson of mod.lessons) {
        if (!lesson.title.trim()) {
          showToast('error', `All lessons in "${mod.title || 'Untitled Module'}" must have a title.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const courseModules = modules.map((m) => ({
      id: m.id,
      title: m.title,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        duration: l.duration,
        isPreview: l.isPreview
      }))
    }));

    const updatedCourseData = {
      _id: id,
      title: title.trim(),
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      thumbnail: thumbnailUrl.trim() || PLACEHOLDER_THUMBNAILS[Math.floor(Math.random() * PLACEHOLDER_THUMBNAILS.length)],
      category,
      level,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      duration: `${totalLessons * 10}m`,
      totalLessons,
      language,
      modules: courseModules
    };

    try {
      await updateCourse(updatedCourseData);
      showToast('success', `"${updatedCourseData.title}" has been updated successfully.`);
      setIsSuccess(true);
    } catch (err) {
      showToast('error', 'Failed to update course. Please try again.');
    }
  };

  const thumbnailPreview = thumbnailUrl.trim() || PLACEHOLDER_THUMBNAILS[0];

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-in zoom-in-95 duration-500 text-center space-y-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-emerald-200 p-12 mt-12 max-w-2xl mx-auto shadow-sm">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative size-24 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200">
            <CheckCircle2 size={48} />
          </div>
        </div>
        
        <div className="space-y-3 max-w-md">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Update Successful!</h2>
          <p className="text-lg text-slate-500 font-medium">
            Your course <span className="text-emerald-600 font-bold">"{title}"</span> has been successfully updated.
          </p>
        </div>

        <Button 
          size="lg" 
          onClick={() => navigate('/lecturer-dashboard')} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 rounded-2xl h-16 font-black text-xl shadow-2xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 bg-slate-50 min-h-screen p-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border mb-6">
          <Button variant="outline" onClick={() => setPreviewMode(false)} className="gap-2 rounded-xl">
            <ArrowLeft className="size-4" /> Back to Editor
          </Button>
          <div className="flex gap-3">
             <Button onClick={handleSubmit} disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20">
              <Save className="size-4 mr-2" /> {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-xl">
          <div className="aspect-video w-full overflow-hidden">
            <img src={thumbnailPreview} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1">{category || 'Category'}</Badge>
              <Badge variant="outline" className="px-3 py-1">{level}</Badge>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{title || 'Untitled Course'}</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">{shortDescription || 'Your course summary will appear here.'}</p>
            
            <div className="flex items-center gap-4 py-6 border-y border-slate-50">
              <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                {user.avatar ? <img src={user.avatar} className="size-full rounded-full object-cover" /> : <BookOpen size={24} />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">Instructor</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Price</p>
                <p className="text-2xl font-black text-emerald-600">${price || '0'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Lessons</p>
                <p className="text-2xl font-black text-slate-800">{totalLessons}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Language</p>
                <p className="text-xl font-bold text-slate-800">{language}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lecturer-dashboard')} className="rounded-full bg-slate-100 hover:bg-slate-200">
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Course</h1>
              <p className="text-slate-500 mt-1 font-medium">Update your course contents, pricing, and details.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setPreviewMode(true)} className="rounded-xl text-slate-600 hover:bg-slate-50 border border-slate-200">
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs Content ... Reused exactly from CourseCreationForm ... */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-14 p-1.5 bg-slate-100/50 rounded-2xl mb-8 border border-slate-100 shadow-sm">
            <TabsTrigger value="basic" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md font-bold transition-all h-full">Basic Info</TabsTrigger>
            <TabsTrigger value="curriculum" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md font-bold transition-all h-full">Curriculum</TabsTrigger>
            <TabsTrigger value="pricing" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md font-bold transition-all h-full">Pricing & Level</TabsTrigger>
            <TabsTrigger value="preview" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md font-bold transition-all h-full" onClick={() => setPreviewMode(true)}>Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={18} className="text-emerald-500" />
                    <h3 className="font-bold text-slate-800">General Information</h3>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Course Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[@$#%]/g, '');
                        setTitle(val);
                        if(errors.title) setErrors({...errors, title: ''});
                      }}
                      placeholder="e.g., Master Advanced React Hooks"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} focus:outline-none focus:ring-2 transition-all font-medium`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1 ml-1">{errors.title}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium bg-white"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Short Description</label>
                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(e) => {
                        setShortDescription(e.target.value);
                        if(errors.shortDescription) setErrors({...errors, shortDescription: ''});
                      }}
                      placeholder="A brief summary for potential students"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.shortDescription ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} focus:outline-none focus:ring-2 transition-all font-medium`}
                    />
                    {errors.shortDescription && <p className="text-red-500 text-xs mt-1 ml-1">{errors.shortDescription}</p>}
                  </div>
                   <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Long Description</label>
                    <textarea
                      rows={6}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if(errors.description) setErrors({...errors, description: ''});
                      }}
                      placeholder="Detailed explanation of what students will learn..."
                      className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} focus:outline-none focus:ring-2 transition-all font-medium resize-none`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1 ml-1">{errors.description}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm border border-emerald-100/50">
                      <ImageIcon size={22} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Media & Tags</h3>
                  </div>

                  {/* Thumbnail Input */}
                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Thumbnail Media</label>
                      <input
                        type="text"
                        value={thumbnailUrl}
                        onChange={(e) => { setThumbnailUrl(e.target.value); if(errors.thumbnailUrl) setErrors({...errors, thumbnailUrl: ''}); }}
                        onPaste={handlePaste}
                        placeholder="Paste image URL or paste image here"
                        className={`w-full px-6 py-4 rounded-[20px] border-2 ${errors.thumbnailUrl ? 'border-red-200 focus:ring-red-100/50' : 'border-slate-100 focus:border-emerald-500/30'} focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-600 placeholder:text-slate-300 bg-slate-50/50`}
                      />
                    </div>

                    <div className="flex items-center gap-4 px-2">
                      <div className="h-[0.5px] flex-1 bg-slate-100"></div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">OR</span>
                      <div className="h-[0.5px] flex-1 bg-slate-100"></div>
                    </div>

                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => document.getElementById('thumbnail-upload-edit-page').click()}
                      className="w-full h-24 border-2 border-dashed border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/20 text-slate-500 hover:text-emerald-600 rounded-[24px] transition-all gap-4 bg-slate-50/30 group"
                    >
                      <div className="size-11 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload size={22} className="text-slate-400 group-hover:text-emerald-500" />
                      </div>
                      <span className="font-bold text-lg">Choose Local Image</span>
                    </Button>
                    
                    <input 
                      id="thumbnail-upload-edit-page"
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    
                    {errors.thumbnailUrl && <p className="text-red-500 text-xs mt-1 ml-1">{errors.thumbnailUrl}</p>}
                  </div>

                  {/* Preview */}
                  <div className="aspect-video rounded-[24px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                    {thumbnailUrl ? (
                      <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon size={40} className="mx-auto text-slate-300 mb-2 opacity-50" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Image preview</p>
                      </div>
                    )}
                  </div>

                  </div>
                </div>
              </div>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Course Content</h3>
                  <p className="text-sm text-slate-500 font-medium">Structure your course into logical modules and lessons.</p>
                </div>
                <Button onClick={addModule} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none rounded-xl px-5 font-bold transition-all">
                  <Plus size={18} className="mr-2" /> Add Module
                </Button>
              </div>

              <div className="space-y-4">
                {modules.map((mod, modIdx) => (
                  <div key={mod.id} className="group border border-slate-100 rounded-2xl overflow-hidden hover:border-emerald-200 transition-all hover:shadow-md bg-white">
                    <div className="flex items-center gap-4 p-5 bg-slate-50/50">
                      <div className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-emerald-300">
                        <GripVertical size={20} />
                      </div>
                      <div className="flex-1">
                         <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => updateModule(mod.id, 'title', e.target.value)}
                          placeholder={`Module ${modIdx + 1}: Title`}
                          className="bg-transparent border-none focus:ring-0 p-0 text-lg font-bold text-slate-800 placeholder:text-slate-400 w-full"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                         <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeModule(mod.id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                          title="Delete Module"
                        >
                          <Trash2 size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleModuleExpand(mod.id)}
                          className="text-slate-400 hover:text-emerald-500 rounded-full"
                        >
                          {mod.isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </Button>
                      </div>
                    </div>

                    {mod.isExpanded && (
                      <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-4 ml-6">
                           {mod.lessons.map((lesson, lessonIdx) => (
                            <div key={lesson.id} className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 rounded-xl border border-slate-50 bg-white shadow-sm hover:border-emerald-100 transition-all">
                               <div className="hidden md:block text-slate-300 font-black text-xl w-6 italic">{lessonIdx + 1}</div>
                               <div className="flex-1 min-w-[200px]">
                                 <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(mod.id, lesson.id, 'title', e.target.value)}
                                  placeholder="Lesson Title"
                                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-slate-700 placeholder:text-slate-400"
                                />
                               </div>
                               <div className="flex items-center gap-4">
                                  <select
                                    value={lesson.type}
                                    onChange={(e) => updateLesson(mod.id, lesson.id, 'type', e.target.value)}
                                    className="text-xs font-bold bg-slate-100 border-none rounded-lg px-3 py-1.5 focus:ring-emerald-500"
                                  >
                                    {LESSON_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                                  </select>
                                  <input
                                    type="text"
                                    value={lesson.duration}
                                    onChange={(e) => updateLesson(mod.id, lesson.id, 'duration', e.target.value)}
                                    placeholder="10m"
                                    className="w-16 text-xs text-center font-bold bg-slate-100 border-none rounded-lg py-1.5 focus:ring-emerald-500"
                                  />
                                   <label className="flex items-center gap-2 cursor-pointer group/label">
                                    <div className={`size-4 rounded border flex items-center justify-center transition-all ${lesson.isPreview ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                      {lesson.isPreview && <div className="size-2 bg-white rounded-full" />}
                                    </div>
                                    <input
                                      type="checkbox"
                                      className="hidden"
                                      checked={lesson.isPreview}
                                      onChange={(e) => updateLesson(mod.id, lesson.id, 'isPreview', e.target.checked)}
                                    />
                                    <span className="text-xs font-bold text-slate-500 group-hover/label:text-emerald-500">Preview</span>
                                  </label>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeLesson(mod.id, lesson.id)}
                                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                               </div>
                            </div>
                           ))}
                           <Button 
                            variant="ghost" 
                            onClick={() => addLesson(mod.id)} 
                            className="w-full border-2 border-dashed border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl h-12 transition-all font-bold"
                          >
                            <Plus size={16} className="mr-2" /> Add Lesson
                           </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
             </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={18} className="text-emerald-500" />
                    <h3 className="font-bold text-slate-800">Pricing Setting</h3>
                  </div>
                  <div className="space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Price ($)</label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="49.99"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-black text-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Original Price ($) - Optional</label>
                        <input
                          type="number"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          placeholder="99.99"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-400 font-bold"
                        />
                      </div>
                  </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <Layers size={18} className="text-emerald-500" />
                    <h3 className="font-bold text-slate-800">Knowledge Level</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {LEVELS.map(lvl => (
                      <div 
                        key={lvl} 
                        onClick={() => setLevel(lvl)}
                        className={`cursor-pointer p-4 rounded-xl border-2 text-center font-bold transition-all ${level === lvl ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-50 hover:border-slate-200 text-slate-500'}`}
                      >
                        {lvl}
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="animate-in fade-in duration-300">
            <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-6">
               <div className="size-20 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center">
                 <CheckCircle2 size={40} />
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-slate-800">Ready to Review?</h3>
                  <p className="text-slate-500 mt-2 max-w-sm">Take a look at how your course updates will appear before you save.</p>
               </div>
               <Button size="lg" onClick={() => setPreviewMode(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 rounded-xl h-14 font-black text-lg shadow-xl shadow-emerald-200">
                 View Live Preview
               </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import { Upload } from 'lucide-react';
import { useToast } from '../Lasiru/ToastProvider';

export default function CreateAssignment() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    endOfTime: '',
    fileData: null
  });
  
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('error', 'File size should not exceed 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          fileData: { filename: file.name, base64: reader.result }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) {
      showToast('error', 'Title and Deadline are required.');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        ...formData,
        type: 'Assignment',
        createdBy: user.email || 'lecturer@eduvault.com'
      };

      await axios.post('http://localhost:5000/api/sadeepa/assignments/create', payload);
      showToast('success', 'Assignment created successfully!');
      
      setFormData({ title: '', description: '', deadline: '', endOfTime: '', fileData: null });
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to create assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>Upload Assignment</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Assignment Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                   style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description / Instructions</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', minHeight: '80px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deadline</label>
            <input type="datetime-local" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} 
                   style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>End of Time (Late Submission)</label>
            <input type="datetime-local" value={formData.endOfTime} onChange={e => setFormData({...formData, endOfTime: e.target.value})} 
                   style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Upload Reference File (Optional, max 5MB)</label>
            <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              <input type="file" id="file-upload" onChange={handleFileChange} style={{ display: 'none' }} />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', color: '#3b82f6', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Upload size={24} style={{ marginBottom: '8px' }} />
                <span>{formData.fileData ? formData.fileData.filename : 'Click to select a file'}</span>
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
          <button type="submit" disabled={loading} style={{
            padding: '12px 24px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', 
            fontWeight: '600', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Publishing...' : 'Publish Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}

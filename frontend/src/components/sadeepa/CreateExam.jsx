import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '../Lasiru/ToastProvider';

export default function CreateExam() {
  const [formData, setFormData] = useState({
    title: '',
    timeLimit: '', // Time in minutes for the exam
    startTime: '', // Start Date & Time
  });
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const addQuestion = (type) => {
    const newQuestion = {
      type,
      questionText: '',
      points: 10,
      options: type === 'MCQ' ? ['', '', '', ''] : [],
      correctAnswer: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.timeLimit) {
      showToast('error', 'Title and Time duration are required.');
      return;
    }
    if (questions.length === 0) {
      showToast('error', 'Need at least one question.');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        ...formData,
        type: 'Exam', // Tell backend this is an Exam
        questions,
        createdBy: user.email || 'lecturer@eduvault.com'
      };

      await axios.post('http://localhost:5000/api/sadeepa/assignments/create', payload);
      showToast('success', 'Exam created successfully!');
      
          setFormData({ title: '', timeLimit: '', startTime: '' });
      setQuestions([]);
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to create Exam.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>Create MCQ / Essay Exam</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Exam Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                   style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Time for the Exam (minutes)</label>
            <input type="number" min="1" value={formData.timeLimit} onChange={e => setFormData({...formData, timeLimit: e.target.value})} 
                   style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Exam Start Date & Time</label>
            <input type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} 
                   style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Questions ({questions.length})</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => addQuestion('MCQ')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                <PlusCircle size={16} /> Add MCQ
              </button>
              <button type="button" onClick={() => addQuestion('Essay')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#f0fdf4', color: '#16a34a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                <PlusCircle size={16} /> Add Essay
              </button>
            </div>
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Question {qIndex + 1} ({q.type})</span>
                <button type="button" onClick={() => removeQuestion(qIndex)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              
              <input type="text" placeholder="Enter question text here..." value={q.questionText} onChange={e => updateQuestion(qIndex, 'questionText', e.target.value)}
                     style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '12px' }} required />
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '14px', color: '#4b5563', marginRight: '8px' }}>Points for this question:</label>
                <input type="number" value={q.points} onChange={e => updateQuestion(qIndex, 'points', Number(e.target.value))}
                       style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} min="1" />
              </div>

              {q.type === 'MCQ' && (
                <div style={{ paddingLeft: '16px', borderLeft: '3px solid #3b82f6' }}>
                  <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Options (Set Correct Answer below)</p>
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', width: '20px' }}>{String.fromCharCode(65 + oIndex)}</span>
                      <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                             style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} required />
                    </div>
                  ))}
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', marginRight: '12px' }}>Correct Answer:</label>
                    <select value={q.correctAnswer} onChange={e => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '200px' }} required>
                      <option value="">-- Select Correct Option --</option>
                      {q.options.map((opt, oIndex) => opt && (
                        <option key={oIndex} value={opt}>{String.fromCharCode(65 + oIndex)}: {opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
          <button type="submit" disabled={loading} style={{
            padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', 
            fontWeight: '600', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Publishing Exam...' : 'Publish Exam'}
          </button>
        </div>
      </form>
    </div>
  );
}

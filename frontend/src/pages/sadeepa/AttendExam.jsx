import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DownloadCloud, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '../../components/Lasiru/ToastProvider';

export default function AttendExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      showToast('error', 'Please log in to access the exam.');
      navigate('/login', { state: { from: `/exam-login/${id}` } });
      return;
    }

    const fetchExam = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/sadeepa/assignments/${id}`);
        setAssignment(response.data);
      } catch (error) {
        showToast('error', 'Failed to load assignment.');
        navigate('/exam-login');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id, navigate, showToast]);

  useEffect(() => {
    if (!assignment?.timeLimit) return;
    
    // We assume the timer starts when they open the exam page.
    let remaining = assignment.timeLimit * 60;
    setTimeLeft(remaining);

    const timerId = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);

      if (remaining === 60) {
        alert("Warning: Only 1 minute left to complete your exam!");
        showToast("warning", "Only 1 minute remaining!");
      }

      if (remaining <= 0) {
        clearInterval(timerId);
        showToast("error", "Time is up!");
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [assignment, showToast]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleDownloadAttachment = () => {
    if (assignment?.fileData?.base64) {
      const link = document.createElement('a');
      link.href = assignment.fileData.base64;
      link.download = assignment.fileData.filename || 'attachment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        showToast('error', 'Please upload a PDF or Word Document.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileToUpload({
          filename: file.name,
          base64: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    let formattedAnswers = [];

    if (assignment.title === 'Computer application Report Submission') {
      if (!fileToUpload) {
        showToast('error', 'Please upload your document before submitting.');
        return;
      }
      formattedAnswers = [{ questionId: '000000000000000000000000', answerText: JSON.stringify(fileToUpload) }];
    } else {
      formattedAnswers = Object.keys(answers).map(qId => ({ questionId: qId, answerText: answers[qId] }));
      if (formattedAnswers.length === 0) {
        showToast('error', 'Please answer at least one question.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        showToast('error', 'Authentication failed. Please log in again.');
        navigate('/login', { state: { from: `/exam-login/${id}` } });
        return;
      }
      
      const user = JSON.parse(userStr);
      const studentName = user.name;
      let studentId = user.studentId;
      if (!studentId) {
        if (studentName === 'TestStudent') {
          studentId = 'IT231112';
        } else if (studentName === 'Lakshitha Prasad') {
          studentId = 'IT235560';
        } else {
          studentId = 'IT238370';
        }
      }

      await axios.post('http://localhost:5000/api/sadeepa/assignments/submit', {
        assignmentId: id,
        studentId,
        studentName,
        answers: formattedAnswers
      });
      
      showToast('success', 'Assignment submitted successfully!');
      navigate('/exam-login');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !assignment) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Exam...</div>;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '32px 0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        
        <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#eff6ff' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a', margin: '0 0 12px 0' }}>{assignment.title}</h1>
          <p style={{ color: '#3b82f6', marginBottom: '20px' }}>{assignment.description}</p>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {assignment.startTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e40af', backgroundColor: '#fff', padding: '8px 16px', borderRadius: '6px' }}>
                <Clock size={16} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Starts: {new Date(assignment.startTime).toLocaleString()}</span>
              </div>
            )}
            {assignment.deadline && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e40af', backgroundColor: '#fff', padding: '8px 16px', borderRadius: '6px' }}>
                <Clock size={16} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Deadline: {new Date(assignment.deadline).toLocaleString()}</span>
              </div>
            )}
            {timeLeft !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: timeLeft <= 60 ? '#dc2626' : '#059669', backgroundColor: timeLeft <= 60 ? '#fee2e2' : '#d1fae5', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold' }}>
                <Clock size={16} />
                Timer: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            )}
            {assignment.endOfTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', backgroundColor: '#fef3c7', padding: '8px 16px', borderRadius: '6px' }}>
                <AlertTriangle size={16} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>End of Time: {new Date(assignment.endOfTime).toLocaleString()}</span>
              </div>
            )}
            {assignment.fileData?.filename && (
              <button onClick={handleDownloadAttachment} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                <DownloadCloud size={16} /> Download Attachment
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          {assignment.title === 'Computer application Report Submission' ? (
            <div style={{ marginBottom: '32px', backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Upload Your Report</h3>
              <p style={{ color: '#4b5563', marginBottom: '16px' }}>Please ensure your submission is in PDF or Document format.</p>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileUpload} 
                style={{ display: 'block', width: '100%', padding: '12px', border: '1px dashed #cbd5e1', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer' }}
              />
              {fileToUpload && <p style={{ marginTop: '12px', color: '#10b981', fontWeight: '500' }}>✓ File attached: {fileToUpload.filename}</p>}
            </div>
          ) : (
            assignment.questions.map((q, i) => (
              <div key={q._id} style={{ marginBottom: '32px', backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0' }}>
                  {i + 1}. {q.questionText} <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 'normal' }}>({q.points} points)</span>
                </h3>
              
              {q.type === 'MCQ' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {q.options.map((opt, oIdx) => (
                    opt && (
                      <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: answers[q._id] === opt ? '#eff6ff' : '#fff' }}>
                        <input 
                          type="radio" 
                          name={`question_${q._id}`} 
                          value={opt} 
                          checked={answers[q._id] === opt} 
                          onChange={() => handleAnswerChange(q._id, opt)} 
                          style={{ accentColor: '#3b82f6', width: '18px', height: '18px' }} 
                        />
                        <span style={{ fontSize: '15px', color: '#374151' }}>{opt}</span>
                      </label>
                    )
                  ))}
                </div>
              ) : (
                <textarea 
                  placeholder="Type your answer here..." 
                  rows={6}
                  value={answers[q._id] || ''} 
                  onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }}
                />
              )}
            </div>
          )))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
            <button onClick={() => navigate('/exam-login')} style={{ padding: '12px 24px', backgroundColor: '#fff', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginRight: '16px' }}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, boxShadow: '0 4px 6px rgba(59,130,246,0.3)' }}>
              <CheckCircle size={20} />
              {submitting ? 'Submitting...' : 'Submit Answers'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

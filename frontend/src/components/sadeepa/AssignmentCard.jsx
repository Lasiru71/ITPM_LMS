import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AssignmentCard({ assignment, type }) {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>{assignment.title}</h3>
        {type === 'completed' && (
          <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontSize: '12px', fontWeight: '500', padding: '2px 10px', borderRadius: '9999px' }}>
            Completed
          </span>
        )}
        {type === 'pending' && (
          <span style={{ backgroundColor: '#f59e0b', color: '#ffffff', fontSize: '12px', fontWeight: '500', padding: '2px 10px', borderRadius: '9999px' }}>
            Pending
          </span>
        )}
      </div>
      
      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>
        {assignment.description}
      </p>
      
      <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#4b5563', marginBottom: '20px', flexWrap: 'wrap' }}>
        {assignment.deadline && <span>Deadline: <span style={{ fontWeight: '500', color: '#111827' }}>{new Date(assignment.deadline).toLocaleString()}</span></span>}
        {assignment.startTime && <span>Starts: <span style={{ fontWeight: '500', color: '#111827' }}>{new Date(assignment.startTime).toLocaleString()}</span></span>}
        <span>Questions: <span style={{ fontWeight: '500', color: '#111827' }}>{assignment.questions.length}</span></span>
        {assignment.fileData?.filename && <span>Attachment: <span style={{ fontWeight: '500' }}>{assignment.fileData.filename}</span></span>}
      </div>
      
      {type === 'completed' && assignment.submission && (
        <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '4px' }}>Your Score</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginBottom: '4px' }}>
              {assignment.submission.marks}
            </div>
            <div style={{ fontSize: '14px', color: '#059669' }}>Grade: {assignment.submission.grade}</div>
          </div>
        </div>
      )}
      
      {type !== 'completed' && (
        <button 
          onClick={() => navigate(`/exam-login/${assignment._id}`)}
          style={{
            backgroundColor: '#3b82f6', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', border: 'none'
          }}
        >
          {assignment.title === 'Computer application Report Submission' ? 'Upload document' : 'Attend Exam'}
        </button>
      )}
    </div>
  );
}

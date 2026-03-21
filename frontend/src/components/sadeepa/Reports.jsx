import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DownloadCloud, Users, CheckCircle, BarChart3 } from 'lucide-react';
import { useToast } from '../Lasiru/ToastProvider';

export default function Reports() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMarks, setEditingMarks] = useState({});
  const [savingId, setSavingId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sadeepa/assignments/reports');
      const excludedIds = ['IT1234', '69be5dc7f449ac8db94184ea', '69bc5de81fd5b3167387985e'];
      const filteredData = response.data.filter(s => !excludedIds.includes(s.studentId));
      setSubmissions(filteredData);
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = (sub) => {
    try {
      const fileAnswer = sub.answers?.find(a => a.questionId === '000000000000000000000000' || (a.answerText && a.answerText.includes('base64')));
      if (fileAnswer) {
        const fileData = JSON.parse(fileAnswer.answerText);
        const link = document.createElement('a');
        link.href = fileData.base64;
        link.download = fileData.filename || 'student_submission_document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        showToast('error', 'No document attached to this submission.');
      }
    } catch (err) {
      showToast('error', 'Failed to process attached document.');
    }
  };

  const handleSaveGrade = async (id) => {
    const marks = editingMarks[id];
    if (marks === undefined || marks === '') {
      showToast('error', 'Please enter marks before saving.');
      return;
    }
    
    setSavingId(id);
    try {
      const res = await axios.put(`http://localhost:5000/api/sadeepa/assignments/submissions/${id}/grade`, {
        marks: Number(marks)
      });
      // Update local state
      setSubmissions(submissions.map(s => s._id === id ? res.data.submission : s));
      showToast('success', 'Grade updated successfully!');
      
      // Clear editing state for this row
      const newEditing = { ...editingMarks };
      delete newEditing[id];
      setEditingMarks(newEditing);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to update grade.');
    } finally {
      setSavingId(null);
    }
  };

  const generatePDF = () => {
    if (submissions.length === 0) {
      showToast('error', 'No data to export');
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // Green
    doc.text('EduVault Student Performance Report', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableColumn = ["Student Name", "Student ID", "Assignment Title", "Score", "Grade"];
    const tableRows = [];

    submissions.forEach(sub => {
      const rowData = [
        sub.studentName,
        sub.studentId,
        sub.assignmentId?.title || 'Unknown Assignment',
        sub.marks.toString(),
        sub.grade
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }, // Blue header
      margin: { top: 40 }
    });

    doc.save(`student_report_${new Date().getTime()}.pdf`);
    showToast('success', 'Report downloaded successfully!');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading reports...</div>;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Student Submissions</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>Overview of all assignment submissions and grades.</p>
        </div>
        <button onClick={generatePDF} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff',
          border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59,130,246,0.3)'
        }}>
          <DownloadCloud size={18} /> Download PDF Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', backgroundColor: '#e5e7eb' }}>
        {/* Quick Stats */}
        {[
          { icon: <Users size={20} color="#3b82f6" />, label: 'Total Submissions', value: submissions.length, bg: '#fff' },
          { icon: <CheckCircle size={20} color="#10b981" />, label: 'Graded', value: submissions.filter(s => s.status === 'Graded').length, bg: '#fff' },
          { icon: <BarChart3 size={20} color="#f59e0b" />, label: 'Average Score', value: submissions.length > 0 ? (submissions.reduce((a, b) => a + b.marks, 0) / submissions.length).toFixed(1) : 0, bg: '#fff' }
        ].map((stat, i) => (
          <div key={i} style={{ padding: '20px', backgroundColor: stat.bg, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f3f4f6' }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>{stat.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>Student ID</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>Name</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>Assignment</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>Score</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>Grade</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, i) => (
              <tr key={sub._id} style={{ borderBottom: i === submissions.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#111827', fontWeight: '500' }}>{sub.studentId}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#4b5563' }}>{sub.studentName}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#4b5563' }}>{sub.assignmentId?.title}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#2563eb', fontWeight: '600' }}>{sub.marks}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', 
                    backgroundColor: sub.grade.includes('A') ? '#d1fae5' : sub.grade.includes('F') ? '#fee2e2' : '#fef3c7',
                    color: sub.grade.includes('A') ? '#059669' : sub.grade.includes('F') ? '#dc2626' : '#d97706' }}>
                    {sub.grade}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                  {new Date(sub.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {sub.assignmentId?.title === 'Computer application Report Submission' && (
                      <button onClick={() => handleDownloadDocument(sub)} style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                        Download Doc
                      </button>
                    )}
                    
                    {editingMarks[sub._id] !== undefined ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input 
                          type="number" 
                          min="0" max="100"
                          value={editingMarks[sub._id]} 
                          onChange={(e) => setEditingMarks({ ...editingMarks, [sub._id]: e.target.value })}
                          style={{ width: '60px', padding: '4px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                        />
                        <button onClick={() => handleSaveGrade(sub._id)} disabled={savingId === sub._id} style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: savingId === sub._id ? 'not-allowed' : 'pointer', fontWeight: '500' }}>
                          Save
                        </button>
                        <button onClick={() => { const newEdits = {...editingMarks}; delete newEdits[sub._id]; setEditingMarks(newEdits); }} style={{ padding: '6px', fontSize: '12px', backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingMarks({ ...editingMarks, [sub._id]: sub.marks })} style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#e0e7ff', color: '#4338ca', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                        Grade Student
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No submissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

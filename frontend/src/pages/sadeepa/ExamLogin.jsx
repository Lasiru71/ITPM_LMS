import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, BookOpen, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/sadeepa/StatCard.jsx';
import AssignmentCard from '../../components/sadeepa/AssignmentCard.jsx';
import { useToast } from '../../components/Lasiru/ToastProvider';

export default function ExamLogin() {
  const [data, setData] = useState({ available: [], pending: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const studentName = user?.name;
  let studentId = user?.studentId;
  if (!studentId) {
    studentId = studentName === 'TestStudent' ? 'IT231112' : 'IT238370';
  }

  useEffect(() => {
    if (!user) {
      showToast('error', 'Please log in to access the exam dashboard.');
      navigate('/login', { state: { from: '/exam-login' } });
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/sadeepa/assignments/student?studentId=${studentId}&studentName=${studentName}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showToast('error', 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [studentId, studentName, showToast]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/');
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard...</div>;
  }

  // Calculate stats based on fetched data
  const completedCount = data.completed.length;
  const pendingCount = data.pending.length;
  const totalSubmissionsMarks = data.completed.reduce((sum, item) => sum + (item.submission?.marks || 0), 0);
  const avgGrade = data.completed.length > 0 ? (totalSubmissionsMarks / data.completed.length).toFixed(1) : 'N/A';

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '8px', backgroundColor: '#10b981', borderRadius: '8px', color: '#fff' }}><BookOpen size={20} /></div>
          EduVault
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{studentName}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Student ID: {studentId}</div>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Student Dashboard</h1>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <StatCard title="Completed" value={completedCount} subtext="Assignments submitted" icon={{ element: <CheckCircle size={20} />, color: '#10b981' }} />
          <StatCard title="Pending" value={pendingCount} subtext="Due assignments" icon={{ element: <Clock size={20} />, color: '#f59e0b' }} />
          <StatCard title="Avg Score" value={avgGrade} subtext="Calculated from graded work" icon={{ element: <CheckCircle size={20} />, color: '#3b82f6' }} />
        </div>

        {data.pending.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Pending Assignments</h2>
            {data.pending.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} type="pending" />
            ))}
          </div>
        )}

        {data.completed.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Completed Assignments</h2>
            {data.completed.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} type="completed" />
            ))}
          </div>
        )}

        {Object.keys(data).reduce((acc, curr) => acc + data[curr].length, 0) === 0 && (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>No assignments found.</div>
        )}
      </main>
    </div>
  );
}

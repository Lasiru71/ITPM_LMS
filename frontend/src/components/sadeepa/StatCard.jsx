import React from 'react';

export default function StatCard({ title, value, subtext, icon, variant = 'default' }) {
  const isSolidBlue = variant === 'primary';
  
  return (
    <div style={{
      flex: 1,
      minWidth: '220px',
      backgroundColor: isSolidBlue ? '#3b82f6' : '#ffffff',
      color: isSolidBlue ? '#ffffff' : '#1f2937',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: isSolidBlue ? 'none' : '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: isSolidBlue ? '#ffffff' : '#4b5563' }}>{title}</span>
        {icon && <span style={{ color: isSolidBlue ? '#ffffff' : icon.color }}>{icon.element}</span>}
      </div>
      <div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>{value}</div>
        <div style={{ fontSize: '13px', color: isSolidBlue ? '#e0e7ff' : '#6b7280' }}>{subtext}</div>
      </div>
    </div>
  );
}

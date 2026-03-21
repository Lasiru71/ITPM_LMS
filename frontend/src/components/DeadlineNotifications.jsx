import React from 'react';

export default function DeadlineNotifications({ assignments, submissions, userRole }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-blue-800 font-semibold mb-2">Upcoming Deadlines</h3>
      <p className="text-blue-600 text-sm">You have {assignments.length} assignments tracked.</p>
    </div>
  );
}

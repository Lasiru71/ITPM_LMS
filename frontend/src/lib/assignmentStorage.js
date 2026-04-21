export const storageService = {
  getAssignments: () => JSON.parse(localStorage.getItem('assignments') || '[]'),
  getSubmissions: () => JSON.parse(localStorage.getItem('submissions') || '[]'),
  saveAssignment: (assignment) => {
    const assignments = storageService.getAssignments();
    assignments.push(assignment);
    localStorage.setItem('assignments', JSON.stringify(assignments));
  },
  deleteAssignment: (id) => {
    const assignments = storageService.getAssignments();
    const filtered = assignments.filter(a => a.id !== id);
    localStorage.setItem('assignments', JSON.stringify(filtered));
  }
};

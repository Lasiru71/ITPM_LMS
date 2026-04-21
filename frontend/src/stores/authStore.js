import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: (userData) => {
    set({ user: userData, isAuthenticated: true });
    localStorage.setItem('user', JSON.stringify(userData));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  setUser: (userData) => set({ user: userData })
}));

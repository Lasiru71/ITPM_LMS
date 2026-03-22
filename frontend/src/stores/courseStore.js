import { create } from 'zustand';
import * as courseApi from '../api/Jeewani/courseApi';

export const useCourseStore = create((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true });
    try {
      const courses = await courseApi.getAllCourses();
      set({ courses, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addCourse: async (courseData) => {
    set({ isLoading: true });
    try {
      const newCourse = await courseApi.createCourse(courseData);
      set((state) => ({
        courses: [...state.courses, newCourse],
        isLoading: false
      }));
      return newCourse;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

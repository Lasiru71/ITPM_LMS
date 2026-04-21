import { create } from 'zustand';
import * as courseApi from '../api/Jeewani/courseApi';

export const useCourseStore = create((set) => ({
  courses: [],
  isLoading: false,
  error: null,

  // 🔹 FETCH
  fetchCourses: async () => {
    set({ isLoading: true });
    try {
      const courses = await courseApi.getAllCourses();
      set({ courses, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // 🔹 ADD
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
  },

  // 🔴 DELETE (API FIX)
  deleteCourse: async (id) => {
    try {
      await courseApi.deleteCourse(id); // 🔥 API call

      set((state) => ({
        courses: state.courses.filter(
          (c) => (c._id || c.id) !== id
        ),
      }));
    } catch (error) {
      console.error("Delete error:", error);
    }
  },

  // 🟡 UPDATE (API FIX)
  updateCourse: async (updatedCourse) => {
    try {
      const savedCourse = await courseApi.updateCourse(
        updatedCourse._id || updatedCourse.id,
        updatedCourse
      );

      set((state) => ({
        courses: state.courses.map((c) =>
          (c._id || c.id) === (savedCourse._id || savedCourse.id)
            ? savedCourse
            : c
        ),
      }));
    } catch (error) {
      console.error("Update error:", error);
    }
  }
}));
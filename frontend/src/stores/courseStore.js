import { create } from 'zustand';
// API imports removed (Jeewani module removal)

export const useCourseStore = create((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true });
    try {
      // Mocked data for now, since Jeewani's API was removed
      const mockCourses = []; 
      set({ courses: mockCourses, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch courses", isLoading: false });
    }
  },

  addCourse: async (courseData) => {
    set({ isLoading: true });
    try {
      // Feature disabled (Jeewani module removal)
      throw new Error("Course creation is temporarily disabled.");
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

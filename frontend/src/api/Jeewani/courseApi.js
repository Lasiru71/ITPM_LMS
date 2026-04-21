import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 🔹 GET ALL COURSES
export const getAllCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

// 🔹 GET SINGLE COURSE
export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get by ID error:", error);
    return null;
  }
};

// 🔹 CREATE COURSE
export const createCourse = async (courseData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/courses`, 
      courseData, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Create error:", error);
    const message = error.response?.data?.message || "Failed to create course";
    throw new Error(message);
  }
};

// 🔴 DELETE COURSE
export const deleteCourse = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/courses/${id}`, getAuthHeader());
    return true;
  } catch (error) {
    console.error("Delete error:", error);
    const message = error.response?.data?.message || "Failed to delete course";
    throw new Error(message);
  }
};

// 🟡 UPDATE COURSE
export const updateCourse = async (id, updatedData) => {
  try {
    // Sanitize data (remove internal IDs if they exist in the body)
    const { _id, id: someId, ...sanitizedData } = updatedData;

    const response = await axios.put(
      `${API_BASE_URL}/courses/${id}`, 
      sanitizedData, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Update error:", error);
    const message = error.response?.data?.message || "Failed to update course";
    throw new Error(message);
  }
};
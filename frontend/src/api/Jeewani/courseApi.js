// src/api/Jeewani/courseApi.js

const STORAGE_KEY = "courses";

// 🔹 GET ALL COURSES
export const getAllCourses = async () => {
  try {
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return courses;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

// 🔹 GET SINGLE COURSE (optional - edit page use කරන්න පුළුවන්)
export const getCourseById = async (id) => {
  try {
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    return courses.find((c) => c._id === id);
  } catch (error) {
    console.error("Get by ID error:", error);
    return null;
  }
};

// 🔹 CREATE COURSE
export const createCourse = async (course) => {
  try {
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const newCourse = {
      ...course,
      _id: Date.now().toString(), // 🔥 unique id
      createdAt: new Date().toISOString(),
    };

    const updatedCourses = [...courses, newCourse];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));

    return newCourse;
  } catch (error) {
    console.error("Create error:", error);
    throw error;
  }
};

// 🔴 DELETE COURSE
export const deleteCourse = async (id) => {
  try {
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const updatedCourses = courses.filter((c) => c._id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));

    return true;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

// 🟡 UPDATE COURSE
export const updateCourse = async (id, updatedData) => {
  try {
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const updatedCourses = courses.map((c) =>
      c._id === id
        ? {
            ...c,
            ...updatedData,
            updatedAt: new Date().toISOString(),
          }
        : c
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));

    // return updated course
    return updatedCourses.find((c) => c._id === id);
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};
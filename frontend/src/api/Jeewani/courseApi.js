const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// 🔹 GET ALL COURSES
export const getAllCourses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error("Failed to fetch courses");
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

// 🔹 GET SINGLE COURSE
export const getCourseById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) throw new Error("Failed to fetch course");
    return await response.json();
  } catch (error) {
    console.error("Get by ID error:", error);
    return null;
  }
};

// 🔹 CREATE COURSE
export const createCourse = async (course) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error("Failed to create course");
    return await response.json();
  } catch (error) {
    console.error("Create error:", error);
    throw error;
  }
};

// 🔴 DELETE COURSE
export const deleteCourse = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete course");
    return true;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

// 🟡 UPDATE COURSE
export const updateCourse = async (id, updatedData) => {
  try {
    // Sanitize data: remove _id and id from the body if they exist
    const { _id, id: someId, ...sanitizedData } = updatedData;

    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizedData),
    });
    if (!response.ok) throw new Error(`Failed to update course (Status: ${response.status})`);
    return await response.json();
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};
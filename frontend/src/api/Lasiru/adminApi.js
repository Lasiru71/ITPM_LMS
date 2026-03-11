import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// --- Lecturers ---
export const getAllLecturers = async () => {
    const response = await axios.get(`${API_URL}/lecturers`, getAuthHeader());
    return response.data;
};

export const createLecturer = async (lecturerData) => {
    const response = await axios.post(`${API_URL}/lecturers`, lecturerData, getAuthHeader());
    return response.data;
};

export const deleteLecturer = async (id) => {
    const response = await axios.delete(`${API_URL}/lecturers/${id}`, getAuthHeader());
    return response.data;
};

// --- Students ---
export const getAllStudents = async () => {
    const response = await axios.get(`${API_URL}/students`, getAuthHeader());
    return response.data;
};

export const deleteStudent = async (id) => {
    const response = await axios.delete(`${API_URL}/students/${id}`, getAuthHeader());
    return response.data;
};

// --- Common ---
export const toggleUserStatus = async (id) => {
    const response = await axios.patch(`${API_URL}/users/${id}/toggle`, {}, getAuthHeader());
    return response.data;
};

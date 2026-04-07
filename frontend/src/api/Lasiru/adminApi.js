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

// --- Dashboard Stats ---
export const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/stats`, getAuthHeader());
    return response.data;
};

// --- User Profile ---
const AUTH_URL = "http://localhost:5000/api/auth";

export const getMyProfile = async () => {
    const response = await axios.get(`${AUTH_URL}/me`, getAuthHeader());
    return response.data;
};

export const updateMyProfile = async (data) => {
    const response = await axios.put(`${AUTH_URL}/update-profile`, data, getAuthHeader());
    return response.data;
};

export const changeMyPassword = async (data) => {
    const response = await axios.put(`${AUTH_URL}/change-password`, data, getAuthHeader());
    return response.data;
};

// --- Announcements ---
const ANNOUNCE_URL = "http://localhost:5000/api/announcements";

export const getAllAnnouncements = async () => {
    const response = await axios.get(`${ANNOUNCE_URL}`, getAuthHeader());
    return response.data;
};

export const createAnnouncement = async (data) => {
    const response = await axios.post(`${ANNOUNCE_URL}`, data, getAuthHeader());
    return response.data;
};

export const updateAnnouncement = async (id, data) => {
    const response = await axios.put(`${ANNOUNCE_URL}/${id}`, data, getAuthHeader());
    return response.data;
};

export const deleteAnnouncement = async (id) => {
    const response = await axios.delete(`${ANNOUNCE_URL}/${id}`, getAuthHeader());
    return response.data;
};

export const getLatestNotifications = async (role) => {
    const response = await axios.get(`${ANNOUNCE_URL}/notifications/latest?role=${role}`, getAuthHeader());
    return response.data;
};

export const getPaginatedNotifications = async (role, page = 1, limit = 10) => {
    const response = await axios.get(`${ANNOUNCE_URL}/notifications/all?role=${role}&page=${page}&limit=${limit}`, getAuthHeader());
    return response.data;
};

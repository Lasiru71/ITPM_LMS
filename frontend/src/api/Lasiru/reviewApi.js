import axios from "axios";

const API_URL = "http://localhost:5000/api/reviews";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getAllReviews = async () => {
    const response = await axios.get(`${API_URL}/all`, getAuthHeader());
    return response.data;
};

export const getStudentReviews = async () => {
    const response = await axios.get(`${API_URL}/my-reviews`, getAuthHeader());
    return response.data;
};

export const createReview = async (reviewData) => {
    const response = await axios.post(`${API_URL}/`, reviewData, getAuthHeader());
    return response.data;
};

export const addAdminReply = async (id, adminReply) => {
    const response = await axios.patch(`${API_URL}/reply/${id}`, { adminReply }, getAuthHeader());
    return response.data;
};

export const deleteReview = async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, getAuthHeader());
    return response.data;
};

export const updateReviewStatus = async (id, status) => {
    const response = await axios.patch(`${API_URL}/status/${id}`, { status }, getAuthHeader());
    return response.data;
};

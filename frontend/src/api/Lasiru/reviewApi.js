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

export const deleteReview = async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, getAuthHeader());
    return response.data;
};

export const updateReviewStatus = async (id, status) => {
    const response = await axios.patch(`${API_URL}/status/${id}`, { status }, getAuthHeader());
    return response.data;
};

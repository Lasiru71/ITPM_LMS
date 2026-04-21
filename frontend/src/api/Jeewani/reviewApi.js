const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const getAllReviews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/jeewani/reviews`);
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return [];
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jeewani/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create review");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Create review error:", error);
    throw error;
  }
};

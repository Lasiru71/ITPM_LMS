/**
 * Maps a course object from the API/Database into the format expected by the CourseCard component.
 * @param {Object} c - The raw course object from the API.
 * @returns {Object} - The mapped course object for UI display.
 */
export const mapCourseToUI = (c) => {
  if (!c) return null;
  
  return {
    id: c._id || c.id,
    title: c.title || "Untitled Course",
    instructor: c.instructorName || c.instructor || "Lead Instructor",
    price: c.price || 0,
    originalPrice: c.originalPrice,
    image: c.thumbnail || c.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
    thumbnail: c.thumbnail || c.image,
    rating: c.rating || 4.5,
    reviews: c.reviewCount || c.reviews || 0,
    isBestseller: c.isBestseller ?? true, // Default to true for custom courses to show in Featured
    isNew: c.isNew ?? true,               // Default to true for custom courses to show in New
    category: c.category || "General",
    level: c.level || "All Levels",
  };
};

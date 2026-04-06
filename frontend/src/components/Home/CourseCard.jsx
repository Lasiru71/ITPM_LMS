import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, CreditCard, ArrowRight } from 'lucide-react';

/**
 * CourseCard Component
 * Displays course information with price, learn more link, and enrollment payment button.
 * This version is optimized to resolve all strict linting errors including prop-types.
 */
export default function CourseCard({ course }) {
  // Safety check to prevent "cannot read property of null" errors
  if (!course) return null;

  // Destructuring to ensure all variables are defined and have fallbacks
  const {
    id,
    _id,
    title = "Untitled Course",
    instructor = "Lead Instructor",
    instructorName,
    price,
    rating = 4.5,
    reviews = 0,
    image,
    thumbnail,
    isBestseller = false
  } = course;

  // Final processed data for display
  const courseId = _id || id;
  const courseInstructor = instructorName || instructor;
  const coursePrice = (price === 0 || price === "0" || price === 'Free' || !price) ? 'Free' : `$${price}`;
  const courseImage = image || thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={courseImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop"; }}
        />
        {isBestseller && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-400 text-amber-950 text-[10px] font-bold uppercase rounded shadow-sm z-10">
            Bestseller
          </div>
        )}
      </div>
      
      {/* Course Info */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2 min-h-[3rem]">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mb-3">By {courseInstructor}</p>
          
          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="size-3.5 fill-current" />
              <span className="text-xs font-bold">{rating}</span>
            </div>
            <span className="text-xs text-slate-400">
              ({reviews} {reviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="mt-auto">
          <div className="flex items-center justify-between pt-4 mb-4 border-t border-slate-100">
            <p className="text-lg font-bold text-slate-900">
              {coursePrice}
            </p>
            <Link 
              to={`/courses/${courseId}`} 
              className="flex items-center text-sm font-medium text-slate-600 hover:text-emerald-600 cursor-pointer no-underline transition-colors"
            >
              Learn More <ChevronRight className="size-4 ml-0.5" />
            </Link>
          </div>

          <Link to={`/payment/${courseId}`} className="block w-full no-underline group/btn focus:outline-none">
            <div className="w-full flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-600 group-hover/btn:from-emerald-600 group-hover/btn:to-teal-700 text-white py-3.5 px-4 rounded-xl shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 font-medium">
                <CreditCard className="size-5 opacity-90" />
                <span className="text-[14px] font-bold uppercase tracking-wide">Make Payment to Enroll</span>
              </div>
              <ArrowRight className="size-5 opacity-90 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

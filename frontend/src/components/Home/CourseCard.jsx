import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ChevronRight, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

export default function CourseCard({ course }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.image || course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {course.isBestseller && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-400 text-amber-950 text-[10px] font-bold uppercase rounded shadow-sm">
            Bestseller
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col h-full">
        <div className="flex-grow">
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 mb-3">By {course.instructor}</p>
          
          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="size-3.5 fill-current" />
              <span className="text-xs font-bold">{course.rating}</span>
            </div>
            <span className="text-xs text-slate-400">({course.reviews} reviews)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 mb-4">
          <p className="text-lg font-bold text-slate-900">${course.price}</p>
          <span className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
            Learn More <ChevronRight className="size-4 ml-0.5" />
          </span>
        </div>

        {/* Payment Button - Navigates to custom payment page */}
        <Link to={`/payment/${course.id}`} className="block w-full">
          <button className="w-full flex items-center justify-between bg-[#19b386] hover:bg-[#149870] text-white py-2.5 px-4 rounded-[10px] transition-all duration-300">
            <div className="flex items-center gap-2 font-medium">
              <CreditCard className="size-[18px] opacity-90" />
              <span className="text-[14px]">Make Payment to Enroll</span>
            </div>
            <ArrowRight className="size-[18px] opacity-90" />
          </button>
        </Link>
      </div>
    </div>
  );
}

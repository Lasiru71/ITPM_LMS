import React from 'react';
import { Star, Clock, ChevronRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

export default function CourseCard({ course }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {course.isBestseller && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-400 text-amber-950 text-[10px] font-bold uppercase rounded shadow-sm">
            Bestseller
          </div>
        )}
      </div>
      
      <div className="p-5">
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
        
        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-slate-900">${course.price}</p>
            <Button variant="ghost" size="sm" className="group/btn text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
              Learn More
              <ChevronRight className="size-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <Link to={`/payment/${course._id || course.id}`} className="w-full">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 py-5">
              <CreditCard className="size-4" />
              Pay Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

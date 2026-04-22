import React from 'react';
import { Star, ChevronRight, CreditCard, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

export default function CourseCard({ course }) {
  const courseId = course._id || course.id;
  const paidCourses = JSON.parse(localStorage.getItem("paidCourses") || "[]");
  const isPaid = paidCourses.includes(String(courseId));

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link to={`/courses/${courseId}`}>
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={course.image || course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {course.isBestseller && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-amber-400 text-amber-950 text-[10px] font-bold uppercase rounded shadow-sm">
              Bestseller
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={`/courses/${courseId}`}>
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
            {course.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mb-3">By {course.instructor || course.instructorName || 'Instructor'}</p>
        
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="size-3.5 fill-current" />
            <span className="text-xs font-bold">{course.rating || 4.5}</span>
          </div>
          <span className="text-xs text-slate-400">({course.reviews || 0} reviews)</span>
        </div>
        
        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-slate-900">
              {course.price ? `$${course.price}` : 'Free'}
            </p>
            <Link to={`/courses/${courseId}`}>
              <Button variant="ghost" size="sm" className="group/btn text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
                Learn More
                <ChevronRight className="size-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {isPaid ? (
            <Button className="w-full bg-emerald-100 hover:bg-emerald-100 text-emerald-700 gap-2 py-5 cursor-default">
              <CheckCircle className="size-4" />
              Paid / Enrolled
            </Button>
          ) : (
            <Link to={`/payment/${courseId}`} className="w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 py-5">
                <CreditCard className="size-4" />
                Book Now
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}


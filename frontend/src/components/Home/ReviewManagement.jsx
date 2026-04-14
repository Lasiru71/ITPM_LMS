import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, User } from 'lucide-react';
import { Button } from './ui/Button';

const MOCK_REVIEWS = [
  { id: 1, user: "John Doe", comment: "Great platform! The courses are really well structured.", rating: 5, date: "2026-03-15" },
  { id: 2, user: "Jane Smith", comment: "I learned so much about Web Development. Highly recommend.", rating: 4, date: "2026-03-10" },
  { id: 3, user: "Mike Johnson", comment: "The instructors are very knowledgeable and helpful.", rating: 5, date: "2026-03-05" },
];

export default function ReviewManagement() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [newReview, setNewReview] = useState({ comment: "", rating: 5 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;
    
    const review = {
      id: Date.now(),
      user: "Current User",
      comment: newReview.comment,
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ comment: "", rating: 5 });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <MessageSquare className="size-5 text-emerald-600" />
        Reviews & Ratings
      </h3>

      <div className="space-y-6 mb-8">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{review.user}</p>
                  <p className="text-[10px] text-slate-500">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-slate-300"} />
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Share your thoughts</label>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none transition-all min-h-[100px]"
            placeholder="What do you think about our courses?"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="focus:outline-none"
                >
                  <Star size={20} className={star <= newReview.rating ? "text-amber-500 fill-current" : "text-slate-300"} />
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" size="sm" className="gap-2">
            Post Review <Send size={14} />
          </Button>
        </div>
      </form>
    </div>
  );
}

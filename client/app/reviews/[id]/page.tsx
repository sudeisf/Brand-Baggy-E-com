'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function ProductReviewPage() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ rating, review, email });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #331d67 0%, #5e3bb4 100%)',
      }}
    >
      {/* Brand name at the top */}
      <div className="w-full flex justify-center mt-8 mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold capitalize tracking-wide text-white drop-shadow-lg select-none">
          brand baggy
        </h1>
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="max-w-lg w-full p-8 rounded-2xl shadow-xl bg-white/95">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#331d67] capitalize">
            Product Review
          </h2>
          <div className="flex justify-center mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-colors ${
                  star <= rating
                    ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                    : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-[#331d67] mb-1 capitalize">
                Product Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full rounded-md border border-gray-300 shadow-sm p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#331d67] bg-white"
                rows={5}
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-[#331d67] mb-1">
                Email address <span className="text-gray-400 text-sm">(will not be published)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-md border border-gray-300 shadow-sm p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#331d67] bg-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#331d67] hover:bg-[#27144d] text-white py-3 px-4 rounded-lg text-lg font-semibold transition-colors"
              disabled={!rating || !review || !email}
            >
              Submit product review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
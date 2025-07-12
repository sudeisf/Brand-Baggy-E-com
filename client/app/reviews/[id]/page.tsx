'use client';

import { useState } from 'react';
import { Router, Star } from 'lucide-react';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';

export default function ProductReviewPage() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter()
  const path  = useParams()
  const id = path.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.post(`/product/reviews/${id}/`, {
        email,
        rating,
        review
      });
      setSuccess(true);
      setRating(0);
      setReview('');
      setEmail('');
      router.push('/products')

    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
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
          {(loading || success) && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
      {loading && (
        <>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#331d67] mb-4"></div>
          <p className="text-[#331d67] font-semibold">Submitting your review...</p>
        </>
      )}
      {success && (
        <>
          <div className="text-green-600 text-4xl mb-2">✓</div>
          <p className="text-[#331d67] font-semibold mb-2">Review submitted successfully!</p>
          <button
            className="mt-2 px-4 py-2 bg-[#331d67] text-white rounded"
            onClick={() => router.push('/products')}
          >
            Continue Shopping
          </button>
        </>
      )}
    </div>
  </div>
)}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-600 bg-red-100 rounded px-3 py-2 text-sm mb-2">{error}</div>
            )}
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
              disabled={!rating || !review || !email || loading}
            >
              {loading ? 'Submitting...' : 'Submit product review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
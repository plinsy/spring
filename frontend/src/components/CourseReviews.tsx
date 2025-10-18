import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag, Trash2, MessageCircle } from 'lucide-react';
import { Alert } from './ui/alert';
import { useAuthStore } from '../store/authStore';

// Types
interface Review {
  id: number;
  studentId: number;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  helpfulCount: number;
  isHelpful?: boolean;
}

interface CourseReviewsProps {
  courseId: number;
  averageRating?: number;
  totalReviews?: number;
  canReview?: boolean;
}

const CourseReviews = ({ 
  courseId, 
  averageRating = 0, 
  totalReviews = 0,
  canReview = false 
}: CourseReviewsProps) => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Mock reviews data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await api.get(API.REVIEWS.LIST(courseId));
        
        const mockReviews: Review[] = [
          {
            id: 1,
            studentId: 1,
            studentName: 'Alice Johnson',
            studentAvatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=3b82f6&color=fff',
            rating: 5,
            comment: 'Excellent course! The instructor explains everything clearly and the projects are very practical. I learned so much about React Hooks and can now apply them in my work.',
            createdAt: '2025-10-10T10:30:00Z',
            helpfulCount: 15,
          },
          {
            id: 2,
            studentId: 2,
            studentName: 'Bob Smith',
            studentAvatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=8b5cf6&color=fff',
            rating: 4,
            comment: 'Great content and well-structured. Some sections could use more examples, but overall very informative.',
            createdAt: '2025-10-08T14:20:00Z',
            helpfulCount: 8,
          },
          {
            id: 3,
            studentId: 3,
            studentName: 'Carol Williams',
            studentAvatar: 'https://ui-avatars.com/api/?name=Carol+Williams&background=ec4899&color=fff',
            rating: 5,
            comment: 'Best React course I\'ve taken! The instructor is knowledgeable and engaging. Highly recommend!',
            createdAt: '2025-10-05T09:15:00Z',
            helpfulCount: 22,
          },
          {
            id: 4,
            studentId: 4,
            studentName: 'David Brown',
            studentAvatar: 'https://ui-avatars.com/api/?name=David+Brown&background=10b981&color=fff',
            rating: 3,
            comment: 'Good course, but I expected more advanced topics. It\'s more suitable for beginners.',
            createdAt: '2025-10-03T16:45:00Z',
            helpfulCount: 5,
          },
          {
            id: 5,
            studentId: 5,
            studentName: 'Emma Davis',
            studentAvatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=f59e0b&color=fff',
            rating: 5,
            comment: 'Outstanding! Clear explanations, great examples, and excellent support. Worth every penny.',
            createdAt: '2025-09-28T11:00:00Z',
            helpfulCount: 18,
          },
        ];

        setReviews(mockReviews);
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]);

  // Submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters long.');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const response = await api.post(API.REVIEWS.CREATE, {
      //   courseId,
      //   rating,
      //   comment
      // });

      setSuccess('Review submitted successfully!');
      setShowReviewForm(false);
      setRating(5);
      setComment('');
      
      // Refresh reviews
      // fetchReviews();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      // TODO: Replace with actual API call
      // await api.delete(API.REVIEWS.DELETE(reviewId));

      setSuccess('Review deleted successfully!');
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      setError('Failed to delete review. Please try again.');
    }
  };

  // Mark review as helpful
  const handleMarkHelpful = async (reviewId: number) => {
    try {
      // TODO: Replace with actual API call
      // await api.post(`/reviews/${reviewId}/helpful`);

      setReviews(reviews.map(r => 
        r.id === reviewId 
          ? { ...r, helpfulCount: r.helpfulCount + (r.isHelpful ? -1 : 1), isHelpful: !r.isHelpful }
          : r
      ));
    } catch (err) {
      setError('Failed to mark review as helpful.');
    }
  };

  // Sort and filter reviews
  const getSortedAndFilteredReviews = () => {
    let filteredReviews = [...reviews];

    // Filter by rating
    if (filterRating !== null) {
      filteredReviews = filteredReviews.filter(r => r.rating === filterRating);
    }

    // Sort
    switch (sortBy) {
      case 'helpful':
        filteredReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      case 'rating':
        filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'recent':
      default:
        filteredReviews.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return filteredReviews;
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const sortedReviews = getSortedAndFilteredReviews();

  // Render star rating
  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`${size} ${
                star <= (interactive ? (hoverRating || rating) : rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Student Reviews</h2>
        {canReview && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          {success}
        </Alert>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
          <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(rating, true, 'w-8 h-8')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your experience with this course..."
                required
                minLength={10}
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 10 characters ({comment.length}/10)
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={comment.length < 10}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setRating(5);
                  setComment('');
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rating Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(averageRating), false, 'w-6 h-6')}
            <p className="text-gray-600 mt-2">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star as keyof typeof ratingDistribution];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <button
                  key={star}
                  onClick={() => setFilterRating(filterRating === star ? null : star)}
                  className={`flex items-center gap-3 w-full text-left hover:bg-white/50 p-2 rounded transition ${
                    filterRating === star ? 'bg-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-1 w-12">
                    <span className="font-medium">{star}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

        {filterRating !== null && (
          <button
            onClick={() => setFilterRating(null)}
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
          >
            Clear Filter: {filterRating} ⭐
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600">
              {filterRating !== null
                ? `No ${filterRating}-star reviews found.`
                : 'Be the first to review this course!'}
            </p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <img
                    src={review.studentAvatar || `https://ui-avatars.com/api/?name=${review.studentName}`}
                    alt={review.studentName}
                    className="w-12 h-12 rounded-full"
                  />

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.studentName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                      {review.updatedAt && review.updatedAt !== review.createdAt && (
                        <span className="text-xs text-gray-400">(edited)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions for own review */}
                {user?.id === review.studentId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Review Comment */}
              <p className="text-gray-700 leading-relaxed mb-4">
                {review.comment}
              </p>

              {/* Review Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleMarkHelpful(review.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                    review.isHelpful
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${review.isHelpful ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">
                    Helpful ({review.helpfulCount})
                  </span>
                </button>

                <button
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  title="Report review"
                >
                  <Flag className="w-4 h-4" />
                  <span className="text-sm font-medium">Report</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseReviews;

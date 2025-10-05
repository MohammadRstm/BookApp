import axios from "axios";
import { useEffect, useState } from "react"
import { FaBook, FaUser, FaCalendar, FaTag, FaQuoteLeft, FaStar, FaSignInAlt } from "react-icons/fa"
import { renderStars } from "../utils/renderRatingStars";
import { Link, useSearchParams } from "react-router-dom";

export default function BookDetails() {
    const [bookDetails, setBookDetails] = useState(null);
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const [searchParams] = useSearchParams();
  

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem('token');

    const loadBookDetails = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/books/withRating/${id}`);
            setBookDetails(response.data.bookDetails);
            console.log(response.data.bookDetails)
        } catch (err) {
            if (err.response)
                alert(err.response.data.message || 'Server error');
            else
                alert('Network error');
        }
    }

    useEffect(() => {
    const bookId = searchParams.get('bookId');
    if (bookId) {
      loadBookDetails(bookId);
    }
    }, [searchParams]);

    const submitNewReview = async ()=>{
        if(!token) return;
        try{
            await axios.post(`${BASE_URL}/api/reviews/newreview/${bookDetails._id}` , {newRating , newReview} , {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            // refresh
            loadBookDetails(bookDetails._id);
            setNewReview("");
            setNewRating(0);
        }catch(err){
            if (err.response)
                alert(err.response.data.message || 'Server error');
            else
                alert('Network error');
        }
    }

    const handleStarClick = (rating) => {
        setNewRating(rating);
    };

    const handleStarHover = (rating) => {
        setHoverRating(rating);
    };

    const handleStarLeave = () => {
        setHoverRating(0);
    };

    const renderStarRating = (currentRating, onStarClick, onStarHover, onStarLeave) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onStarClick(star)}
                        onMouseEnter={() => onStarHover(star)}
                        onMouseLeave={onStarLeave}
                        className="focus:outline-none"
                    >
                        <FaStar
                            size={24}
                            className={`
                                ${star <= (hoverRating || currentRating) 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300 dark:text-gray-600'
                                }
                                transition-colors duration-150
                            `}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">            
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {!bookDetails ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-secondary)] mx-auto mb-4"></div>
                            <p className="text-xl text-[var(--color-text)]">Loading book details...</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        {/* Book Header Section */}
                        <div className="bg-[var(--color-background)] border-2 border-[var(--color-accent)] rounded-2xl p-8 mb-8 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                {/* Large Book Icon */}
                                <div className="bg-[var(--color-primary)] p-6 rounded-2xl mb-6 shadow-lg">
                                    <FaBook size={80} className="text-[var(--color-text)]" />
                                </div>

                                {/* Rating */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                        {renderStars(bookDetails.averageRating)}
                                        <span className="text-lg font-semibold text-[var(--color-text)]">
                                            ({bookDetails.averageRating?.toFixed(1) || '0.0'})
                                        </span>
                                    </div>
                                </div>

                                {/* Book Details Stack */}
                                <div className="space-y-4 w-full max-w-md">
                                    <div className="text-center">
                                        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
                                            {bookDetails.title}
                                        </h1>
                                        <div className="flex items-center justify-center space-x-2 text-[var(--color-text)]/80">
                                            <FaUser className="text-[var(--color-secondary)]" />
                                            <span className="text-lg font-medium">by {bookDetails.author}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center space-x-2 justify-center p-3 bg-[var(--color-accent)]/30 rounded-lg">
                                            <FaCalendar className="text-[var(--color-secondary)]" />
                                            <span className="font-medium">Year: {bookDetails.year}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 justify-center p-3 bg-[var(--color-accent)]/30 rounded-lg">
                                            <FaTag className="text-[var(--color-secondary)]" />
                                            <span className="font-medium">{bookDetails.genre}</span>
                                        </div>
                                    </div>

                                    {bookDetails.description && (
                                        <div className="bg-[var(--color-accent)]/30 p-4 rounded-lg">
                                            <div className="flex items-start space-x-2">
                                                <FaQuoteLeft className="text-[var(--color-secondary)] mt-1 flex-shrink-0" />
                                                <p className="text-[var(--color-text)] text-sm leading-relaxed">
                                                    {bookDetails.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-[var(--color-background)] border-2 border-[var(--color-accent)] rounded-2xl p-8 mb-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6 flex items-center">
                                <FaQuoteLeft className="mr-3 text-[var(--color-secondary)]" />
                                Reader Reviews
                                <span className="ml-2 text-lg font-normal text-[var(--color-text)]/80">
                                    ({bookDetails.reviews.length})
                                </span>
                            </h2>

                            {bookDetails.reviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-[var(--color-text)]/80">No reviews yet. Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Scrollable Reviews Container */}
                                    <div 
                                        className="space-y-6 max-h-96 overflow-y-auto pr-4
                                                  scrollbar-thin scrollbar-thumb-[var(--color-secondary)] 
                                                  scrollbar-track-[var(--color-accent)] scrollbar-thumb-rounded-full
                                                  scrollbar-track-rounded-full"
                                    >
                                        {bookDetails.reviews.map((review, index) => (
                                            <div 
                                                key={index}
                                                className="border-b border-[var(--color-accent)] pb-6 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                                                            <FaUser size={14} className="text-[var(--color-text)]" />
                                                        </div>
                                                        <span className="font-medium text-[var(--color-text)]">
                                                            {review.user.name || "Anonymous reader"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>
                                                <p className="text-[var(--color-text)] leading-relaxed">
                                                    {review.reviewText}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Scroll Indicator */}
                                    {bookDetails.reviews.length > 3 && (
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 
                                                      bg-[var(--color-primary)] text-[var(--color-text)] text-xs px-3 py-1 
                                                      rounded-full font-medium animate-bounce">
                                            Scroll for more reviews
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Add Review Section */}
                        <div className="bg-[var(--color-background)] border-2 border-[var(--color-accent)] rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Share Your Thoughts</h2>
                            {token ? (
                                <>
                                    {/* Star Rating Input */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                                            Your Rating *
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            {renderStarRating(
                                                newRating,
                                                handleStarClick,
                                                handleStarHover,
                                                handleStarLeave
                                            )}
                                            <span className="text-lg font-semibold text-[var(--color-text)]">
                                                {newRating > 0 ? `${newRating}.0` : '0.0'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Review Text Area */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                                            Your Review *
                                        </label>
                                        <textarea
                                            value={newReview}
                                            onChange={(e) => setNewReview(e.target.value)}
                                            placeholder="Share your thoughts about this book..."
                                            rows="5"
                                            className="w-full px-4 py-3 border-2 border-[var(--color-accent)] rounded-xl 
                                                    focus:border-[var(--color-secondary)] focus:outline-none 
                                                    focus:ring-2 focus:ring-[var(--color-secondary)]/20 
                                                    transition-all duration-200
                                                    resize-none bg-[var(--color-background)] text-[var(--color-text)]"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        onClick={submitNewReview}
                                        disabled={!newReview || newRating === 0}
                                        className={`
                                            w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200
                                            ${newReview && newRating > 0
                                                ? 'bg-[var(--color-secondary)] text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:shadow-lg cursor-pointer'
                                                : 'bg-[var(--color-primary)] text-[var(--color-text)]/50 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        Submit Review
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    {/* Icon */}
                                    <div className="bg-[var(--color-primary)] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <FaSignInAlt size={28} className="text-[var(--color-text)]" />
                                    </div>
                                    
                                    {/* Message */}
                                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">
                                        Join the Conversation
                                    </h3>
                                    <p className="text-[var(--color-text)]/80 mb-6 max-w-md mx-auto">
                                        Sign in to share your thoughts and rate this book. Your review helps other readers discover great books!
                                    </p>

                                    {/* Login Button */}
                                    <Link
                                        to="/login" 
                                        className="inline-flex items-center space-x-3 bg-[var(--color-secondary)] text-[var(--color-text)] font-semibold px-6 py-3 rounded-xl hover:bg-[var(--color-accent)] transition-all duration-200 shadow-md hover:shadow-lg border border-[var(--color-text)]/10"
                                    >
                                        <FaSignInAlt className="h-5 w-5" />
                                        <span>Login to Review</span>
                                    </Link>

                                    {/* Sign Up Prompt */}
                                    <div className="mt-4 text-sm text-[var(--color-text)]/60">
                                        Don't have an account?{" "}
                                        <Link
                                            to="/signup" 
                                            className="text-[var(--color-secondary)] font-medium hover:text-[var(--color-text)] transition-colors duration-200"
                                        >
                                            Sign up here
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
import axios from "axios";
import { useEffect, useState } from "react"
import { FaBook, FaUser, FaCalendar, FaTag, FaQuoteLeft, FaStar, FaSignInAlt } from "react-icons/fa"
import { renderStars } from "../utils/renderRatingStars";
import Header from "./Components/Header";

export default function BookDetails() {
    const [bookDetails, setBookDetails] = useState(null);
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

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
        const queryParam = new URLSearchParams(window.location.search);
        if (queryParam) {
            const id = queryParam.get('bookId');
            loadBookDetails(id);
        }
    }, []);

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
                                    : 'text-gray-300'
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
        <div className="min-h-screen bg-[#FFFFFF]">
            <Header />
            
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {!bookDetails ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C19C82] mx-auto mb-4"></div>
                            <p className="text-xl text-[#111111]">Loading book details...</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        {/* Book Header Section */}
                        <div className="bg-[#FFFFFF] border-2 border-[#EBD0BF] rounded-2xl p-8 mb-8">
                            <div className="flex flex-col items-center text-center">
                                {/* Large Book Icon */}
                                <div className="bg-[#CFC1B4] p-6 rounded-2xl mb-6 shadow-lg">
                                    <FaBook size={80} className="text-[#111111]" />
                                </div>

                                {/* Rating */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                        {renderStars(bookDetails.averageRating)}
                                        <span className="text-lg font-semibold text-[#111111]">
                                            ({bookDetails.averageRating?.toFixed(1) || '0.0'})
                                        </span>
                                    </div>
                                </div>

                                {/* Book Details Stack */}
                                <div className="space-y-4 w-full max-w-md">
                                    <div className="text-center">
                                        <h1 className="text-3xl font-bold text-[#111111] mb-2">
                                            {bookDetails.title}
                                        </h1>
                                        <div className="flex items-center justify-center space-x-2 text-[#111111]/80">
                                            <FaUser className="text-[#C19C82]" />
                                            <span className="text-lg font-medium">by {bookDetails.author}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center space-x-2 justify-center p-3 bg-[#F8F5F2] rounded-lg">
                                            <FaCalendar className="text-[#C19C82]" />
                                            <span className="font-medium">Year: {bookDetails.year}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 justify-center p-3 bg-[#F8F5F2] rounded-lg">
                                            <FaTag className="text-[#C19C82]" />
                                            <span className="font-medium">{bookDetails.genre}</span>
                                        </div>
                                    </div>

                                    {bookDetails.description && (
                                        <div className="bg-[#F8F5F2] p-4 rounded-lg">
                                            <div className="flex items-start space-x-2">
                                                <FaQuoteLeft className="text-[#C19C82] mt-1 flex-shrink-0" />
                                                <p className="text-[#111111] text-sm leading-relaxed">
                                                    {bookDetails.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-[#FFFFFF] border-2 border-[#EBD0BF] rounded-2xl p-8 mb-8">
                            <h2 className="text-2xl font-bold text-[#111111] mb-6 flex items-center">
                                <FaQuoteLeft className="mr-3 text-[#C19C82]" />
                                Reader Reviews
                                <span className="ml-2 text-lg font-normal text-[#111111]/80">
                                    ({bookDetails.reviews.length})
                                </span>
                            </h2>

                            {bookDetails.reviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-[#111111]/80">No reviews yet. Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Scrollable Reviews Container */}
                                    <div 
                                        className="space-y-6 max-h-96 overflow-y-auto pr-4
                                                  scrollbar-thin scrollbar-thumb-[#C19C82] 
                                                  scrollbar-track-[#EBD0BF] scrollbar-thumb-rounded-full
                                                  scrollbar-track-rounded-full"
                                    >
                                        {bookDetails.reviews.map((review, index) => (
                                            <div 
                                                key={index}
                                                className="border-b border-[#EBD0BF] pb-6 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-[#CFC1B4] rounded-full flex items-center justify-center">
                                                            <FaUser size={14} className="text-[#111111]" />
                                                        </div>
                                                        <span className="font-medium text-[#111111]">
                                                            {review.user.name || "Anonymous reader"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>
                                                <p className="text-[#111111] leading-relaxed">
                                                    {review.reviewText}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Scroll Indicator */}
                                    {bookDetails.reviews.length > 3 && (
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 
                                                      bg-[#CFC1B4] text-[#111111] text-xs px-3 py-1 
                                                      rounded-full font-medium animate-bounce">
                                            Scroll for more reviews
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Add Review Section */}
                        <div className="bg-[#FFFFFF] border-2 border-[#EBD0BF] rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-[#111111] mb-6">Share Your Thoughts</h2>
                        {token ? (
                            <>
                                {/* Star Rating Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-[#111111] mb-3">
                                        Your Rating *
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        {renderStarRating(
                                            newRating,
                                            handleStarClick,
                                            handleStarHover,
                                            handleStarLeave
                                        )}
                                        <span className="text-lg font-semibold text-[#111111]">
                                            {newRating > 0 ? `${newRating}.0` : '0.0'}
                                        </span>
                                    </div>
                                </div>

                                {/* Review Text Area */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-[#111111] mb-3">
                                        Your Review *
                                    </label>
                                    <textarea
                                        value={newReview}
                                        onChange={(e) => setNewReview(e.target.value)}
                                        placeholder="Share your thoughts about this book..."
                                        rows="5"
                                        className="w-full px-4 py-3 border-2 border-[#EBD0BF] rounded-xl 
                                                focus:border-[#C19C82] focus:outline-none 
                                                focus:ring-2 focus:ring-[#C19C82]/20 
                                                transition-all duration-200
                                                resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={submitNewReview}
                                    disabled={!newReview || newRating === 0}
                                    className={`
                                        w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200
                                        ${newReview && newRating > 0
                                            ? 'bg-[#C19C82] text-[#111111] hover:bg-[#EBD0BF] hover:shadow-lg cursor-pointer'
                                            : 'bg-[#CFC1B4] text-[#111111]/50 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    Submit Review
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                {/* Icon */}
                                <div className="bg-[#CFC1B4] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FaSignInAlt size={28} className="text-[#111111]" />
                                </div>
                                
                                {/* Message */}
                                <h3 className="text-xl font-bold text-[#111111] mb-3">
                                    Join the Conversation
                                </h3>
                                <p className="text-[#111111]/80 mb-6 max-w-md mx-auto">
                                    Sign in to share your thoughts and rate this book. Your review helps other readers discover great books!
                                </p>

                                {/* Login Button */}
                                <a 
                                    href="/login" 
                                    className="inline-flex items-center space-x-3 bg-[#C19C82] text-[#111111] font-semibold px-6 py-3 rounded-xl hover:bg-[#EBD0BF] transition-all duration-200 shadow-md hover:shadow-lg border border-[#111111]/10"
                                >
                                    <FaSignInAlt className="h-5 w-5" />
                                    <span>Login to Review</span>
                                </a>

                                {/* Sign Up Prompt */}
                                <div className="mt-4 text-sm text-[#111111]/60">
                                    Don't have an account?{" "}
                                    <a 
                                        href="/signup" 
                                        className="text-[#C19C82] font-medium hover:text-[#111111] transition-colors duration-200"
                                    >
                                        Sign up here
                                    </a>
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
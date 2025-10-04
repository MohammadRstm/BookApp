import { useState, useEffect } from "react"
import axios from 'axios';
import { renderStars } from "../utils/renderRatingStars";
import { FaBook, FaUser, FaCalendar, FaArrowRight } from "react-icons/fa";
import Header from "./Components/Header";

export default function Home() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [books, setBooks] = useState([]);

    const loadBooks = async () => {
        try {
            const response = await axios(`${BASE_URL}/api/books/withRating`);
            setBooks(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadBooks();
    }, []);

    return (
        <div className="min-h-screen bg-[#FFFFFF]">
            <Header />
            
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#111111] mb-4">Our Book Collection</h1>
                    <p className="text-lg text-[#111111]/80 max-w-2xl mx-auto">
                        Discover amazing books from various genres and authors. 
                        Click on any book to see more details and leave a review.
                    </p>
                </div>

                {/* Books Grid */}
                {books.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C19C82] mx-auto mb-4"></div>
                            <p className="text-xl text-[#111111]">Loading books...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map(book => (
                            <div 
                                key={book._id}
                                onClick={() => { window.location.href = `/bookDetails?bookId=${book._id.toString()}` }}
                                className="bg-[#FFFFFF] border-2 border-[#EBD0BF] rounded-2xl p-6 cursor-pointer 
                                         hover:shadow-2xl hover:border-[#C19C82] transition-all duration-300 
                                         hover:transform hover:-translate-y-2 group"
                            >
                                {/* Book Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="bg-[#CFC1B4] p-4 rounded-xl group-hover:bg-[#EBD0BF] transition-colors duration-300">
                                        <FaBook size={32} className="text-[#111111]" />
                                    </div>
                                </div>

                                {/* Book Info */}
                                <div className="text-center space-y-3">
                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-[#111111] line-clamp-2 group-hover:text-[#C19C82] transition-colors duration-300">
                                        {book.title}
                                    </h3>

                                    {/* Author */}
                                    <div className="flex items-center justify-center space-x-2 text-[#111111]/80">
                                        <FaUser size={14} className="text-[#C19C82]" />
                                        <p className="text-sm font-medium">by {book.author}</p>
                                    </div>

                                    {/* Year */}
                                    <div className="flex items-center justify-center space-x-2 text-[#111111]/80">
                                        <FaCalendar size={14} className="text-[#C19C82]" />
                                        <p className="text-sm">{book.year}</p>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="flex">
                                            {renderStars(book.averageRating)}
                                        </div>
                                        <span className="text-sm text-[#111111]/80">
                                            ({book.averageRating?.toFixed(1) || '0.0'})
                                        </span>
                                    </div>

                                    {/* View Details CTA */}
                                    <div className="flex items-center justify-center space-x-1 text-[#C19C82] group-hover:text-[#111111] transition-colors duration-300">
                                        <span className="text-sm font-medium">View Details</span>
                                        <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {books.length === 0 && !books.length && (
                    <div className="text-center py-20">
                        <div className="bg-[#EBD0BF] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaBook size={32} className="text-[#111111]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#111111] mb-2">No Books Available</h3>
                        <p className="text-[#111111]/80">Check back later for new additions to our collection.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
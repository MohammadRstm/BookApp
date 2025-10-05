import { useState, useEffect } from "react"
import axios from 'axios';
import { renderStars } from "../utils/renderRatingStars";
import { FaBook, FaUser, FaCalendar, FaArrowRight, FaArrowLeft, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [sortBy, setSortBy] = useState(""); // "year", "rating", "title", "author"
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

    const loadBooks = async (pageNumber = 1) => {
        try {
            const response = await axios(`${BASE_URL}/api/books/withRating?page=${pageNumber}&limit=8`);
            setBooks(response.data.books);
            setAllBooks(response.data.books);
            setTotalPages(response.data.totalPages);
            setPage(response.data.currentPage);
        } catch (err) {
            console.log(err);
        }
    }

    const loadAllBooksForSearch = async () => {
        try {
            const response = await axios(`${BASE_URL}/api/books/withRating?limit=1000`);
            setAllBooks(response.data.books);
        } catch (err) {
            console.log(err);
        }
    }

    const searchForBook = () => {
        if (!searchName.trim()) {
            loadBooks();
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const searchTerm = searchName.toLowerCase().trim();
        
        const filteredBooks = allBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
        
        const sortedBooks = applySorting(filteredBooks);
        setBooks(sortedBooks);
        setPage(1);
        setTotalPages(1);
    }

    const applySorting = (booksArray) => {
        if (!sortBy) return booksArray;

        const sortedBooks = [...booksArray].sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "year":
                    aValue = a.year || 0;
                    bValue = b.year || 0;
                    break;
                case "rating":
                    aValue = a.averageRating || 0;
                    bValue = b.averageRating || 0;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return sortedBooks;
    }

    const handleSort = (newSortBy) => {
        if (sortBy === newSortBy) {
            // Toggle order if same sort field
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            // New sort field, default to ascending
            setSortBy(newSortBy);
            setSortOrder("asc");
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchForBook();
        }
    }

    const clearSearch = () => {
        setSearchName("");
        setIsSearching(false);
        setSortBy("");
        setSortOrder("asc");
        loadBooks();
    }

    const clearSort = () => {
        setSortBy("");
        setSortOrder("asc");
        if (isSearching) {
            searchForBook(); // Re-apply search without sort
        } else {
            loadBooks(page); // Reload current page without sort
        }
    }

    const getSortIcon = (field) => {
        if (sortBy !== field) return <FaSort className="opacity-50" />;
        return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
    }

    // Apply sorting whenever sort criteria changes
    useEffect(() => {
        if (books.length > 0) {
            const sortedBooks = applySorting(books);
            setBooks(sortedBooks);
        }
    }, [sortBy, sortOrder]);

    useEffect(() => {
        loadBooks();
        loadAllBooksForSearch();
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">            
            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Our Book Collection</h1>
                    <p className="text-lg text-[var(--color-text)]/80 max-w-2xl mx-auto">
                        Discover amazing books from various genres and authors. 
                        Click on any book to see more details and leave a review.
                    </p>
                </div>

                {/* Search and Sort Section */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full lg:max-w-md">
                        <div className="relative flex items-center">
                            <input 
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                name="search" 
                                placeholder="Search by book title or author..." 
                                className="w-full bg-[var(--color-background)] border-2 border-[var(--color-accent)] rounded-2xl py-3 px-4 pr-24 text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[var(--color-secondary)] transition-all duration-300"
                            />
                            <div className="absolute right-2 flex space-x-2">
                                {searchName && (
                                    <button
                                        onClick={clearSearch}
                                        className="px-3 py-1 bg-[var(--color-accent)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-secondary)] transition-colors duration-200 text-sm"
                                    >
                                        Clear
                                    </button>
                                )}
                                <button 
                                    onClick={searchForBook}
                                    className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-secondary)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-accent)] hover:shadow-lg transition-all duration-200"
                                >
                                    <FaSearch size={14} />
                                    <span>Search</span>
                                </button>
                            </div>
                        </div>
                        {isSearching && (
                            <p className="text-sm text-[var(--color-text)]/70 mt-2 text-center">
                                Showing {books.length} result{books.length !== 1 ? 's' : ''} for "{searchName}"
                                {books.length === 0 && " - No books found"}
                            </p>
                        )}
                    </div>

                    {/* Sort Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <span className="text-[var(--color-text)] font-medium whitespace-nowrap">Sort by:</span>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button
                                onClick={() => handleSort("year")}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                    sortBy === "year" 
                                    ? "bg-[var(--color-secondary)] text-[var(--color-text)] shadow-lg" 
                                    : "bg-[var(--color-accent)] text-[var(--color-text)] hover:bg-[var(--color-secondary)]"
                                }`}
                            >
                                <span>Year</span>
                                {getSortIcon("year")}
                            </button>
                            <button
                                onClick={() => handleSort("rating")}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                    sortBy === "rating" 
                                    ? "bg-[var(--color-secondary)] text-[var(--color-text)] shadow-lg" 
                                    : "bg-[var(--color-accent)] text-[var(--color-text)] hover:bg-[var(--color-secondary)]"
                                }`}
                            >
                                <span>Rating</span>
                                {getSortIcon("rating")}
                            </button>
                           
                                <button
                                    onClick={clearSort}
                                    className="px-3 py-2 bg-[var(--color-accent)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-secondary)] transition-colors duration-200 text-sm"
                                >
                                    Clear Sort
                                </button>
                            
                        </div>
                    </div>
                </div>

                {/* Sort Indicator */}
                {sortBy && (
                    <div className="text-center mb-4">
                        <p className="text-sm text-[var(--color-text)]/70">
                            Sorted by {sortBy} ({sortOrder === "asc" ? "ascending" : "descending"})
                        </p>
                    </div>
                )}

                {/* Books Grid */}
                {books.length === 0 && !isSearching ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-secondary)] mx-auto mb-4"></div>
                            <p className="text-xl text-[var(--color-text)]">Loading books...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {books.map(book => (
                                <div 
                                    key={book._id}
                                    onClick={() => { navigate(`/bookDetails?bookId=${book._id.toString()}`) }}
                                    className="bg-[var(--color-background)] border-2 border-[var(--color-accent)] rounded-2xl p-6 cursor-pointer group"
                                >
                                    {/* Book Icon */}
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-[var(--color-primary)] p-4 rounded-xl group-hover:bg-[var(--color-accent)] transition-colors duration-300">
                                            <FaBook size={32} className="text-[var(--color-text)]" />
                                        </div>
                                    </div>

                                    {/* Book Info */}
                                    <div className="text-center space-y-3">
                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-secondary)] transition-colors duration-300">
                                            {book.title}
                                        </h3>

                                        {/* Author */}
                                        <div className="flex items-center justify-center space-x-2 text-[var(--color-text)]/80">
                                            <FaUser size={14} className="text-[var(--color-secondary)]" />
                                            <p className="text-sm font-medium">by {book.author}</p>
                                        </div>

                                        {/* Year */}
                                        <div className="flex items-center justify-center space-x-2 text-[var(--color-text)]/80">
                                            <FaCalendar size={14} className="text-[var(--color-secondary)]" />
                                            <p className="text-sm">{book.year}</p>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="flex">
                                                {renderStars(book.averageRating)}
                                            </div>
                                            <span className="text-sm text-[var(--color-text)]/80">
                                                ({book.averageRating?.toFixed(1) || '0.0'})
                                            </span>
                                        </div>

                                        {/* View Details CTA */}
                                        <div className="flex items-center justify-center space-x-1 text-[var(--color-secondary)] group-hover:text-[var(--color-text)] transition-colors duration-300">
                                            <span className="text-sm font-medium">View Details</span>
                                            <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Page Pagination - Only show when not searching */}
                {!isSearching && books.length > 0 && (
                    <div className="flex justify-center items-center mt-8 space-x-4">
                        <button
                            disabled={page === 1}
                            onClick={() => loadBooks(page - 1)}
                            className={`px-4 py-2 bg-[var(--color-secondary)] text-[var(--color-text)] rounded-lg transition-all duration-200 disabled:opacity-50
                            ${page === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--color-accent)] hover:shadow-lg"}`}
                        >
                            <FaArrowLeft />
                        </button>
                        <span className="text-lg text-[var(--color-text)] font-medium">{page} / {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => loadBooks(page + 1)}
                            className={`px-4 py-2 bg-[var(--color-secondary)] text-[var(--color-text)] rounded-lg transition-all duration-200 disabled:opacity-50
                            ${page === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--color-accent)] hover:shadow-lg"}`}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                )}

                {/* Empty State for Search */}
                {isSearching && books.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-[var(--color-accent)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaBook size={32} className="text-[var(--color-text)]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">No Books Found</h3>
                        <p className="text-[var(--color-text)]/80 mb-4">No books found for "{searchName}"</p>
                        <button
                            onClick={clearSearch}
                            className="px-6 py-2 bg-[var(--color-secondary)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-accent)] transition-colors duration-200"
                        >
                            View All Books
                        </button>
                    </div>
                )}

                {/* Empty State for No Books */}
                {books.length === 0 && !isSearching && !books.length && (
                    <div className="text-center py-20">
                        <div className="bg-[var(--color-accent)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaBook size={32} className="text-[var(--color-text)]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">No Books Available</h3>
                        <p className="text-[var(--color-text)]/80">Check back later for new additions to our collection.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
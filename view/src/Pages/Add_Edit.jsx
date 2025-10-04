import axios from "axios";
import { useEffect, useState } from "react"
import Header from "./Components/Header";
import { FaBook, FaUser, FaCalendar, FaTag, FaQuoteLeft, FaEdit, FaSave, FaPlus, FaSignInAlt, FaLock } from "react-icons/fa";

export default function Add_Edit() {
    const [newBook, setNewBook] = useState({
        title: "",
        author: "",
        year: "",
        description: "",
        genre: "",
    });
    const [booksByMe, setBooksByMe] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [loading, setLoading] = useState(false);

    const loadBooksAddedByMe = async () => {
      if(!token) return;
        try {
            const response = await axios.get(`${BASE_URL}/api/books/by/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBooksByMe(response.data.booksByMe);
        } catch (err) {
            if (err.response)
                alert(err.response.data.message || 'Server error');
            else
                alert('Network error');
        }
    }

    useEffect(() => {
        loadBooksAddedByMe();
    }, []);

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem('token');

    if (!token) {
        return (
            <div className="min-h-screen bg-[#FFFFFF]">
                <Header />
                
                <main className="flex items-center justify-center min-h-[80vh] px-4">
                    <div className="max-w-md w-full text-center">
                        {/* Security Icon */}
                      <div className="bg-[#CFC1B4] w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg mt-8">
                          <FaLock size={60} className="text-[#111111]" />
                      </div>
                        
                        {/* Main Content */}
                        <div className="bg-[#FFFFFF] border-2 border-[#EBD0BF] rounded-3xl p-12 shadow-xl">
                            <h1 className="text-5xl font-bold text-[#111111] mb-6">
                                Oops!
                            </h1>
                            
                            <div className="space-y-4 mb-8">
                                <p className="text-2xl text-[#111111] font-semibold">
                                    Access Restricted
                                </p>
                                <p className="text-lg text-[#111111]/80 leading-relaxed">
                                    You need to be logged in to view this page
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                <a 
                                    href="/login" 
                                    className="block w-full bg-[#C19C82] text-[#111111] font-bold text-xl py-5 px-6 rounded-2xl hover:bg-[#EBD0BF] transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-[#111111]/10 hover:scale-105 transform"
                                >
                                    <div className="flex items-center justify-center space-x-3">
                                        <FaSignInAlt className="h-7 w-7" />
                                        <span>Login to Continue</span>
                                    </div>
                                </a>
                                
                                <a 
                                    href="/signup" 
                                    className="block w-full bg-[#CFC1B4] text-[#111111] font-semibold text-lg py-4 px-6 rounded-2xl hover:bg-[#EBD0BF] transition-all duration-200 border-2 border-[#EBD0BF]"
                                >
                                    Create New Account
                                </a>
                            </div>
                        </div>

                        {/* Quick Navigation */}
                        <div className="mt-8 text-center">
                            <a 
                                href="/" 
                                className="text-[#C19C82] font-medium hover:text-[#111111] transition-colors duration-200"
                            >
                                ← Return to Homepage
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const addNewBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/api/books/addNewBook`, newBook, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Book added successfully');
            setNewBook({ title: "", author: "", year: "", description: "", genre: "" });
            loadBooksAddedByMe(); // Refresh the list
        } catch (err) {
            if (err.response)
                alert(err.response.data.message || 'Server error');
            else
                alert('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBook((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const startEditing = (book) => {
        setIsEditing(book._id);
        setEditForm({
            author: book.author,
            year: book.year,
            genre: book.genre,
            description: book.description
        });
    };

    const cancelEditing = () => {
        setIsEditing(null);
        setEditForm({});
    };

    const submitChanges = async (bookId) => {
        try {
            await axios.put(`${BASE_URL}/api/books/edit/${bookId}`, editForm, {
              headers: { Authorization: `Bearer ${token}` }
            });
            alert('Changes saved successfully!');
            setIsEditing(null);
            setEditForm({});
            loadBooksAddedByMe(); // Refresh the list
        } catch (err) {
            alert('Error saving changes');
        }
    };

  

    return (
        <div className="min-h-screen bg-[#FFFFFF]">
            <Header />
            {token ? (
              <>
       {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Add New Book Section */}
                    <div className="bg-[#FFFFFF] border-2 border-[#EBD0BF] rounded-2xl p-8 mb-8 shadow-lg">
                        <div className="text-center mb-8">
                            <div className="bg-[#CFC1B4] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FaPlus size={28} className="text-[#111111]" />
                            </div>
                            <h1 className="text-3xl font-bold text-[#111111] mb-2">Add New Book</h1>
                            <p className="text-[#111111]/80">Share your favorite books with the community</p>
                        </div>

                        <form onSubmit={addNewBook} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#111111] mb-2">
                                        Book Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newBook.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-[#EBD0BF] rounded-xl 
                                                 focus:border-[#C19C82] focus:outline-none 
                                                 focus:ring-2 focus:ring-[#C19C82]/20 
                                                 transition-all duration-200
                                                 placeholder-[#111111]/40"
                                        placeholder="Enter book title"
                                    />
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="block text-sm font-medium text-[#111111] mb-2">
                                        Author *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="h-5 w-5 text-[#C19C82]" />
                                        </div>
                                        <input
                                            type="text"
                                            name="author"
                                            value={newBook.author}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border-2 border-[#EBD0BF] rounded-xl 
                                                     focus:border-[#C19C82] focus:outline-none 
                                                     focus:ring-2 focus:ring-[#C19C82]/20 
                                                     transition-all duration-200
                                                     placeholder-[#111111]/40"
                                            placeholder="Author name"
                                        />
                                    </div>
                                </div>

                                {/* Year */}
                                <div>
                                    <label className="block text-sm font-medium text-[#111111] mb-2">
                                        Publication Year *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaCalendar className="h-5 w-5 text-[#C19C82]" />
                                        </div>
                                        <input
                                            type="number"
                                            name="year"
                                            value={newBook.year}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border-2 border-[#EBD0BF] rounded-xl 
                                                     focus:border-[#C19C82] focus:outline-none 
                                                     focus:ring-2 focus:ring-[#C19C82]/20 
                                                     transition-all duration-200
                                                     placeholder-[#111111]/40"
                                            placeholder="Publication year"
                                        />
                                    </div>
                                </div>

                                {/* Genre */}
                                <div>
                                    <label className="block text-sm font-medium text-[#111111] mb-2">
                                        Genre *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaTag className="h-5 w-5 text-[#C19C82]" />
                                        </div>
                                        <input
                                            type="text"
                                            name="genre"
                                            value={newBook.genre}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border-2 border-[#EBD0BF] rounded-xl 
                                                     focus:border-[#C19C82] focus:outline-none 
                                                     focus:ring-2 focus:ring-[#C19C82]/20 
                                                     transition-all duration-200
                                                     placeholder-[#111111]/40"
                                            placeholder="Book genre"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#111111] mb-2">
                                        Description *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <FaQuoteLeft className="h-5 w-5 text-[#C19C82]" />
                                        </div>
                                        <textarea
                                            name="description"
                                            value={newBook.description}
                                            onChange={handleChange}
                                            required
                                            rows="4"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-[#EBD0BF] rounded-xl 
                                                     focus:border-[#C19C82] focus:outline-none 
                                                     focus:ring-2 focus:ring-[#C19C82]/20 
                                                     transition-all duration-200
                                                     placeholder-[#111111]/40 resize-none"
                                            placeholder="Enter book description"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200
                                    flex items-center justify-center space-x-2
                                    ${loading 
                                        ? 'bg-[#CFC1B4] text-[#111111]/50 cursor-not-allowed' 
                                        : 'bg-[#C19C82] text-[#111111] hover:bg-[#EBD0BF] hover:shadow-lg cursor-pointer'
                                    }
                                `}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#111111]"></div>
                                        <span>Adding Book...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPlus className="h-5 w-5" />
                                        <span>Add New Book</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* My Books Section */}
                    <div className="bg-[#FFFFFF] border-2 border-[#EBD0BF] rounded-2xl p-8 shadow-lg">
                        <div className="text-center mb-8">
                            <div className="bg-[#CFC1B4] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FaBook size={28} className="text-[#111111]" />
                            </div>
                            <h2 className="text-3xl font-bold text-[#111111] mb-2">My Books</h2>
                            <p className="text-[#111111]/80">Manage the books you've added</p>
                        </div>

                        {booksByMe.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-[#EBD0BF] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaBook size={32} className="text-[#111111]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#111111] mb-2">No Books Added Yet</h3>
                                <p className="text-[#111111]/80">Start by adding your first book above!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {booksByMe.map(book => (
                                    <div key={book._id} className="border-2 border-[#EBD0BF] rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                                        {isEditing === book._id ? (
                                            // Edit Mode
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-xl font-bold text-[#111111]">{book.title}</h3>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => submitChanges(book._id)}
                                                            className="bg-[#C19C82] text-[#111111] px-4 py-2 rounded-xl hover:bg-[#EBD0BF] transition-colors duration-200 flex items-center space-x-2"
                                                        >
                                                            <FaSave className="h-4 w-4" />
                                                            <span>Save</span>
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="bg-[#CFC1B4] text-[#111111] px-4 py-2 rounded-xl hover:bg-[#EBD0BF] transition-colors duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-[#111111] mb-2">Author</label>
                                                        <input
                                                            type="text"
                                                            name="author"
                                                            value={editForm.author || ""}
                                                            onChange={handleEditChange}
                                                            className="w-full px-3 py-2 border border-[#EBD0BF] rounded-lg focus:border-[#C19C82] focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-[#111111] mb-2">Year</label>
                                                        <input
                                                            type="number"
                                                            name="year"
                                                            value={editForm.year || ""}
                                                            onChange={handleEditChange}
                                                            className="w-full px-3 py-2 border border-[#EBD0BF] rounded-lg focus:border-[#C19C82] focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-[#111111] mb-2">Genre</label>
                                                        <input
                                                            type="text"
                                                            name="genre"
                                                            value={editForm.genre || ""}
                                                            onChange={handleEditChange}
                                                            className="w-full px-3 py-2 border border-[#EBD0BF] rounded-lg focus:border-[#C19C82] focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-[#111111] mb-2">Description</label>
                                                        <textarea
                                                            name="description"
                                                            value={editForm.description || ""}
                                                            onChange={handleEditChange}
                                                            rows="3"
                                                            className="w-full px-3 py-2 border border-[#EBD0BF] rounded-lg focus:border-[#C19C82] focus:outline-none resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="bg-[#CFC1B4] p-3 rounded-xl">
                                                            <FaBook size={24} className="text-[#111111]" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-[#111111]">{book.title}</h3>
                                                            <p className="text-[#111111]/80">by {book.author}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => startEditing(book)}
                                                        className="bg-[#C19C82] text-[#111111] px-4 py-2 rounded-xl hover:bg-[#EBD0BF] transition-colors duration-200 flex items-center space-x-2"
                                                    >
                                                        <FaEdit className="h-4 w-4" />
                                                        <span>Edit</span>
                                                    </button>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <FaCalendar className="text-[#C19C82]" />
                                                        <span className="font-medium">Year:</span>
                                                        <span>{book.year}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <FaTag className="text-[#C19C82]" />
                                                        <span className="font-medium">Genre:</span>
                                                        <span>{book.genre}</span>
                                                    </div>
                                                </div>
                                                
                                                {book.description && (
                                                    <div className="mt-4 bg-[#F8F5F2] p-4 rounded-lg">
                                                        <div className="flex items-start space-x-2">
                                                            <FaQuoteLeft className="text-[#C19C82] mt-1 flex-shrink-0" />
                                                            <p className="text-[#111111] text-sm leading-relaxed">
                                                                {book.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
              </>
            ) : (
              <>
                <h1>You need to be logged In to access this page</h1>
              </>
            )}
     
        </div>
    );
}
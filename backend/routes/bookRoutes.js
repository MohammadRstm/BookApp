const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User")
const mongoose = require('mongoose');
const authenticateToken = require('../middlewares/auth');


// GET all books - no autharization needed 
router.get("/withRating", async (req, res) => {
   try {
    const books = await Book.aggregate([
      {
        $lookup: {
          from: "Reviews", 
          localField: "_id",
          foreignField: "bookId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" }, 
          reviewsCount: { $size: "$reviews" }, 
        },
      },
      {
        $project: {
          title: 1,
          author: 1,
          description: 1,
          genre: 1,
          year: 1,
          addedBy: 1,
          averageRating: { $ifNull: ["$averageRating", 0] }, // default 0 if no reviews
          reviewsCount: 1,
        },
      },
    ]);

    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET A SPECIFIC BOOK WITH RATING AND USER NAMES
router.get("/withRating/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const book = await Book.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },

      // Lookup reviews
      {
        $lookup: {
          from: "Reviews",
          localField: "_id",
          foreignField: "bookId",
          as: "reviews",
        },
      },

      // Unwind reviews (so we can join users)
      {
        $unwind: {
          path: "$reviews",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup user for each review
      {
        $lookup: {
          from: "Users",
          localField: "reviews.userId",
          foreignField: "_id",
          as: "reviews.user",
        },
      },

      // Unwind user so it's an object not an array
      {
        $unwind: {
          path: "$reviews.user",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Group back
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          author: { $first: "$author" },
          description: { $first: "$description" },
          genre: { $first: "$genre" },
          year: { $first: "$year" },
          addedBy: { $first: "$addedBy" },
          reviews: {
            $push: {
              $cond: [
                { $ifNull: ["$reviews._id", false] },
                "$reviews",
                "$$REMOVE" // <-- REMOVE empty/null reviews
              ]
            }
          },
          averageRating: { $avg: "$reviews.rating" },
          reviewsCount: {
            $sum: {
              $cond: [{ $ifNull: ["$reviews._id", false] }, 1, 0],
            },
          },
        },
      },

      // Cleanup
      {
        $project: {
          title: 1,
          author: 1,
          description: 1,
          genre: 1,
          year: 1,
          addedBy: 1,
          reviews: 1,
          averageRating: { $ifNull: ["$averageRating", 0] },
          reviewsCount: 1,
        },
      },
    ]);

    if (!book || book.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    console.log(book[0])

    res.status(200).json({
      message: "Book Details obtained",
      bookDetails: book[0],
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD A NEW BOOK
router.post("/addNewBook" , authenticateToken , async (req , res) =>{
  const user = req.user;
  const {author , year , description , genre , title} = req.body;
  try{
    await Book.create({
      author,
      year,
      description,
      genre,
      title,
      addedBy : user.id
    });
    res.status(200).json({message : 'Book added successfully'});
  }catch(err){
    res.status(500).json({message : err.message || 'Server error'});
  }
});

// GET BOOKS ADDED BY A SPECIFIC USER
router.get('/by/me' , authenticateToken , async (req , res) =>{
  const user = req.user;
  console.log(user)
  try{
    const booksByMe = await Book.find({addedBy: user.id});
    res.status(200).json({messge : 'Books found' , booksByMe});
  }catch(err){
    res.status(500).json({message : err.message || 'Server error'});
  }
});

// EDIT A SPECIFIC BOOK
router.put('/edit/:bookId' , authenticateToken , async (req , res) =>{
  const bookId = req.params.bookId;
  const {author , year , description ,genre} = req.body;
  try{
    const book = await Book.findById(bookId);
    if(!book) return res.status(404).json({message : 'Book not found'});// should be impossible to happen
    book.author = author;
    book.year = year;
    book.description = description;
    book.genre = genre;

    await book.save();
    res.status(200).json({message : 'Book updated successfully'});
  }catch(err){
    res.status(500).json({message : err.message || 'Server error'});
  }
});


module.exports = router;

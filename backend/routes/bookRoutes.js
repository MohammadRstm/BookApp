const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Review = require('../models/Review');
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

// GET A SPECIFIC BOOK WITH RATING
router.get("/withRating/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const book = await Book.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
          averageRating: { $ifNull: ["$averageRating", 0] },
          reviewsCount: 1,
          reviews: 1, 
        },
      },
    ]);

    const bookDetails = book[0]; // aggregate returns array

    if (!bookDetails) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book Details obtained", bookDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

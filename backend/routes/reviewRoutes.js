const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Book = require('../models/Book');
const mongoose = require('mongoose')
const authenticateToken = require("../middlewares/auth");

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("bookId", "title")
      .populate("userId", "name email");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new review
router.post("/newreview/:id", authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const user = req.user;
    const newReview = req.body.newReview;
    const newRating = req.body.newRating;

    if (!newReview || !newRating) {
      return res.status(400).json({ message: "Review text and rating are required" });
    }

    if (newRating < 1 || newRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Make sure book exists
    const bookReviewed = await Book.findById(bookId);
    if (!bookReviewed)
      return res.status(404).json({ message: "Book not found" });

    const newReviewForBook = new Review({
      bookId: bookId,
      userId: user.id,
      rating: newRating,
      reviewText: newReview
    });
    

    const savedReview = await newReviewForBook.save();
    
    res.status(201).json(savedReview); 
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;

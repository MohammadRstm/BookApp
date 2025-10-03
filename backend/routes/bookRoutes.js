const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const authenticateToken = require("../middlewares/auth");

// GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("addedBy", "name email");
    console.log(books);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new book - must be authenticated
router.post("/",authenticateToken, async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

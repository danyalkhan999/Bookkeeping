const Book = require("../models/Book.model");
const cloudinary = require("../utils/cloudinary");
const { getPublicIdFromUrl } = require("../utils/helper");

// GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate([
      { path: "author", select: "name email" },
      { path: "borrower", select: "name email" },
      { path: "libraries", select: "name address" },
    ]);
    // .populate("author", "name email")
    // .populate("borrower", "name email")
    // .populate("libraries", "name address");

    if (!book) {
      return res.status(404).json({ message: req.t("books.NotFound") });
    }
    res.status(200).json({ book });
  } catch (err) {
    res.status(500).json({ message: req.t("books.FetchError") });
  }
};

// PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: req.t("books.NotFound") });
    }

    console.log("req", req);

    const { title, description, libraries } = req.body;

    // Update fields if present
    if (title) book.title = title;
    if (description) book.description = description;

    if (libraries) {
      const libraryArray = Array.isArray(libraries) ? libraries : [libraries];
      // Add only non-duplicate libraries
      libraryArray.forEach((libraryId) => {
        if (!book.libraries.includes(libraryId)) {
          book.libraries.push(libraryId);
        }
      });
    }

    // If a new cover image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary (if exists)
      if (book.coverImage) {
        // Extract public ID from URL
        const publicId = getPublicIdFromUrl(book.coverImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "book-covers",
      });

      // Update book with new image URL
      book.coverImage = uploadResult.secure_url;
    }

    await book.save();

    const populatedBook = await book.populate([
      { path: "author", select: "name email" },
      { path: "libraries", select: "name address" },
    ]);
    // .populate("author", "name email")
    // .populate("libraries", "name address");

    res.status(200).json({
      message: req.t("books.UpdateSuccess"),
      book: populatedBook,
    });
  } catch (err) {
    console.error("UpdateBook error:", err);
    res.status(500).json({ message: req.t("books.UpdateError") });
  }
};

// DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: req.t("books.NotFound") });
    }

    // only the original author can delete
    if (
      req.user.role !== "author" ||
      req.user._id.toString() !== book.author.toString()
    ) {
      return res.status(403).json({ message: req.t("books.NotAuthorized") });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: req.t("books.DeleteSuccess") });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: req.t("books.DeleteError") });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { title, description = "", libraries = [] } = req.body;

    if (!title || !libraries.length) {
      return res.status(400).json({ message: req.t("books.MissingFields") });
    }

    if (req.user.role !== "author") {
      return res.status(403).json({ message: req.t("books.NotAuthorized") });
    }

    // Cloudinary image URL
    let coverImageUrl = "";
    if (req.file && req.file.path) {
      coverImageUrl = req.file.path; // Cloudinary gives secure URL here
    }

    const book = new Book({
      title,
      description,
      author: req.user._id,
      libraries,
      coverImage: coverImageUrl,
    });

    await book.save();
    const populated = await book.populate([
      { path: "author", select: "name email" },
      { path: "libraries", select: "name address" },
    ]);

    res.status(201).json({
      message: req.t("books.CreatedSuccess"),
      book: populated,
    });
  } catch (err) {
    console.error("error:", err);
    res.status(500).json({ message: req.t("books.CreateError") });
  }
};

// controllers/book.controller.js
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate([
      { path: "author", select: "name email" },
      { path: "borrower", select: "name email" },
      { path: "libraries", select: "name address" },
    ]);

    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ message: req.t("books.FetchError") });
  }
};

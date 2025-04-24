const Book = require("../models/Book.model");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate("author", "name email")
      .populate("borrower", "name email")
      .populate("library", "name location");

    res.json({ books });
  } catch (err) {
    res.status(500).json({ message: req.t("books.FetchError") });
  }
};

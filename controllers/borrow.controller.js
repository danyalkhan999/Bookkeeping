const Book = require("../models/Book.model");

exports.borrowBook = async (req, res) => {
  try {
    // if (req.user.role !== 'borrower') {
    //   return res.status(403).json({ message: req.t('borrower.OnlyBorrowerAllowed') });
    // }

    const bookId = req.params.id;
    if (!bookId) {
      return res
        .status(400)
        .json({ message: req.t("borrower.BookIdRequired") });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: req.t("books.NotFound") });
    }

    if (book.borrower) {
      return res
        .status(400)
        .json({ message: req.t("borrower.AlreadyBorrowed") });
    }

    // Assign the book to the current borrower
    book.borrower = req.user._id;
    await book.save();

    res.status(200).json({ message: req.t("borrower.BorrowSuccess"), book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: req.t("borrower.BorrowFailed") });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: req.t("books.NotFound") });
    }

    if (!book.borrower) {
      return res.status(400).json({ message: req.t("borrower.NotBorrowed") });
    }

    // Check if the logged-in user is the one who borrowed the book
    if (book.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: req.t("borrower.NotYourBook") });
    }

    // Remove borrower reference
    book.borrower = null;
    await book.save();

    res.status(200).json({ message: req.t("borrower.ReturnSuccess"), book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: req.t("borrower.ReturnFailed") });
  }
};

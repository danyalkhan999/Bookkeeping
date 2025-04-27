const Library = require("../models/Library.model");
const Book = require("../models/Book.model");

// GET inventory: show books in this library and not currently borrowed
exports.getInventory = async (req, res) => {
  try {
    const { id: libraryId } = req.params;
    const library = await Library.findById(libraryId);
    if (!library) {
      return res.status(404).json({ message: req.t("library.NotFound") });
    }

    const books = await Book.find({
      libraries: libraryId,
      borrower: null,
    }).populate([
      { path: "author", select: "name email" },
      { path: "libraries", select: "name" },
    ]);

    res.status(200).json({ library, books });
  } catch (err) {
    res.status(500).json({ message: req.t("library.InventoryFetchError") });
  }
};

// POST inventory: add book to library’s list
exports.addToInventory = async (req, res) => {
  try {
    const { id: libraryId } = req.params;
    const { bookId } = req.body;

    const library = await Library.findById(libraryId);
    if (!library) {
      return res.status(404).json({ message: req.t("library.NotFound") });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: req.t("books.NotFound") });
    }

    // Prevent duplicate addition
    if (book.libraries.includes(libraryId)) {
      return res
        .status(400)
        .json({ message: req.t("library.AlreadyInInventory") });
    }

    // 📚 Add this library to the book's libraries array
    book.libraries.push(libraryId);
    await book.save();

    // 🔥 Now, fetch updated library info including all its books
    const updatedBooks = await Book.find({ libraries: libraryId }).populate([
      { path: "author", select: "name email" },
      { path: "borrower", select: "name email" },
    ]);

    res.status(200).json({
      message: req.t("library.InventoryAddSuccess"),
      library: {
        _id: library._id,
        name: library.name,
        address: library.address,
        books: updatedBooks,
      },
    });
  } catch (err) {
    console.error("Add to Inventory Error:", err);
    res.status(500).json({ message: req.t("library.InventoryAddError") });
  }
};

// DELETE inventory/:bookId: remove that library from book.libraries
exports.removeFromInventory = async (req, res) => {
  try {
    const { id: libraryId, bookId } = req.params;
    const library = await Library.findById(libraryId);
    if (!library) {
      return res.status(404).json({ message: req.t("library.NotFound") });
    }

    const book = await Book.findById(bookId);
    if (!book || !book.libraries.includes(libraryId)) {
      return res
        .status(404)
        .json({ message: req.t("library.BookNotInInventory") });
    }

    book.libraries = book.libraries.filter(
      (libId) => libId.toString() !== libraryId
    );
    await book.save();

    res.status(200).json({ message: req.t("library.InventoryRemoveSuccess") });
  } catch (err) {
    res.status(500).json({ message: req.t("library.InventoryRemoveError") });
  }
};

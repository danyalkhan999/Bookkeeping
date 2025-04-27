const Library = require("../models/Library.model");
const Book = require("../models/Book.model");

exports.createLibrary = async (req, res) => {
  try {
    const library = new Library(req.body);
    await library.save();
    res.status(201).json({ message: req.t("library.Created"), library });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllLibraries = async (req, res) => {
  try {
    const libraries = await Library.find();
    console.log(libraries);
    res.json({ libraries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLibraryById = async (req, res) => {
  try {
    const library = await Library.findById(req.params.id);
    if (!library) {
      return res.status(404).json({ message: req.t("library.NotFound") });
    }

    const books = await Book.find({ library: library._id }).populate(
      "borrower",
      "name email"
    );

    res.json({ library, books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLibrary = async (req, res) => {
  try {
    const updated = await Library.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: req.t("library.NotFound") });
    }
    res.json({ message: req.t("library.Updated"), library: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLibrary = async (req, res) => {
  try {
    const deleted = await Library.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: req.t("library.NotFound") });
    }
    res.json({ message: req.t("library.Deleted") });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

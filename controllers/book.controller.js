const Book = require("../models/Book.model");
// const bucket = require("../config/firebase");
// const { v4: uuidv4 } = require("uuid");

// GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("author", "name email")
      .populate("borrower", "name email")
      .populate("libraries", "name address");

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
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: req.t("books.NotFound") });
    }

    // Only original author may update
    if (
      req.user.role !== "author" ||
      req.user._id.toString() !== book.author.toString()
    ) {
      return res.status(403).json({ message: req.t("books.NotAuthorized") });
    }

    const { title, description, libraries } = req.body;
    if (title !== undefined) book.title = title;
    if (description !== undefined) book.description = description;
    if (Array.isArray(libraries)) book.libraries = libraries;

    await book.save();
    const updated = await book
      .populate("author", "name email")
      .populate("borrower", "name email")
      .populate("libraries", "name address")
      .execPopulate();

    res
      .status(200)
      .json({ message: req.t("books.UpdateSuccess"), book: updated });
  } catch (err) {
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

/* exports.createBook = async (req, res) => {
  try {
    // 1️⃣ Validate required fields
    const { title, author, library, description = "" } = req.body;
    if (!title || !author || !library) {
      return res.status(400).json({ message: req.t("books.MissingFields") });
    }

    // 2️⃣ Only AUTHORS may create books
    if (req.user.role !== "author") {
      return res.status(403).json({ message: req.t("books.NotAuthorized") });
    }

    // 3️⃣ Check file presence
    if (!req.file) {
      return res
        .status(400)
        .json({ message: req.t("books.MissingCoverImage") });
    }

    // 4️⃣ Upload to Firebase
    const file = req.file;
    // generate a unique filename
    const extension = file.originalname.split(".").pop();
    const firebaseName = `books/${uuidv4()}.${extension}`;
    const fileUpload = bucket.file(firebaseName);

    const stream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    stream.on("error", (err) => {
      console.error("Firebase upload error:", err);
      return res.status(500).json({ message: req.t("books.ImageUploadError") });
    });

    stream.on("finish", async () => {
      // make public
      await fileUpload.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${firebaseName}`;

      // 5️⃣ Create Book document
      const book = new Book({
        title,
        coverImage: publicUrl,
        author,
        library,
        description,
      });
      await book.save();

      return res.status(201).json({
        message: req.t("books.CreatedSuccess"),
        book,
      });
    });

    // actually send the file buffer
    stream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: req.t("books.CreateError") });
  }
}; */

exports.createBook = async (req, res) => {
  try {
    const { title, description = "", libraries = [] } = req.body;

    if (!title || !libraries.length) {
      return res.status(400).json({ message: req.t("books.MissingFields") });
    }

    if (req.user.role !== "author") {
      return res.status(403).json({ message: req.t("books.NotAuthorized") });
    }

    const book = new Book({
      title,
      description,
      author: req.user._id,
      libraries, // ← assign multiple libraries
    });

    await book.save();
    const populated = await book
      .populate("author", "name email")
      .populate("libraries", "name address")
      .execPopulate();

    res
      .status(201)
      .json({ message: req.t("books.CreatedSuccess"), book: populated });
  } catch (err) {
    res.status(500).json({ message: req.t("books.CreateError") });
  }
};

// controllers/book.controller.js
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate("author", "name email")
      .populate("borrower", "name email")
      .populate("libraries", "name address");

    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ message: req.t("books.FetchError") });
  }
};

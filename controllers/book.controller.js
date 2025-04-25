const Book = require("../models/Book.model");
const bucket = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

exports.createBook = async (req, res) => {
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
};

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

const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");
const authMiddleware = require("../middleware/auth.middleware");

// List & Detail
router.get("/", authMiddleware, getAllBooks);
router.get("/:id", authMiddleware, getBookById);

// 🎯 Create book w/ cover upload
// client must send multipart/form-data with field 'coverImage'
router.post("/", authMiddleware, upload.single("coverImage"), createBook);

// Update & Delete
// (we include multer here to accept a file if you choose to update images later)
router.put("/:id", authMiddleware, upload.single("coverImage"), updateBook);
router.delete("/:id", authMiddleware, deleteBook);

module.exports = router;

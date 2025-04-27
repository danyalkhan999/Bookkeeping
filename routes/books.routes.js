const router = require("express").Router();
const {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");
const { borrowBook, returnBook } = require("../controllers/borrow.controller");
const { auth } = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/role.middleware");

// List & Detail
router.get("/", auth, getAllBooks);
router.get("/:id", auth, getBookById);

// 🎯 Create book w/ cover upload
// client must send multipart/form-data with field 'coverImage'
// router.post("/", auth, upload.single("coverImage"), createBook);
router.post("/", auth, createBook);

// Update & Delete
// (we include multer here to accept a file if you choose to update images later)
// router.put("/:id", auth, upload.single("coverImage"), updateBook);
router.put("/:id", auth, updateBook);
router.delete("/:id", auth, deleteBook);

// Borrow & Return APIs (nested under books)
router.post("/:id/borrow", auth, borrowBook);
router.put("/:id/return", auth, checkRole("borrower"), returnBook);

module.exports = router;

const router = require("express").Router();
const {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");
const { auth } = require("../middlewares/auth.middleware");

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

module.exports = router;

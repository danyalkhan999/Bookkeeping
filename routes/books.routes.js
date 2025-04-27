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
const upload = require("../middlewares/upload.middleware");

// List & Detail
router.get("/", auth, getAllBooks);
router.get("/:id", auth, getBookById);

// 🎯 Create book w/ cover upload
// client must send multipart/form-data with field 'coverImage'
// router.post("/", auth, upload.single("coverImage"), creat--eBook);
router.post("/", auth, upload.single("coverImage"), createBook);
router.put("/:id", auth, upload.single("coverImage"), updateBook);
router.delete("/:id", auth, deleteBook);

// Borrow & Return APIs (nested under books)
router.post("/:id/borrow", auth, borrowBook);
router.put("/:id/return", auth, checkRole("borrower"), returnBook);

module.exports = router;

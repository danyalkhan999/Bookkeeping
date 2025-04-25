const express = require("express");
const router = express.Router();
const { getAllBooks, createBook } = require("../controllers/book.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getAllBooks);

// 🎯 Create book w/ cover upload
// client must send multipart/form-data with field 'coverImage'
router.post("/", auth, upload.single("coverImage"), createBook);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getAllBooks } = require("../controllers/book.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getAllBooks);

module.exports = router;

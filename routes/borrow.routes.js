const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const checkRoute = require("../middlewares/role.middleware");
const { borrowBook, returnBook } = require("../controllers/borrow.controller");

// Borrow a book
router.post("/", auth, borrowBook);

// Return a book
router.put("/return/:id", auth, checkRole("borrower"), returnBook);

module.exports = router;

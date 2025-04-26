const router = require("express").Router({ mergeParams: true });
const { auth } = require("../middleware/auth.middleware");
const checkRole = require("../middlewares/role.middleware");
const {
  getInventory,
  addToInventory,
  removeFromInventory,
} = require("../controllers/libraryInventory.controller");

// Anyone authenticated can view inventory
router.get("/", auth, getInventory);

// Only authors can add/remove books
router.post("/", auth, checkRole("author"), addToInventory);
router.delete("/:bookId", auth, checkRole("author"), removeFromInventory);

module.exports = router;

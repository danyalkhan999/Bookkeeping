const router = require("express").Router();
const { auth } = require("../middlewares/auth.middleware");
const inventoryRoutes = require("../routes/libraryInventory.route");
const {
  createLibrary,
  getAllLibraries,
  getLibraryById,
  updateLibrary,
  deleteLibrary,
} = require("../controllers/library.controller");

// All routes require auth
router.get("/", auth, getAllLibraries);
router.get("/:id", auth, getLibraryById);
router.post("/", auth, createLibrary);
router.put("/:id", auth, updateLibrary);
router.delete("/:id", auth, deleteLibrary);

// Inventory sub-routes
router.use("/:id/inventory", inventoryRoutes);

module.exports = router;

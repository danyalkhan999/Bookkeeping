// models/Book.model.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    coverImage: { type: String }, // URL from Firebase
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    libraries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Library" }],
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);

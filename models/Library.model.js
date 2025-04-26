const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
});

module.exports = mongoose.model("Library", librarySchema);

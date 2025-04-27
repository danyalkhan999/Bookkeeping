const express = require("express");
const cors = require("cors");
const i18nMiddleware = require("./utils/i18n");

const app = express();

app.use(express.json());
app.use(i18nMiddleware);
app.use(cors());

const userRoutes = require("./routes/user.routes");
const booksRoutes = require("./routes/books.routes");
const libraryRoutes = require("./routes/library.routes");
app.use("/api/user", userRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/libraries", libraryRoutes);

app.get("/hi", (req, res) => {
  console.log("HIIIIIII");
  const message = req.t("users.Hello");
  res.send({ message });
});

module.exports = app;

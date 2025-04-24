const express = require("express");
const cors = require("cors");
const i18nMiddleware = require("./utils/i18n");

const app = express();

app.use(express.json());
app.use(i18nMiddleware);
app.use(cors());

const userRoutes = require("./routes/user.routes");
app.use("/api/user", userRoutes);

app.get("/hi", (req, res) => {
  console.log("HIIIIIII");
  const message = req.t("users.Hello");
  res.send({ message });
});

module.exports = app;

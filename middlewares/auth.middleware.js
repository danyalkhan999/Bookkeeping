const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

exports.auth = async (req, res, next) => {
  const token = req.header.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: req.t("users.Unauthorized") });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ message: req.t("users.InvalidToken") });
  }
};

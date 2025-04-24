const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { language } = req.body;
  if (language) {
    req.i18n.changeLanguage(language);
  }

  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: req.t("users.RegisterSuccess") });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: req.t("users.InvalidCredentials") });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  res.json({ token, message: req.t("users.LoginSuccess") });
};

const express = require("express");
const { signUp, tokenIsValid } = require("../controller/authController");
const auth = require("../middlewares/auth");
const User = require("../models/userShcema");
const authRoute = express.Router();

authRoute.post("/api/signup", signUp);

authRoute.post("/tokenIsValid", tokenIsValid);

authRoute.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.status(200).json({ ...user._doc, token: req.token });
});

module.exports = authRoute;

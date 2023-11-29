const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-access-token");
    if (!token)
      return res.status(401).json({ message: "No auth token, access denied" });

    const verified = jwt.verify(token, "taskMaster");
    if (!verified)
      return res
        .status(401)
        .json({ message: "Token verification failed, authorization denied." });

    req.user = verified.id;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = auth;

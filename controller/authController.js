const User = require("../models/userShcema");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    const { displayName, email, profilePicture, deviceToken } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      totalUser = (await User.countDocuments()) + 1;
      console.log(totalUser);

      let user = User({
        uniqueId: `TM00${totalUser}`,
        displayName,
        email,
        profilePicture,
        deviceToken,
      });
      user = await user.save();
      const token = jwt.sign({ id: user._id }, "taskMaster");
      console.log(token);
      return res.status(200).json({ token, ...user._doc });
    }
    const token = jwt.sign({ id: user._id }, "taskMaster");
    console.log(token);
    res.status(200).json({ token, ...user._doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.tokenIsValid = async (req, res) => {
  try {
    const token = req.header("x-access-token");
    if (!token) return res.status(401).json(false);
    const verified = jwt.verify(token, "taskMaster");
    if (!verified) return res.status(401).json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.status(401).json(false);
    res.status(200).json(true);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookie;
    if (!token) {
      return res.status(401).json({
        message: "please enter first",
      });
    }

    const decoded = await jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(decoded._id);

    next();
  } catch (error) {
    res.status(500).json({
        message:error.message
    })
  }
};

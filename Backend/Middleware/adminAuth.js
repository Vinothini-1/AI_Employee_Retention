const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.header("authorization").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admins Only" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

const User = require("../models/user");
const jwt = require("jsonwebtoken")
const userAuth = async (req, res, next) => {
    try {
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json({ error: "Unauthorized", message: "Please log in to continue." });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);
  
      if (!user) {
        return res.status(404).json({ error: "User Not Found", message: "No user associated with this token." });
      }
  
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid Token", message: "Your session has expired or token is invalid." });
    }
  };
  
const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== "super-admin") {
        return res.status(403).json({ message: "Access denied. Super Admins only." });
    }
    next();
};
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = {
    userAuth,isSuperAdmin,isAdmin,
}

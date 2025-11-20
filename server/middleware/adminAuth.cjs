const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

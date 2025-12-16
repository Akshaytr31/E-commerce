const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Access Denied. No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SELLER_SECRET_KEY");
    req.seller = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

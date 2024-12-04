const User = require("../modals/User");
const jwt = require("jsonwebtoken");
const JWT_secret = require("../keys");

module.exports = authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_secret);
    const user = await User.findOne({
      _id: decoded.userId,
    });

    if (!user) {
      throw new Error("invalid user");
    }
    if (user.role != "admin") {
      throw new Error("not admin");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Invalid admin auth" });
  }
};

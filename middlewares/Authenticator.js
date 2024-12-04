const User = require("../modals/User");
const JWT_secret = require("../keys");
const jwt  = require('jsonwebtoken');


module.exports = authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_secret);
    const user = await User.findOne({
      _id: decoded.userId,
    });

    if (!user) {
      throw new Error("invalid user token");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    res.status(401).send({ error});
  }
};

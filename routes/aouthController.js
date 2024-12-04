const express = require("express");
const User = require("../modals/User");
const { check, validationResult } = require("express-validator");
const JWT_secret = require("../keys");
const jwt = require('jsonwebtoken');  
const bcrypt = require('bcrypt');
const AdminAuth = require("../middlewares/AdminAuth");
const router = express.Router();


//admin test: admin@health.com
//admin@123
// User Registration Controller
const registerUser = async (req, res) => {
  let success = false;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success, error: errors });
      return;
    }
    const { email, password, firstName, lastName,dateOfBirth } = req.body;
    const role = "patient";
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success, error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object based on role
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      dateOfBirth,
    };


    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_secret);
    success = true;
    res.status(201).json({ success, user, token });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success, error });
  }
};

const registerDoctor = async (req, res) => {
  let success = false;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //invalid inputs
      res.status(400).json({ success, error: errors.error[0].msg });
      return;
    }
    const {
      email,
      password,
      firstName,
      lastName,
      specialization,
      medicalLicense,
    } = req.body;
    const role = "doctor";
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success, error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object based on role
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    };

    // Add role-specific fields
    if (role === "doctor") {
      userData.specialization = specialization;
      userData.medicalLicense = medicalLicense;
    }

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_secret);
    success = true;
    res.status(201).json({ success, user, token });
  } catch (error) {
    res.status(500).json({ success, error });
  }
};

// User Login Controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Login failed" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Login failed" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_secret);
    res.json({ token , msg: 'login successs'});
  } catch (error) {
    console.log(error)
    res.status(400).json({error});
  }
};

router.post(
  "/register",
  [
    check("email", "Please enter valid email")
      .isEmail()
      .isLength({ min: 10, max: 30 }),
    check("firstName", "Name length should be 3 to 20 characters").isLength({
      min: 3,
      max: 20,
    }),
    check("dateOfBirth","please enter your DOB"),
    check(
      "password",
      "Password length should be atleast 8 to 10 characters"
    ).isLength({ min: 8 }),
  ],
  registerUser
);
router.post("/login", loginUser);
router.post(
  "/admin/registerDoc",
  [
    check("email", "Please enter valid email")
      .isEmail()
      .isLength({ min: 10, max: 30 }),
    check("firstName", "Name length should be 3 to 20 characters").isLength({
      min: 3,
      max: 20,
    }),
    check(
      "password",
      "Password length should be atleast 8 to 10 characters"
    ).isLength({ min: 8 }),
  ],
  AdminAuth,
  registerDoctor
);

module.exports = router;

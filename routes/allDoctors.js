const Authenticator = require("../middlewares/Authenticator");
const User = require("../modals/User");
const express = require("express");
const router = express.Router();


// Get Doctors List Controller
const getDoctorsList = async (req, res) => {
    try {
      // Filtering options
      const filters = {};
  
      // Filter by specialization if provided
      if (req.query.specialization) {
        filters.specialization = req.query.specialization;
      }
  
      // Search by name
      if (req.query.search) {
        filters.$or = [
          { firstName: { $regex: req.query.search, $options: 'i' } },
          { lastName: { $regex: req.query.search, $options: 'i' } }
        ];
      }
  
      // Find doctors with filtering
      const doctors = await User.find({ 
        role: 'doctor', 
        ...filters 
      })
      .select('-password') // Exclude password
      .sort({ firstName: 1 }); // Sort alphabetically by first name
  
      res.send(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).send({ error: 'Error fetching doctors list' });
    }
  };
  
  // Add this route to the existing route setup
  router.get('/doctors', Authenticator, getDoctorsList);

  module.exports = router;
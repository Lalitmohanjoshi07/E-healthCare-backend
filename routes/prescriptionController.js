const express = require('express');
const User = require('../modals/User');
const authenticateUser = require('../middlewares/Authenticator');
const router = express.Router();



// Prescription Creation Controller
const createPrescription = async (req, res) => {
    try {
      const { patientId, medications, instructions } = req.body;
      const doctorId = req.user._id;
  
      // Validate patient and doctor
      const patient = await User.findOne({ _id: patientId, role: 'patient' });
      const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
  
      if (!patient || !doctor) {
        return res.status(404).send({ error: 'Invalid patient or doctor' });
      }
  
      const prescription = new Prescription({
        doctor: doctorId,
        patient: patientId,
        medications,
        instructions
      });
  
      await prescription.save();
  
      res.status(201).send(prescription);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  

  router.post('/prescriptions', authenticateUser, createPrescription);

module.exports = router;
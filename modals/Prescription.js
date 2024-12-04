const mongoose = require('mongoose');


// Prescription Schema
const PrescriptionSchema = new mongoose.Schema({
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    medications: [{
      name: {
        type: String,
        required: true
      },
      dosage: {
        type: String,
        required: true
      },
      frequency: {
        type: String,
        required: true
      }
    }],
    instructions: {
      type: String
    },
    issuedDate: {
      type: Date,
      default: Date.now
    }
  });

  const Prescription = mongoose.model('Prescription', PrescriptionSchema);

  module.exports = Prescription;
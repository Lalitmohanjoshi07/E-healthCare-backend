const mongoose = require('mongoose');


// User Schema (Patient and Doctor)
const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['patient', 'doctor','admin'],
      required: true
    },
    // Doctor-specific fields
    specialization: {
      type: String,
      required: function() { return this.role === 'doctor'; }
    },
    medicalLicense: {
      type: String,
      required: function() { return this.role === 'doctor'; }
    },
    //doctor-specific field
    fee:{
      type: String,
      required: function(){return this.role === 'doctor';}
    },
    // Patient-specific fields
    dateOfBirth: {
      type: Date,
      required: function() { return this.role === 'patient'; }
    },
    medicalHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalRecord'
    }]
  }, { 
    timestamps: true 
  });


  
const User = mongoose.model('User', UserSchema);

module.exports = User
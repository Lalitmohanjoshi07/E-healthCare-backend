const mongoose = require("mongoose");

// Session Schema
const SessionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "completed", "cancelled"],
    default: "requested",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

// Create Models
const Session = mongoose.model("Session", SessionSchema);
module.exports = Session;

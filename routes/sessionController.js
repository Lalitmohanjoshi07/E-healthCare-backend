const express = require("express");
const User = require("../modals/User");
const Session = require("../modals/Session");
const authenticateUser = require("../middlewares/Authenticator");
const router = express.Router();

// Session Request Controller
const requestSession = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const patientId = req.user._id;

    // Check if doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).send({ error: "Doctor not found" });
    }

    // Create new session
    const session = new Session({
      patient: patientId,
      doctor: doctorId,
      status: "requested",
    });

    await session.save();

    res.status(201).send(session);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Fetch Sessions for Patients
const getPatientSessions = async (req, res) => {
  try {
    // Ensure only patients can access their own sessions
    if (req.user.role !== "patient") {
      return res.status(403).send({ error: "Unauthorized access" });
    }

    // Find all sessions for the patient and populate doctor details
    const sessions = await Session.find({ patient: req.user._id })
      .populate("doctor", "firstName lastName email specialization")
      .sort({ requestedAt: -1 }); // Sort by most recent first

    res.send(sessions);
  } catch (error) {
    res.status(500).send({ error: "Error fetching sessions" });
  }
};

// Fetch Sessions for Doctors
const getDoctorSessions = async (req, res) => {
  try {
    // Ensure only doctors can access their own sessions
    if (req.user.role !== "doctor") {
      return res.status(403).send({ error: "Unauthorized access" });
    }

    // Find all sessions for the doctor and populate patient details
    const sessions = await Session.find({ doctor: req.user._id })
      .populate("patient", "firstName lastName email")
      .sort({ requestedAt: -1 }); // Sort by most recent first

    res.send(sessions);
  } catch (error) {
    res.status(500).send({ error: "Error fetching sessions" });
  }
};

// Update Session Status Controller
const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;
    console.log(status);

    // Ensure only doctors can update session status
    if (req.user.role !== "doctor") {
      return res.status(403).send({
        error: "Unauthorized: Only doctors can update session status",
      });
    }

    // Valid status options
    const validStatuses = ["requested", "accepted", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ error: "Invalid session status" });
    }

    // Find the session and verify the doctor
    const session = await Session.findOne({
      _id: sessionId,
      doctor: req.user._id,
    });

    if (!session) {
      return res.status(404).send({ error: "Session not found" });
    }
    console.log("i am here");
    // Manually validate status transition
    const statusFlow = {
      requested: ["accepted", "cancelled"],
      accepted: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    // Check if the status transition is valid
    const isValidTransition = statusFlow[session.status]?.includes(status);

    if (!isValidTransition) {
      return res.status(400).send({
        error: "Invalid session status transition",
        currentStatus: session.status,
        requestedStatus: status,
      });
    }
    // Update session status
    session.status = status;

    Session.updateOne(
      { _id: session._id },
      {
        $set: {
          status: status ,
          ...(status === "completed" ? { completedAt: new Date() } : {}),
        },
      }
    );
    session.save();
    // Populate doctor and patient details for the response
    await session.populate("doctor", "firstName lastName");
    await session.populate("patient", "firstName lastName email");

    res.send(session);
  } catch (error) {
    console.error("Session update error:", error);
    res.status(500).send({ error: "Error updating session status" });
  }
};

router.patch(
  "/sessions/:sessionId/status",
  authenticateUser,
  updateSessionStatus
);
router.get("/sessions/patient", authenticateUser, getPatientSessions);
router.get("/sessions/doctor", authenticateUser, getDoctorSessions);
router.post("/request", authenticateUser, requestSession);

module.exports = router;

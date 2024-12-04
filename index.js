const connectToDb = require("./db");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/aouthController");
const prescriptionRoutes = require("./routes/prescriptionController");
const sessionRoutes = require("./routes/sessionController");
const allDoctors = require("./routes/allDoctors")

const app = express();
const port = 5000;
connectToDb();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).json({ status: "all good!" }));
app.use("/auth", authRoutes);
app.use("/api", sessionRoutes);
app.use("/api", prescriptionRoutes);
app.use('/api', allDoctors)
app.listen(port, () =>
  console.log(`Medical backend listening to ${port} port`)
);

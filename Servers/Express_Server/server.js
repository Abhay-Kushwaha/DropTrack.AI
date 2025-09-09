const express = require("express");
const cors = require("cors");
const cityRoutes = require("./routes/cityRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authorityRoutes = require("./routes/authorityRoutes");
const analysisRoutes = require("./routes/analysisRoute");
const reasonRoutes = require("./routes/reasonRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const feesRoutes = require("./routes/feesRoutes");
const marksRoutes = require("./routes/marksRoutes");
const counsellingRoutes = require("./routes/counsellingRoutes");
const app = express();

//dbconnection
require("./config/dbconfig").getDbconnection();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,
}));

app.use("/", analysisRoutes);
app.use("/", cityRoutes);
app.use("/", schoolRoutes);
app.use("/", studentRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/", authorityRoutes);
app.use("/", reasonRoutes);
app.use("/", mentorRoutes);
app.use("/", subjectRoutes);
app.use("/", feesRoutes);
app.use("/", marksRoutes);
app.use("/", counsellingRoutes);

app.get("/", (req, res) => {
  res.send("Hello From Backend Server");
});

app.listen(3000);
console.log("server started at 3000");

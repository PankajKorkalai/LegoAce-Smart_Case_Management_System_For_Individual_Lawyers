const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./db/db");
const uploadRouter = require("./routes/upload");
const userRouter = require("./routes/user");
// 1. ADD THIS IMPORT
const scheduleRouter = require("./routes/schedule"); 

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.get("/", (req, res) => {
  res.send("Backend running with CommonJS 🚀");
});

app.use("/api", uploadRouter);
app.use("/user", userRouter);
// 2. MOUNT THE NEW ROUTER
app.use("/api/meetings", scheduleRouter); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
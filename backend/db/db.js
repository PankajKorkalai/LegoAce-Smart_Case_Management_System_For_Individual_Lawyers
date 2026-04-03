const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔵 MongoDB URI:", process.env.MONGO_URL);

    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection FAILED:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
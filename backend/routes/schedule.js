const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const User = require("../models/UserModel"); 
const Meeting = require("../models/MeetingModel"); // 1. IMPORT NEW MODEL

// Fetch all users for the dropdown
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 2. NEW ROUTE: Fetch all upcoming meetings
router.get("/upcoming", async (req, res) => {
  try {
    // Sort by newest first
    const meetings = await Meeting.find().sort({ dateSent: -1 });
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
});

// Configure standard email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.USER, pass: process.env.PASS },
});

// Send the Cal.com link and SAVE to database
router.post("/schedule", async (req, res) => {
  const { email } = req.body;

  try {
    const client = await User.findOne({ email });
    if (!client) return res.status(404).json({ error: "User not found" });

    const calComUrl = `https://cal.com/gaurishankar-tjazna/15min?name=${encodeURIComponent(
      client.name || "Client"
    )}&email=${encodeURIComponent(client.email)}`;

    const mailOptions = {
      from: '"Legal Team" <your-email@example.com>',
      to: client.email,
      subject: "Book your Video Consultation",
      html: `
        <h3>Hello ${client.name || "there"},</h3>
        <p>Please select a time for our video consultation using the link below.</p>
        <a href="${calComUrl}" style="padding: 10px 20px; background-color: #166534; color: white; text-decoration: none; border-radius: 5px;">
          Select a Time
        </a>
      `,
    };

    await transporter.sendMail(mailOptions);

    // 3. SAVE THE MEETING TO THE DATABASE
    const newMeeting = new Meeting({
      clientName: client.name || "Client",
      clientEmail: client.email,
    });
    await newMeeting.save();

    res.status(200).json({ message: "Cal.com link sent and meeting logged!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send invitation" });
  }
});

module.exports = router;
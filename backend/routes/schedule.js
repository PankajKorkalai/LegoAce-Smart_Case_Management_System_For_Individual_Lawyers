const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// CORRECTED PATH: Going up one level from routes, into models
const User = require("../models/UserModel"); 

// 1. GET route to fetch all users for the dropdown
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Configure standard email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
});

// 2. POST route to send the Cal.com link
router.post("/schedule", async (req, res) => {
  const { email } = req.body;

  try {
    const client = await User.findOne({ email });
    if (!client) return res.status(404).json({ error: "User not found" });

    // YOUR CAL.COM LINK (Replace 'your-username/15min' with your actual link)
    const calComUrl = `https://cal.com/your-username/15min?name=${encodeURIComponent(
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
    res.status(200).json({ message: "Cal.com link sent successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send invitation" });
  }
});

module.exports = router;
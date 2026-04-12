const express = require("express");
const Userrouter = express.Router();
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const z = require('zod');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpgenerator = require("otp-generator");
const sendemail = require("../otplogic/otp");
const OtpModel = require("../models/OtpModel");
const UserModel = require("../models/UserModel");
const JWT_KEY = process.env.JWT_KEY;
const caseModel = require("../models/CaseModel");
const clientModel = require("../models/Clients.model");

Userrouter.post("/register", async function (req, res) {
  console.log("register api called");
  console.log("body ", req.body);

  const requiredatas = z.object({
    name: z.string().min(3).max(100),
    email: z.string().min(5).max(100).email(),
    password: z.string().min(5).max(100),
  })

  let registerUser = null;
  const checkdata = requiredatas.safeParse(req.body);

  if (!checkdata.success) {
    res.json({ message: "Invalid_types" });
    return;
  }

  const {
    name,
    email,
    password,
  } = req.body;

  const hashedpassword = await bcrypt.hash(password, 5);
  const checkAlreadyEmailExistOrNot = await UserModel.findOne({ email: email });

  if (checkAlreadyEmailExistOrNot) {
    res.json({
      message: "Email_Present"
    })
    return;
  }

  registerUser = await UserModel.create({
    name: name,
    password: hashedpassword,
    email: email,
    lastLoginDate: null
  });

  res.json({
    registerUser
  })
})

Userrouter.post("/login", async function (req, res) {
  const requiredatas = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(5).max(100),
  });

  console.log("login api called");
  console.log("body ", req.body);

  const checkdata = requiredatas.safeParse(req.body);
  if (!checkdata.success) {
    return res.json({ message: checkdata.error });
  }

  const { email, password } = req.body;

  const checkedUser = await UserModel.findOne({ email });

  if (!checkedUser) {
    return res.json({ message: "User_not_exists" });
  }

  const finduser = await bcrypt.compare(password, checkedUser.password);

  if (!finduser) {
    return res.json({ message: "User_not_exists" });
  }

  const lastLoginDate = checkedUser.lastLoginDate;

  await UserModel.findOneAndUpdate(
    { _id: checkedUser._id },
    { $set: { lastLoginDate: new Date() } }
  );

  const token = jwt.sign({ id: checkedUser._id }, JWT_KEY);

  return res.json({
    token,
    message: "logedin",
    userId: checkedUser._id,
    name: checkedUser.name,
  });
});

Userrouter.post("/google-login", async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "No Google token provided" });
  }

  try {
    console.log("Google login verification starting...");
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    console.log("Verified Google User:", email);

    let user = await UserModel.findOne({ email });

    if (!user) {
      console.log("New user detected, creating record...");
      user = await UserModel.create({
        email,
        name,
        verified: true,
        lastLoginDate: new Date()
      });
    } else {
      console.log("Existing user detected, updating last login...");
      user.lastLoginDate = new Date();
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, JWT_KEY);

    return res.json({
      token,
      message: "logedin",
      userId: user._id,
      name: user.name,
    });

  } catch (error) {
    console.error("Google login failed:", error);
    return res.status(400).json({ message: "Invalid Google token" });
  }
});

Userrouter.post("/addcase", async (req, res) => {
  try {
    const {
      caseTitle,
      client,
      clientEmail,
      priority,
      status,
      assignedTo,
      caseDescription,
      nextHearing,
      documentsCount,
      userId,
    } = req.body;

    if (!caseTitle || !client) {
      return res.status(400).json({
        message: "caseTitle and client are required",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Lawyer user not found",
      });
    }

    const newcase = await caseModel.create({
      caseTitle,
      client,
      clientEmail,
      priority,
      status,
      assignedTo,
      caseDescription,
      nextHearing,
      documentsCount,
      createdBy: user._id // Link case to lawyer
    });

    user.cases.push(newcase._id);
    await user.save();

    res.json({
      message: "Case added successfully",
      case: newcase,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET all cases (Filtered by Lawyer)
Userrouter.get("/getcases", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { createdBy: userId } : {};

    const cases = await caseModel.find(query).sort({ createdAt: -1 });
    res.json({ cases });
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({ message: "Failed to fetch cases" });
  }
});

// GET all clients for the Add Case dropdown (Filtered by Lawyer)
Userrouter.get("/getclients", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { createdBy: userId } : {};

    const clients = await clientModel.find(query).sort({ name: 1 });
    res.json({ clients });
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
});

const sendFeedbackEmail = require("../utils/sendFeedbackEmail");

Userrouter.put("/updatestatus/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const caseId = req.params.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedCase = await caseModel.findByIdAndUpdate(
      caseId,
      { status },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (status.toLowerCase() === "closed") {
      const clientEmail = updatedCase.clientEmail;
      if (clientEmail) {
        sendFeedbackEmail(clientEmail, updatedCase.caseTitle, updatedCase._id, updatedCase.assignedTo)
          .catch(err => console.error("Failed to send feedback email in background:", err));
      }
    }

    res.json({ message: "Status updated successfully", case: updatedCase });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const sendAlertEmail = require("../utils/sendAlertEmail");

Userrouter.post("/sendalert", async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await sendAlertEmail(email, subject, message);

    res.json({ message: "Alert sent successfully" });
  } catch (err) {
    console.error("Error sending alert:", err);
    res.status(500).json({ message: "Failed to send alert email" });
  }
});

Userrouter.put("/updatecase/:id", async (req, res) => {
  try {
    const caseId = req.params.id;
    const updateData = req.body;

    const updatedCase = await caseModel.findByIdAndUpdate(
      caseId,
      updateData,
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (updateData.status && updateData.status.toLowerCase() === "closed") {
      const clientEmail = updatedCase.clientEmail;
      if (clientEmail) {
        sendFeedbackEmail(clientEmail, updatedCase.caseTitle, updatedCase._id, updatedCase.assignedTo)
          .catch(err => console.error("Failed to send feedback email in background:", err));
      }
    }

    res.json({ message: "Case updated successfully", case: updatedCase });
  } catch (err) {
    console.error("Error updating case:", err);
    res.status(500).json({ message: "Server error" });
  }
});

Userrouter.delete("/deletecase/:id", async (req, res) => {
  try {
    const caseId = req.params.id;
    const caseToDelete = await caseModel.findById(caseId);
    if (!caseToDelete) {
      return res.status(404).json({ message: "Case not found" });
    }
    if (caseToDelete.createdBy) {
      await UserModel.findByIdAndUpdate(caseToDelete.createdBy, { $pull: { cases: caseId } });
    }
    await caseModel.findByIdAndDelete(caseId);
    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    console.error("Error deleting case:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = Userrouter;
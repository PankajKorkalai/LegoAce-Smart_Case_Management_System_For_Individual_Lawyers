const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const UserModel = require("../models/UserModel");
const CaseModel = require("../models/CaseModel");
const DocumentModel = require("../models/Documents.model");
const ClientModel = require("../models/Clients.model");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || "secret");
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// GET current user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    
    if (!user) {
        console.log("user not found");
        
      return res.status(404).json({ error: "User not found" });
    }

    // Format response
    const profileData = {
      _id: user._id,
      email: user.email,
      name: user.name,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
      title: user.title || "",
      specialization: user.specialization || "",
      practiceAreas: user.practiceAreas || [],
      barNumber: user.barNumber || "",
      yearsOfExperience: user.yearsOfExperience || 0,
      education: user.education || [],
      languages: user.languages || [],
      profilePicture: user.profilePicture || { url: "", publicId: "" },
      socialLinks: user.socialLinks || { linkedin: "", twitter: "", website: "" },
      role: user.role || "user",
      joinDate: user.joinDate || user.createdAt || new Date(),
      lastLoginDate: user.lastLoginDate,
    };

    res.json(profileData);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    res.status(500).json({ error: "Unable to fetch profile" });
  }
});

// UPDATE personal information
router.put("/profile/personal-info", verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;

    const updateData = {
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
      address: address || "",
    };

    // If email is being updated, check if it's already taken
    if (email) {
      const existingUser = await UserModel.findOne({ email, _id: { $ne: req.userId } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      updateData.email = email;
      
      // Update name field for backward compatibility
      if (firstName && lastName) {
        updateData.name = `${firstName} ${lastName}`;
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      message: "Personal information updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Failed to update personal info:", error);
    res.status(500).json({ error: "Unable to update personal information" });
  }
});

// UPDATE bio
router.put("/profile/bio", verifyToken, async (req, res) => {
  try {
    const { bio } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      { bio: bio || "" },
      { new: true }
    ).select("-password");

    res.json({
      message: "Bio updated successfully",
      bio: updatedUser.bio
    });
  } catch (error) {
    console.error("Failed to update bio:", error);
    res.status(500).json({ error: "Unable to update bio" });
  }
});

// UPDATE professional information
router.put("/profile/professional", verifyToken, async (req, res) => {
  try {
    const { title, specialization, practiceAreas, barNumber, yearsOfExperience, education, languages, socialLinks } = req.body;

    const updateData = {
      title: title || "",
      specialization: specialization || "",
      practiceAreas: practiceAreas || [],
      barNumber: barNumber || "",
      yearsOfExperience: yearsOfExperience || 0,
      education: education || [],
      languages: languages || [],
      socialLinks: socialLinks || { linkedin: "", twitter: "", website: "" },
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      message: "Professional information updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Failed to update professional info:", error);
    res.status(500).json({ error: "Unable to update professional information" });
  }
});

// UPLOAD profile picture
router.post("/profile/upload-picture", verifyToken, upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await UserModel.findById(req.userId);
    
    // Delete old profile picture from Cloudinary if exists
    if (user.profilePicture?.publicId) {
      await cloudinary.uploader.destroy(user.profilePicture.publicId);
    }

    // Upload new image to Cloudinary
    const base64File = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64File}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: "profile_pictures",
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" }
      ],
    });

    // Update user with new profile picture
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      {
        profilePicture: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        },
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile picture updated successfully",
      profilePicture: updatedUser.profilePicture
    });
  } catch (error) {
    console.error("Failed to upload profile picture:", error);
    res.status(500).json({ error: "Unable to upload profile picture" });
  }
});

// DELETE profile picture
router.delete("/profile/picture", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    
    if (user.profilePicture?.publicId) {
      await cloudinary.uploader.destroy(user.profilePicture.publicId);
    }

    await UserModel.findByIdAndUpdate(req.userId, {
      profilePicture: { url: "", publicId: "" }
    });

    res.json({ message: "Profile picture removed successfully" });
  } catch (error) {
    console.error("Failed to delete profile picture:", error);
    res.status(500).json({ error: "Unable to delete profile picture" });
  }
});

// GET user activity stats
router.get("/profile/activity-stats", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch user's cases
    const userCases = await CaseModel.find({ createdBy: req.userId });
    const userCaseIds = userCases.map(c => c._id);
    const userCaseTitles = userCases.map(c => c.caseTitle);

    // Count documents associated with these cases
    const documentCount = await DocumentModel.countDocuments({ 
      caseName: { $in: userCaseTitles } 
    });

    // Count unique clients in these cases
    const uniqueClients = [...new Set(userCases.map(c => c.client))].length;

    const stats = {
      joinDate: user.joinDate,
      lastLoginDate: user.lastLoginDate,
      yearsOfExperience: user.yearsOfExperience || 0,
      totalCases: userCases.length,
      totalDocuments: documentCount,
      totalClients: uniqueClients,
    };

    res.json(stats);
  } catch (error) {
    console.error("Failed to fetch activity stats:", error);
    res.status(500).json({ error: "Unable to fetch activity statistics" });
  }
});

module.exports = router;
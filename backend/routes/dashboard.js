const express = require("express");
const jwt = require("jsonwebtoken");
const CaseModel = require("../models/CaseModel");
const ClientModel = require("../models/Clients.model");
const DocumentModel = require("../models/Documents.model");
const MeetingModel = require("../models/MeetingModel");

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || "secret");
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Header Metrics
    const activeCasesCount = await CaseModel.countDocuments({ createdBy: userId, status: "active" });
    const totalClientsCount = await ClientModel.countDocuments(); // Fetch all clients irrespective of user validation

    // For documents, we count docs belonging to user's cases
    const userCases = await CaseModel.find({ createdBy: userId });
    const userCaseTitles = userCases.map(c => c.caseTitle);
    const totalDocsCount = await DocumentModel.countDocuments({ caseName: { $in: userCaseTitles } });

    const upcomingHearingsCount = await CaseModel.countDocuments({
      createdBy: userId,
      nextHearing: { $gte: new Date() }
    });

    // 2. Case Status Distribution (Pie Chart)
    const statusDistribution = await CaseModel.aggregate([
      { $match: { createdBy: new (require("mongoose").Types.ObjectId)(userId) } },
      { $group: { _id: "$status", value: { $sum: 1 } } }
    ]);

    const pieData = statusDistribution.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.value,
      color: item._id === "active" ? "#166534" :
        item._id === "closed" ? "#0f766e" :
          item._id === "on-hold" ? "#b91c1c" : "#a16207"
    }));

    // 3. Case Volume Trends (Area Chart - Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const trends = await CaseModel.aggregate([
      {
        $match: {
          createdBy: new (require("mongoose").Types.ObjectId)(userId),
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendData = [];

    // Generate last 6 months list
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = months[d.getMonth()];
      const mNum = d.getMonth() + 1;
      const yNum = d.getFullYear();

      const found = trends.find(t => t._id.month === mNum && t._id.year === yNum);
      trendData.push({
        name: mName,
        new: found ? found.count : 0,
        resolved: Math.floor((found ? found.count : 0) * 0.7) // Simulating resolved cases
      });
    }

    // 4. Recent Cases
    const recentCases = await CaseModel.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Upcoming Events
    const recentMeetings = await MeetingModel.find({
      createdBy: userId,
      meetingTime: { $gte: new Date().toISOString() }
    }).sort({ meetingTime: 1 }).limit(4);

    res.json({
      metrics: {
        activeCases: activeCasesCount,
        totalClients: totalClientsCount,
        totalDocuments: totalDocsCount,
        upcomingHearings: upcomingHearingsCount
      },
      pieData: pieData.length > 0 ? pieData : [
        { name: "No Cases", value: 1, color: "#e5e7eb" }
      ],
      trendData,
      recentCases,
      upcomingEvents: recentMeetings.map(m => ({
        title: m.attendeeName, // Or description if available
        time: new Date(m.meetingTime).toLocaleString(),
        tag: "meeting"
      }))
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

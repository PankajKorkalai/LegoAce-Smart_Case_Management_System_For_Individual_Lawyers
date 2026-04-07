const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema({
  caseTitle: String,
  client: String,
  clientEmail: String,
  clientPhone: String,
  priority: String,
  status: String,
  assignedTo: String,
  caseDescription: String,
  nextHearing: Date,
  documentsCount: Number,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

}, { timestamps: true });

module.exports = mongoose.model("Case", CaseSchema);
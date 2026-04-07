const mongoose = require("mongoose");
const schema = mongoose.Schema;

const CaseSchema = new schema({
  caseTitle: {
    type: String,
    required: true,
  },

  client: {
    type: String,
    required: true,
  },

  clientEmail: String,
  clientPhone: String,

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },

  status: {
    type: String,
    enum: ["active", "pending", "closed"],
    default: "active",
  },

  assignedTo: String,

  caseDescription: String,

  nextHearing: Date,

  documentsCount: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });


const UserSchema = new schema({
  email: {
    type: String,
    unique: true,
  },

  password: String,

  name: String,

  verified: {
    type: Boolean,
    default: false,
  },

  mobileNo: String,

  address: String,

  lastLoginDate: {
    type: Date,
    default: null,
  },

  cases: [CaseSchema],

});

module.exports = mongoose.model("User", UserSchema);
module.exports.Case = mongoose.model("Case", CaseSchema);

const mongoose = require("mongoose");
const schema = mongoose.Schema;

const CaseSchema = require("./CaseModel");

const UserSchema = new schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  name: String, // Full name for backward compatibility
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  bio: { type: String, default: "" },
  title: { type: String, default: "" },
  specialization: { type: String, default: "" },
  practiceAreas: { type: [String], default: [] },
  barNumber: { type: String, default: "" },
  yearsOfExperience: { type: Number, default: 0 },
  education: {
    type: [{
      degree: String,
      institution: String,
      year: String
    }],
    default: []
  },
  languages: { type: [String], default: [] },
  profilePicture: {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" }
  },
  socialLinks: {
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  role: { type: String, default: "user" },
  verified: {
    type: Boolean,
    default: false,
  },
  lastLoginDate: {
    type: Date,
    default: null,
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  cases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);


// module.exports = mongoose.model("User", UserSchema);
// module.exports = mongoose.model("Case", CaseSchema);
const mongoose = require("mongoose");
const schema = mongoose.Schema;

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
  MobileNo: String,
  Address: String,
  lastLoginDate: {
    type: Date,
    default: null,
  },
  // New fields for profile
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  specialization: {
    type: String,
    default: "",
  },
  practiceAreas: [{
    type: String,
  }],
  barNumber: {
    type: String,
    default: "",
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  education: [{
    degree: String,
    institution: String,
    year: String,
  }],
  languages: [{
    type: String,
  }],
  profilePicture: {
    url: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
  },
  socialLinks: {
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ['user', 'lawyer', 'admin'],
    default: 'user',
  },
  joinDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
});

module.exports = mongoose.model("User", UserSchema);
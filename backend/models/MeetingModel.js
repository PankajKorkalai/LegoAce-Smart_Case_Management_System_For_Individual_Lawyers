const mongoose = require("mongoose");
const schema = mongoose.Schema;

const MeetingSchema = new schema({
  clientName: String,
  clientEmail: String,
  caseName: {
    type: String,
    default: "Legal Consultation", // Default case name
  },
  status: {
    type: String,
    default: "Invite Sent",
  },
  dateSent: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Meeting", MeetingSchema);
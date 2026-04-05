const mongoose = require("mongoose");
const schema = mongoose.Schema;



const otpSchema = new schema({
  email: {
    type: String,
    required: false
  },
  otp: {
    type: String
  },
  createdAt: {
    type: Date,
    expires: '5m',
    default: Date.now
  },
  phoneNo: {
    type: String,
    required: false
  },
});


module.exports = mongoose.model("Otp",otpSchema); 
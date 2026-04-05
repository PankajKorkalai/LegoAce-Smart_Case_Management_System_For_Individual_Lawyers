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
    // Last Login of user
    lastLoginDate: {
      type: Date,
      default: null,
    },
  });

module.exports = mongoose.model("User", UserSchema);
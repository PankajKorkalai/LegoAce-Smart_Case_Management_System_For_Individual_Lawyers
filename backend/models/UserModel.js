
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const CaseSchema = require("./CaseModel");

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
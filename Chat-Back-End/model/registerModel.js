const mongoose = require("mongoose");

const registerSchema = mongoose.Schema(
  {
    // _id : { type: mongoose.Schema.Types.ObjectId, ref: 'Profiles' },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    is_online: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Register", registerSchema);

const mongoose = require("mongoose");

const loginSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    user_id: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      require: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Login", loginSchema);
